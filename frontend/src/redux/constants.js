// export const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://chatapp-mern-vhhz.onrender.com/"
//     : "";

// // export const BASE_URL =
// //   process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

// // export const BASE_URL = "";

// export const USERS_URL = `${BASE_URL}/api/users`;
// export const MESSAGES_URL = `${BASE_URL}/api/messages`;
// export const CONVERSATIONS_URL = "/api/conversations";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://chatapp-mern-vhhz.onrender.com/api" // Add /api to base URL
    : "/api";

export const USERS_URL = `/users`;
export const MESSAGES_URL = `/messages`;
export const CONVERSATIONS_URL = `/conversations`;
