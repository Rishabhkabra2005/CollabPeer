import axios from 'axios';
import { api } from '../utils/APIRoutes';

const getDiscussions = () => {
  return axios.get(`${api}/discussion/`);
};

const getDiscussion = (id) => {
  return axios.get(`${api}/discussion/${id}`);
};

const postComment = (discussionId, content) => {
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
        return axios.post(`${api}/discussion/comment`, {
          discussionId,
          content,
        },
          {
            withCredentials: true,
          });
      }
    })
    .catch(error => {
      console.error('Error checking comment:', error);
      return Promise.reject(error);
    });
};

const putUpvote = (discussionId) => {
  return axios.put(`${api}/discussion/upvote`, {
    discussionId,
  },
    {
      withCredentials: true,
    });
};

const putDownvote = (discussionId) => {
  return axios.put(`${api}/discussion/downvote`, {
    discussionId,
  },
    {
      withCredentials: true,
    });
};

const postDiscussion = (body) => {
  return axios.post(`${api}/discussion/`, body, {
    withCredentials: true,
  });
};

export {
  getDiscussions,
  getDiscussion,
  postComment,
  putUpvote,
  putDownvote,
  postDiscussion,
};
