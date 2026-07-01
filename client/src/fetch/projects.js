import axios from "axios";
import { api } from "../utils/APIRoutes";

const getProjects = () => {
  return axios.get(`${api}/projects/`);
};

const getProject = (id) => {
  return axios.get(`${api}/projects/${id}`);
};

const getMyProjects = () => {
  return axios.get(`${api}/projects/my`, {
    withCredentials: true,
  });
};

const addCollab = (id, collabId) => {
  return axios.put(
    `${api}/projects/${id}/addCollab`,
    { collabId },
    {
      withCredentials: true,
    }
  );
};

const putLike = (projectId) => {
  return axios.put(
    `${api}/projects/likes/`,
    { projectId },
    {
      withCredentials: true,
    }
  );
};

const putDislike = (projectId) => {
  return axios.put(
    `${api}/projects/dislikes/`,
    { projectId },
    {
      withCredentials: true,
    }
  );
};

const postComment = (projectId, content) => {
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
        return axios.post(
          `${api}/projects/comment/`,
          { projectId, content },
          { withCredentials: true }
        );
      }
    })
    .catch(error => {
      console.error('Error checking comment:', error);
      return Promise.reject(error);
    });
};

const deleteProject = (id) => {
  return axios.delete(`${api}/projects/${id}`, {
    withCredentials: true,
  });
};

export {
  getProjects,
  getProject,
  getMyProjects,
  addCollab,
  putLike,
  putDislike,
  postComment,
  deleteProject,
};
