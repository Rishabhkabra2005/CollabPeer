import axios from "axios";
import { api } from "../utils/APIRoutes";

const searchProfiles = (searchTerm) => {
    axios.defaults.headers.common[
        "authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;
    return axios.post(
        `${api}/profile/search/`,
        { searchTerm },
        { withCredentials: true }
    );
};

export { searchProfiles };
export default searchProfiles;
