require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const msal = require("@azure/msal-node");
const connectDB = require("./connectdb.js");
var cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const socket = require('socket.io');
const fs = require("fs");
const { spawn } = require('child_process');


const authRouter = require("./auth/auth.js");
const ProfileRoutes = require("./Routes/profileRoutes.js");
const discussionRoutes = require("./Routes/discussionRoutes.js");
const courseReviewRoutes = require("./Routes/courseReviewRoute.js");
const commentRoutes = require("./Routes/commentRoutes.js");
const postRoutes = require("./Routes/postRoutes.js");
const projectRoutes = require("./Routes/projectRoutes.js");
const messagesRoutes = require("./Routes/messagesRoute.js");
const techStackRoutes = require("./Routes/techStacksRoutes.js");
const groupRoutes = require("./Routes/groupRoutes.js");

var app = express();

var corsOptions = {
  origin: process.env.CLIENT_URL || [
    "http://localhost:3000",
    "http://localhost:8080",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
app.locals.users = {};

// MSAL config — only initialize when Azure credentials are present
const isAzureAuthConfigured =
  process.env.OAUTH_CLIENT_ID &&
  process.env.OAUTH_AUTHORITY &&
  process.env.OAUTH_CLIENT_SECRET;

if (isAzureAuthConfigured) {
  const msalConfig = {
    auth: {
      clientId: process.env.OAUTH_CLIENT_ID,
      authority: process.env.OAUTH_AUTHORITY,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose,
      },
    },
  };

  app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);
} else {
  console.warn(
    "Azure OAuth not configured. Local dev sign-in available at /api/auth/dev-signin."
  );
  app.locals.msalClient = null;
}

// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(
  session({
    secret: "your_secret_value_here",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
  })
);

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function (req, res, next) {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash("error_msg");

  // Check for simple error string and
  // convert to layout's expected format
  var errs = req.flash("error");
  for (var i in errs) {
    res.locals.error.push({ message: "An error occurred", debug: errs[i] });
  }

  // Check for an authenticated user and load
  // into response locals
  if (req.session.userId) {
    res.locals.user = app.locals.users[req.session.userId];
  }

  next();
});


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "auth/public")));

const clientBuildPath = path.join(__dirname, "..", "client", "build");
const hasClientBuild = fs.existsSync(path.join(clientBuildPath, "index.html"));

const spaPagePattern =
  /^\/(feed|profile|chat|discussion|discussionView|projects|projectview|courseReview|courseView|search|community|editProfile)(\/?|$)/i;

if (hasClientBuild) {
  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      req.accepts("html") &&
      !req.path.startsWith("/api") &&
      spaPagePattern.test(req.path)
    ) {
      return res.sendFile(path.join(clientBuildPath, "index.html"));
    }
    next();
  });
}

app.use("/api/profile", ProfileRoutes);
app.use("/api/auth", authRouter);
app.use("/api/discussion", discussionRoutes);
app.use("/api/coursereview", courseReviewRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/techstacks", techStackRoutes);
app.use("/api/groups", groupRoutes);

// Function to execute Python script and capture its output
function getPythonOutput(scriptPath, args) {
  console.log('Arguments:', args);
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonCmd, [scriptPath, ...args]);
    console.log(pythonProcess);
    let output = '';
    // Capture output from Python script
    pythonProcess.stdout.on('data', (data) => {
      console.log(data);
      // output += data.toString('utf-8');
      output = data.toString();
      // Extract the final values from the output
      const regex = /\(([^\)]+)\)/;
      const matches = regex.exec(output);
      if (matches && matches.length > 1) {
        const values = matches[1].split(',');
        hateRating = parseFloat(values[0]);
        spamRating = parseFloat(values[1]);
        output = `${hateRating},${spamRating}`;
      }
    });
    // Handle Python process exit
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
    // Handle errors from Python process
    pythonProcess.on('error', (err) => {
      console.error('Error executing Python process:', err);
      reject(err);
    });
  });
}


// Define the post route for adding comments
app.post("/api/evaluate-comment", (req, res) => {
  // Extract comment text from request body
  const commentText = req.body.comment;

  // Path to Python script and arguments
  const scriptPath = path.join(__dirname, '..', 'pipeline', 'PipeLined.py');
  const args = [commentText]; // Pass the comment text as an argument

  // Execute get_ratings function and capture its output
  getPythonOutput(scriptPath, args)
    .then((output) => {
      // Process the output (hate and spam ratings) as needed
      let hr = output.split(',')[0];
      let sr = output.split(',')[1];
      const response = {
        HateRating: hr,
        SpamRating: sr
      };
      console.log(response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error('Error executing Python script:', error);
      res.status(200).json({ HateRating: 8, SpamRating: 5, fallback: true });
    });
});

if (hasClientBuild) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  });
  console.log("Serving React production build from client/build");
}

if (!hasClientBuild) {
  app.use(function (req, res, next) {
    next(createError(404));
  });
}

connectDB();

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}`);
});

const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_URL || [
      "http://localhost:3000",
      "http://localhost:8080",
    ],
    credentials: true
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.msg);
    }
  })
})




module.exports = app;
