const express = require('express');
const { getToken, authenticateUser, verifyToken } = require('../middlewares/verifyToken');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const router = express.Router();
const { newPost, getAllPost, getPost, deletePost, likePost, dislikePost, getMyPosts, addComment, getMyConnectionPosts ,getMyFavPosts,addMyFavPosts } = require('../controllers/postController');

router.post('/',getToken, verifyToken,authenticateUser,upload.array('media',10),newPost);
router.get('/', getAllPost);
router.get('/my',getToken, verifyToken, authenticateUser, getMyPosts);
router.get('/myconnectionposts',getToken,verifyToken, authenticateUser, getMyConnectionPosts);
router.post('/myfavposts',getToken,verifyToken, authenticateUser, addMyFavPosts);
router.get('/myfavposts',getToken,verifyToken, authenticateUser, getMyFavPosts);
router.get('/:postId', getToken,getPost);
router.delete('/:postId',getToken,verifyToken,authenticateUser, deletePost); // TODO authorize middleware
router.put('/likes',getToken,verifyToken, authenticateUser, likePost);
router.put('/dislikes',getToken,verifyToken, authenticateUser, dislikePost);
router.post('/comment',getToken,verifyToken, authenticateUser, addComment);


module.exports = router;