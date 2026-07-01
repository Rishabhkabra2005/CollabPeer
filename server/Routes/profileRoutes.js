const express = require("express");
const {
  getToken,
  authenticateUser,
  verifyToken,
} = require("../middlewares/verifyToken");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {getProfile,getUserProfile,updateUserProfile,addtoConnection,getAllUserChats,searchProfiles,addtoPortfolio,getPortfolio,removeFromConnection} = require("../controllers/profileController");

router.get("/",getToken,verifyToken,authenticateUser,getProfile);
router.post("/search/",getToken,verifyToken,authenticateUser,searchProfiles);
router.get("/allChats",getToken,verifyToken,authenticateUser,getAllUserChats);
router.get("/getPortfolio/:userid",getToken,verifyToken,authenticateUser,getPortfolio);
router.get("/:userid",getToken, verifyToken, authenticateUser, getUserProfile);
router.put("/",getToken,verifyToken,authenticateUser,upload.single("avatar"),updateUserProfile);
router.put("/addtoPortfolio",getToken,verifyToken,authenticateUser,addtoPortfolio);
router.put("/:userid/addConnection",getToken,verifyToken,authenticateUser,addtoConnection);
router.put("/:userid/removeConnection",getToken,verifyToken,authenticateUser,removeFromConnection);



module.exports = router;
