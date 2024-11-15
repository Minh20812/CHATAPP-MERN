import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import userRoutes from "./src/routers/userRoutes.js";
import messageRoutes from "./src/routers/messageRoutes.js";

dotenv.config();
const port = process.env.PORT || 5001;

connectDB();
const app = express();

app.use(
  cors({
    origin: [
      // "https://todolist-app-theta-five.vercel.app",
      // "https://todolist---app-2ac04.firebaseapp.com",
      "http://localhost:5173/",
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

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
