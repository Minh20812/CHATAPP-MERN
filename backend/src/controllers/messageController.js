import Message from "../models/MessageModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Gửi tin nhắn
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content, timestamp } = req.body;
  const senderId = req.user._id;

  console.log("Request body:", req.body); // Add this line

  console.log("Sender ID:", senderId); // Add this line

  if (!receiverId || !content) {
    res.status(400);
    throw new Error("Please provide receiver and message content");
  }

  try {
    // Convert timestamp to Bangkok timezone

    const bangkokTime = new Date(timestamp || new Date()).toLocaleString(
      "en-US",
      {
        timeZone: "Asia/Bangkok",
      }
    );

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      timestamp: bangkokTime,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      _id: newMessage._id,
      sender: newMessage.sender,
      receiver: newMessage.receiver,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
    });
  } catch (error) {
    console.error("Error sending message:", error.message); // Add this line
    res.status(500);
    throw new Error("Failed to send message: " + error.message);
  }
});

// Lấy tin nhắn giữa 2 người dùng
const getMessagesBetweenUsers = asyncHandler(async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("sender", "username")
      .populate("receiver", "username");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch messages: " + error.message);
  }
});

// Lấy tất cả các cuộc hội thoại của người dùng hiện tại
const getAllConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  try {
    // Tìm tất cả tin nhắn liên quan đến người dùng hiện tại
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", currentUserId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch conversations: " + error.message);
  }
});

// Xóa tin nhắn
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const currentUserId = req.user._id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Kiểm tra xem người dùng hiện tại có phải là người gửi tin nhắn
    if (message.sender.toString() !== currentUserId.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this message");
    }

    await message.remove();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to delete message: " + error.message);
  }
});

export {
  sendMessage,
  getMessagesBetweenUsers,
  getAllConversations,
  deleteMessage,
};
