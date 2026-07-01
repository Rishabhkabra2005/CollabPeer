const { json } = require("express");
const graph = require("./graph");
const router = require("express-promise-router")();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const path = require("path");
const fs = require("fs");

function getClientOrigin(req) {
  if (process.env.CLIENT_URL) {
    return process.env.CLIENT_URL.replace(/\/$/, "");
  }
  const buildPath = path.join(__dirname, "../../client/build/index.html");
  if (fs.existsSync(buildPath)) {
    return `${req.protocol}://${req.get("host")}`;
  }
  return "http://localhost:3000";
}

/* GET auth callback. */
router.get("/signin", async function (req, res) {
  if (!req.app.locals.msalClient) {
    return res.redirect("/api/auth/dev-signin");
  }

  const urlParameters = {
    scopes: process.env.OAUTH_SCOPES.split(","),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  };
  try {
    const authUrl = await req.app.locals.msalClient.getAuthCodeUrl(
      urlParameters
    );
    res.redirect(authUrl);
  } catch (error) {
    console.log(`Error: ${error}`);
    req.flash("error_msg", {
      message: "Error getting auth URL",
      debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    res.redirect("/");
  }
});

/* Local dev sign-in when Azure OAuth is not configured */
router.get("/dev-signin", async function (req, res) {
  const devEmail = "rishabh.kabra@dev.local";

  try {
    let existingUser = await User.findOne({ email: devEmail });

    if (!existingUser) {
      existingUser = new User({
        name: "Rishabh Kabra",
        username: "Rishabh Kabra",
        email: devEmail,
        rollNo: "DEV001",
        program: "Electronics and Communication Engineering",
        year: "3",
        branch: "Electronics and Communication Engineering",
      });
      await existingUser.save();
    }

    jwt.sign(
      { isowner: true, id: devEmail },
      process.env.JWT_SEC,
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Failed to create dev session");
        }

        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        res.redirect(
          getClientOrigin(req) + "/profile?user=" + existingUser._id
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Dev sign-in failed. Is MongoDB running?");
  }
});

router.get("/callback", async function (req, res) {
  const tokenRequest = {
    code: req.query.code,
    scopes: process.env.OAUTH_SCOPES.split(","),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  };

  try {
    console.log(tokenRequest.code);
    const response = await req.app.locals.msalClient.acquireTokenByCode(
      tokenRequest
    );
    console.log("The access token: ", response);
    const idtoken = response.idToken;
    console.log("The id token: ", idtoken);
    // Save the user's homeAccountId in their session
    req.session.userId = response.account.homeAccountId;

    const user = await graph.getUserDetails(
      req.app.locals.msalClient,
      req.session.userId
    );

    // Create user if not exists
    console.log(user);
    const userExists = await User.findOne({
      email: user.mail || user.userPrincipalName,
    });
    roll = user.surname;
    year = roll.slice(0, 2);
    year = 24 - year;
    roll = user.surname;
    branch = roll.slice(4, 6);
    console.log(branch);
    map = {
      "06": "Biosciences and Bioengineering",
      "07": "Chemical Engineering",
      "22": "Chemical Science and Technology",
      "04": "Civil Engineering",
      "01": "Computer Science and Engineering",
      "50": "Data Science and Artificial Intelligence",
      "02": "Electronics and Communication Engineering",
      "08": "Electronics and Electrical Engineering",
      "51": "Energy Engineering",
      "21": "Engineering Physics",
      "23": "Mathematics and Computing",
      "03": "Mechanical Engineering",
      "05": "Design",
    };
    branch = map[branch];
    console.log(branch);
    console.log(year);
    if (!userExists) {
      console.log("User does not exist");
      const newUser = new User({
        name: user.displayName,
        username: user.displayName,
        email: user.mail || user.userPrincipalName,
        rollNo: user.surname,
        program: user.jobTitle,
        year,
        branch,
      });
      try {
        console.log("Saving user");
        await newUser.save();
        console.log("User saved");
        jwt.sign(
          { isowner: true, id: user.mail || user.userPrincipalName },
          process.env.JWT_SEC,
          (err, token) => {
            console.log("The token: ", token);
            user.token = token;
            console.log(user);

            // Assuming you have the token in a variable named 'token'
            res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

            res.redirect(getClientOrigin(req) + "/profile?user=" + newUser._id);
            res.send(JSON.stringify(user));
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("User already exists");
      jwt.sign(
        { isowner: true, id: user.mail || user.userPrincipalName },
        process.env.JWT_SEC,
        (err, token) => {
          user.token = token;

          // Assuming you have the token in a variable named 'token'
          res.cookie("token", token, { httpOnly: true});

          res.redirect(getClientOrigin(req) + "/profile?user=" + userExists._id);
          res.send(JSON.stringify(user));
        }
      );
    }
  } catch (error) {
    req.flash("error_msg", {
      message: "Error completing authentication",
      debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
  }

  // res.redirect("http://localhost:3000");
});

router.get("/signout", async function (req, res) {
  // Sign out
  console.log("Signing out user: ", req.session);
  if (req.session.userId) {
    // Look up the user's account in the cache
    req.session.destroy();
    // const accounts = await req.app.locals.msalClient
    //   .getTokenCache()
    //   .getAllAccounts();

    // const userAccount = accounts.find(
    //   (a) => a.homeAccountId === req.session.userId
    // );

    // // Remove the account
    // if (userAccount) {
    //   req.app.locals.msalClient.getTokenCache().removeAccount(userAccount);
    // }
  }

  // Destroy the user's session
  try{
    res.clearCookie("token");
    res.clearCookie("connect.sid");
    res.send("done");
  }
  catch(err){
    console.log(err);
  }
});

module.exports = router;
