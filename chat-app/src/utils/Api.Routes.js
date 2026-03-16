function getApiHost() {
  const configuredHost = process.env.REACT_APP_API_URL?.trim();
  if (configuredHost) {
    return {
      host: configuredHost.replace(/\/+$/, ""),
      error: null,
    };
  }

  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return {
      host: "",
      error: "Missing REACT_APP_API_URL. Set it to your Render backend URL in Vercel project settings.",
    };
  }

  return {
    host: "http://localhost:8080",
    error: null,
  };
}

const apiConfig = getApiHost();

export const host = apiConfig.host;
export const apiConfigurationError = apiConfig.error;

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


