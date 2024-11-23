import io from "socket.io-client";

const socket = io("http://localhost:5000/"); // URL của server Socket.IO

export default socket;
