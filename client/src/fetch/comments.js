import axios from 'axios';
import { api } from '../utils/APIRoutes';

const putUpvote = (commentId) => {
    return axios.put(`${api}/comment/like/${commentId}`,
        {},
        { withCredentials: true });
};

const putDownvote = (commentId) => {
    return axios.put(`${api}/comment/dislike/${commentId}`,
        {},
        { withCredentials: true });
};

export { putUpvote, putDownvote };
