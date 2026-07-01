const { spawn } = require("child_process");
const path = require("path");

/** Confidence score above this value triggers a block (matches frontend evaluate-comment logic). */
const THRESHOLD = 50;

/**
 * Windows Python launcher — targets the stable 3.12 install via `py -3.12`,
 * isolating us from any default Python 3.14 alias on PATH.
 */
// Detect if running on Windows
const IS_WIN = process.platform === "win32";

// Dynamic Python command: "py" on Windows, "python3" on Linux
const PYTHON_CMD = IS_WIN ? "py" : "python3";

// Windows-specific site packages path (Ignored on Linux)
const PYTHON312_SITE_PACKAGES = IS_WIN 
  ? "C:\\Users\\HP\\AppData\\Local\\Python\\pythoncore-3.12-64\\Lib\\site-packages"
  : "";
/** Absolute path to PipeLined.py — hate_model.h5, spam_model.h5, tokenizers live alongside it. */
const SCRIPT_PATH = path.join(__dirname, "..", "..", "pipeline", "PipeLined.py");

/**
 * Pure decision helper — given hate/spam scores, decide if content should be blocked.
 * Exported for unit tests without spawning Python.
 */
function shouldBlockFromRatings(hateRating, spamRating, threshold = THRESHOLD) {
  return hateRating > threshold || spamRating > threshold;
}

/**
 * Build the child-process environment for Python 3.12.
 * Step A: inherit Node's process.env (PATH, USERPROFILE, etc.)
 * Step B: prepend PYTHONPATH so pip-installed packages are visible to the subprocess
 */
function buildPythonEnv() {
  const baseEnv = { ...process.env };
  
  // Only inject custom PYTHONPATH if we are running locally on Windows
  if (IS_WIN && PYTHON312_SITE_PACKAGES) {
    baseEnv.PYTHONPATH = PYTHON312_SITE_PACKAGES;
  }
  
  return baseEnv;
}

/**
 * Spawn pipeline/PipeLined.py and stream stdout/stderr into buffers.
 *
 * Execution flow:
 *  1. spawn("py", ["-3.12", SCRIPT_PATH, text]) — pin interpreter to 3.12
 *  2. env block forces site-packages path for tensorflow / nltk / numpy
 *  3. stdout chunks accumulate until the child exits (debug lines + final tuple)
 *  4. stderr captured separately for diagnostics only
 *  5. Regex extracts `(hateRating, spamRating)` from stdout
 *  6. Threshold logic decides allow vs block
 *  7. On ANY spawn/parse/exit failure → fail-open (allowed: true, fallback: true)
 */
function runMlPipeline(text) {
  return new Promise((resolve) => {
    let stdoutBuffer = "";
    let stderrBuffer = "";

    try {
      // Step 1 — launch Python 3.12 via Windows py launcher (not bare `python`)
     // Adjust CLI arguments conditionally (-3.12 is only needed for the Windows launcher)
     const spawnArgs = IS_WIN 
     ? ["-3.12", SCRIPT_PATH, String(text)] 
     : [SCRIPT_PATH, String(text)];

   const child = spawn(
     PYTHON_CMD,
     spawnArgs,
     { env: buildPythonEnv() }
   );

      // Step 2 — pipe stdout into a single buffer for tuple parsing
      child.stdout.on("data", (chunk) => {
        stdoutBuffer += chunk.toString();
      });

      // Step 3 — pipe stderr for error logging (does not affect allow/block unless exit != 0)
      child.stderr.on("data", (chunk) => {
        stderrBuffer += chunk.toString();
      });

      // Step 4 — child finished; parse ratings or fail-open
      child.on("close", (exitCode) => {
        if (exitCode !== 0) {
          console.error(
            `[ML] PipeLined.py exited with code ${exitCode}. stderr:`,
            stderrBuffer
          );
          resolve({
            allowed: true,
            fallback: true,
            hateRating: 0,
            spamRating: 0,
          });
          return;
        }

        // Step 5 — extract `(hate, spam)` tuple from accumulated stdout
        const tupleMatch = /\(([^)]+)\)/.exec(stdoutBuffer);
        if (!tupleMatch) {
          console.error(
            "[ML] Could not parse pipeline output:",
            stdoutBuffer.slice(-500)
          );
          resolve({
            allowed: true,
            fallback: true,
            hateRating: 0,
            spamRating: 0,
          });
          return;
        }

        const parts = tupleMatch[1].split(",").map((v) => parseFloat(v.trim()));
        const hateRating = parts[0] || 0;
        const spamRating = parts[1] || 0;

        if (stderrBuffer.trim()) {
          console.error("[ML] PipeLined.py stderr:", stderrBuffer.slice(-800));
        }

        const blocked = shouldBlockFromRatings(hateRating, spamRating);

        // Step 6 — return structured result to controllers / test runner
        resolve({
          allowed: !blocked,
          fallback: false,
          hateRating,
          spamRating,
          blocked,
          blockReason: blocked
            ? hateRating > THRESHOLD
              ? "hate"
              : "spam"
            : null,
        });
      });

      child.on("error", (err) => {
        console.error("[ML] Failed to spawn Python process:", err.message);
        resolve({
          allowed: true,
          fallback: true,
          hateRating: 0,
          spamRating: 0,
        });
      });
    } catch (err) {
      console.error("[ML] Unexpected moderation wrapper error:", err);
      resolve({
        allowed: true,
        fallback: true,
        hateRating: 0,
        spamRating: 0,
      });
    }
  });
}

/**
 * High-level guard used by controllers before MongoDB .save().
 * Returns { allowed, message?, hateRating, spamRating, fallback }.
 */
async function checkContentModeration(text) {
  if (!text || !String(text).trim()) {
    return { allowed: true, hateRating: 0, spamRating: 0, empty: true };
  }

  try {
    const result = await runMlPipeline(String(text));

    if (result.fallback) {
      return result;
    }

    if (!result.allowed) {
      return {
        ...result,
        message:
          result.blockReason === "hate"
            ? "Your content was flagged as toxic/hate speech and was not saved."
            : "Your content was flagged as spam and was not saved.",
      };
    }

    return result;
  } catch (err) {
    console.error("[ML] checkContentModeration error:", err);
    return { allowed: true, fallback: true, hateRating: 0, spamRating: 0 };
  }
}

/** Standard 400 response when moderation blocks a write. */
function sendModerationBlock(res, moderation) {
  return res.status(400).json({
    message: moderation.message,
    hateRating: moderation.hateRating,
    spamRating: moderation.spamRating,
    moderationBlocked: true,
  });
}

module.exports = {
  THRESHOLD,
  PYTHON_CMD,
  PYTHON312_SITE_PACKAGES,
  SCRIPT_PATH,
  shouldBlockFromRatings,
  buildPythonEnv,
  runMlPipeline,
  checkContentModeration,
  sendModerationBlock,
};
