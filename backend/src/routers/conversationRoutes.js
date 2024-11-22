import express from "express";
import { protect } from "../middlewares/protectRoute.js";
import {
  sendConversation,
  getAllConversations,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/send", protect, sendConversation);
router.get("/conversations", protect, getAllConversations);
router.delete("/:conversationId", protect, deleteConversation);

export default router;
