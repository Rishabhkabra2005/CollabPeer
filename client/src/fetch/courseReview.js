import axios from 'axios';
import { api } from '../utils/APIRoutes';

const getCourseReview = (courseReviewId) => {
  return axios.get(`${api}/coursereview/${courseReviewId}`,
    { withCredentials: true });
};

const getAllCourseReviews = () => {
  return axios.get(`${api}/coursereview/`,
    { withCredentials: true });
};

const postComment = (courseId, content) => {
  if (
    localStorage.getItem("lastCommentTime") &&
    Date.now() - localStorage.getItem("lastCommentTime") < 60000
  ) {
    return Promise.resolve({
      data: { message: "Please wait a few seconds before commenting again." },
    });
  }
  localStorage.setItem("lastCommentTime", Date.now());

  return axios.post(`${api}/evaluate-comment`, { comment: content })
    .then(response => {
      if (response.data.HateRating > 50 || response.data.SpamRating > 50) {
        return Promise.resolve({
          data: { message: "Your comment was flagged as inappropriate/spam and hence not logged." },
        });
      } else {
        return axios.post(`${api}/coursereview/comment`, { courseId, content },
          { withCredentials: true });
      }
    })
    .catch(error => {
      console.error('Error checking comment:', error);
      return Promise.reject(error);
    });
};

const enrollCourse = (courseId) => {
  return axios.put(`${api}/coursereview/enroll`, { courseId },
    { withCredentials: true });
};

export {
  getCourseReview,
  getAllCourseReviews,
  postComment,
  enrollCourse,
  enrollCourse as toggleEnroll,
};
