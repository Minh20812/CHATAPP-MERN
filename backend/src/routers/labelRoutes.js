import express from "express";
import {
  addLabel,
  getAllLabels,
  deleteLabelById,
  getLabelById,
  updateLabelById,
} from "../controllers/labelController.js";

const router = express.Router();

router.route("/").post(addLabel).get(getAllLabels);

router
  .route("/:id")
  .delete(deleteLabelById)
  .get(getLabelById)
  .put(updateLabelById);
export default router;
