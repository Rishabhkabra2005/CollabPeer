const express = require('express');
const { getToken, verifyToken, authenticateUser } = require('../middlewares/verifyToken');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getCourseReviews, getMyReviews, getCourseReview, postCourseReview, deleteCourseReview, addComment, toggleEnroll } = require('../controllers/courseReviewController');

router.post('/', getToken, verifyToken, authenticateUser,upload.single('thumbnail') ,postCourseReview);
router.get('/',getToken, verifyToken, authenticateUser, getCourseReviews);
router.get('/my',getToken, verifyToken, authenticateUser, getMyReviews);
router.get('/:courseid',getToken, verifyToken, authenticateUser, getCourseReview);
router.delete('/:courseid',getToken, verifyToken, authenticateUser, deleteCourseReview);
router.post('/comment',getToken, verifyToken, authenticateUser, addComment);
router.put('/enroll',getToken, verifyToken, authenticateUser, toggleEnroll);

module.exports = router;