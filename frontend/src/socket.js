import io from "socket.io-client";

const SOCKET_URL = import.meta.env.PROD
  ? "https://chatapp-mern-vhhz.onrender.com" // Production URL
  : "http://localhost:5000"; // Development URL

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  withCredentials: true,
});

export default socket;
