const express = require('express');
const { getToken, verifyToken, authenticateUser } = require('../middlewares/verifyToken');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getTechStacks } = require('../controllers/techStackController');


router.get('/', getTechStacks);

module.exports = router;