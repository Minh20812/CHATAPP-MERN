// routes/messageRoutes.js
import express from "express";
import { protect } from "../middlewares/protectRoute.js";
import {
  sendMessage,
  getMessagesBetweenUsers,
  getAllConversations,
  deleteMessage,
  deleteAllMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/conversations", protect, getAllConversations);
router.get("/:user1/:user2", protect, getMessagesBetweenUsers);
router.delete("/:messageId", protect, deleteMessage);
router.delete("/all/:user1/:user2", protect, deleteAllMessages);

export default router;
