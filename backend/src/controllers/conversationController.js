import Conversation from "../models/ConversationModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const sendConversation = asyncHandler(async (req, res) => {
  const { participant } = req.body;

  if (!Array.isArray(participant) || participant.length < 2) {
    res.status(400);
    throw new Error("Participants must be an array with at least two members.");
  }

  const newConversation = new Conversation({ participants: participant });
  await newConversation.save();

  res.status(201).json({
    _id: newConversation._id,
    participants: newConversation.participants,
  });
});

const getAllConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  try {
    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: { $in: [currentUserId] },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "conversationId",
          as: "messages",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", -1] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "userDetails",
        },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch conversations: " + error.message);
  }
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const currentUserId = req.user._id;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found.");
  }

  if (!conversation.participants.includes(currentUserId.toString())) {
    res.status(403);
    throw new Error("Not authorized to delete this conversation.");
  }

  await conversation.remove();
  res.status(200).json({ message: "Conversation deleted successfully." });
});

export { sendConversation, getAllConversations, deleteConversation };
