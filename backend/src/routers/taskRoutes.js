import express from "express";
import {
  addTask,
  getAllTasks,
  deleteTaskById,
  getTaskById,
  updateTaskById,
} from "../controllers/taskController.js";

const router = express.Router();

router.route("/").post(addTask).get(getAllTasks);

router
  .route("/:id")
  .delete(deleteTaskById)
  .get(getTaskById)
  .put(updateTaskById);
export default router;
