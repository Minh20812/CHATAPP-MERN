import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import path from "path";

import connectDB from "./config/db.js";
import userRoutes from "./src/routers/userRoutes.js";
import messageRoutes from "./src/routers/messageRoutes.js";
<<<<<<< HEAD
import { app, server } from "./src/socket/socket.js";
=======
import setupSocket from "./src/socket/socket.js";
>>>>>>> ae44abdb5601d0fc848ea6fe3a246bf72e76a379

dotenv.config();
const port = process.env.PORT || 5001;
const __dirname = path.resolve();

// Kết nối database
connectDB();
<<<<<<< HEAD
// const app = express();
=======

const app = express();
const server = http.createServer(app); // Tạo HTTP server
setupSocket(server); // Khởi tạo socket
>>>>>>> ae44abdb5601d0fc848ea6fe3a246bf72e76a379

app.use(
  cors({
    origin: [
      // "https://todolist-app-theta-five.vercel.app",
      // "https://todolist---app-2ac04.firebaseapp.com",
      "http://localhost:5173",
    ],
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

<<<<<<< HEAD
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// });

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
=======
// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
>>>>>>> ae44abdb5601d0fc848ea6fe3a246bf72e76a379
  });
}

<<<<<<< HEAD
=======
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
>>>>>>> ae44abdb5601d0fc848ea6fe3a246bf72e76a379
server.listen(port, () => console.log(`Server running on port ${port}`));
