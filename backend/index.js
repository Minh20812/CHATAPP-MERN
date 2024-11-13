import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import userRoutes from "./src/routers/userRoutes.js";
import messageRoutes from "./src/routers/messageRoutes.js";

dotenv.config();
const port = process.env.PORT || 5001;
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:3000",
];

// Kết nối đến MongoDB
connectDB().catch((err) => console.error("Database connection failed:", err));

// Khởi tạo Express và HTTP server
const app = express();
const server = http.createServer(app);

// Thiết lập Socket.io với cấu hình CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Middleware cho Express
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Định tuyến API
app.use("/api/users", userRoutes);
app.use("/api/chat", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Socket.io logic
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Trả về socket ID của người nhận (nếu có)
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// Khởi động server
server.listen(port, () => console.log(`Server running on port ${port}`));

export { app, io, server };
