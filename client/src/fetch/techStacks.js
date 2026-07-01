import axios from 'axios';
import { api } from '../utils/APIRoutes';

const getTechStacks = () => {
    return axios.get(`${api}/techstacks/`)
};

export { getTechStacks };
