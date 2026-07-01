const defaultHost =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080";

export const host = process.env.REACT_APP_API_URL ?? defaultHost;
export const api = `${host}/api`;

export const allUsersRoute = `${api}/profile/allchats`;
export const sendMessageRoute = `${api}/messages/addmsg`;
export const getAllMessageRoute = `${api}/messages/getmsg`;
export const sendMessageGroupsRoute = `${api}/messages/addmsggroups`;
export const getAllMessageGroupsRoute = `${api}/messages/getmsggroups`;
export const getGroups = (id) => `${api}/groups/all/${id}`;
export const addGroup = `${api}/groups/create`;
export const addMember = `${api}/groups/addmember`;
