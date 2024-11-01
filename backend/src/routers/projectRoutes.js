import express from "express";
import {
  addProject,
  getAllProjects,
  deleteProjectById,
  getProjectById,
  updateProjectById,
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/").post(addProject).get(getAllProjects);

router
  .route("/:id")
  .delete(deleteProjectById)
  .get(getProjectById)
  .put(updateProjectById);
export default router;
