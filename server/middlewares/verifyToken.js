const jwt = require("jsonwebtoken");
const User = require("../models/User");
const USER = require("../auth/auth");

const getToken = (req, res, next) => {
  // Assuming you have the cookie-parser middleware installed
  const token = req.cookies.token;
  // console.log(req.cookies);
  // console.log('token is : ', token);
  // Include the token in the request headers
  req.headers.authorization = `Bearer ${token}`; // Prepend 'Bearer ' to the token
  // console.log(req.headers.authorization);
  next();
};

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    // console.log(bearerToken);
    next();
  } else {
    res.status(403).json("Invalid token!");
  }
};

const authenticateUser = async (req, res, next) => {
  try {
    // console.log(req.token);
    const decoded = jwt.verify(req.token, process.env.JWT_SEC);
    // console.log(decoded);
    req.user = decoded.id;
    if (!decoded.id) {
      res.status(403).json("No user provided!");
    } else {
      const user = await User.findOne({ email: decoded.id });
      if (user === null) {
        res.status(403).json("No such user exists!");
      }
      //console.log(user);
      req.user = user._id.toHexString();
      next();
    }
  } catch (error) {
    console.log("err:", error);
    res.status(403).json("Authentication failed! hhhhhhhhhhhhhhh");
  }
};

module.exports = {
  verifyToken,
  authenticateUser,
  getToken,
};
