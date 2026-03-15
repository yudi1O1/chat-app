export const host =
  process.env.REACT_APP_API_URL?.trim() || "http://localhost:8080";



export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const updateSettingsRoute = `${host}/api/auth/settings`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessageRoute = `${host}/api/messages/getmsg`;
export const conversationsRoute = `${host}/api/messages/conversations`;


