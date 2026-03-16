function getApiHost() {
  const configuredHost = process.env.REACT_APP_API_URL?.trim();
  if (configuredHost) {
    return configuredHost.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return window.location.origin;
  }

  return "http://localhost:8080";
}

export const host = getApiHost();

export const isSocketEnabled =
  process.env.REACT_APP_ENABLE_SOCKET === "true" ||
  (typeof window !== "undefined" && window.location.hostname === "localhost");

export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const updateSettingsRoute = `${host}/api/auth/settings`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessageRoute = `${host}/api/messages/getmsg`;
export const conversationsRoute = `${host}/api/messages/conversations`;


