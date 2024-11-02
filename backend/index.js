import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import userRoutes from "./src/routers/userRoutes.js";
// import taskRoutes from "./src/routers/taskRoutes.js";
// import projectRoutes from "./src/routers/projectRoutes.js";
// import labelRoutes from "./src/routers/labelRoutes.js";

dotenv.config();
const port = process.env.PORT || 5001;

connectDB();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      // "https://todolist-app-theta-five.vercel.app",
      // "https://todolist---app-2ac04.firebaseapp.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/labels", labelRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
