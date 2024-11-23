import ConversationModel from "../models/ConversationModel.js";
import UserModel from "../models/UserModel.js";

const getConversation = async (userId) => {
  try {
    // Tìm tất cả các cuộc hội thoại mà người dùng tham gia
    const conversations = await ConversationModel.find({
      participants: userId,
    })
      .populate("participants", "username profile_pic email") // Populate thông tin người tham gia
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conversation) => {
      // Tìm người dùng khác trong cuộc hội thoại
      const otherParticipant = conversation.participants.find(
        (participant) => participant._id.toString() !== userId.toString()
      );

      return {
        _id: conversation._id,
        participants: conversation.participants,
        otherParticipant,
        updatedAt: conversation.updatedAt,
      };
    });

    return formattedConversations;
  } catch (err) {
    console.error("Error fetching conversations:", err.message);
    return [];
  }
};

export default getConversation;
