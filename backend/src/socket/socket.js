import { Server } from "socket.io";
<<<<<<< HEAD
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
=======
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import UserModel from "../models/UserModel.js";
import ConversationModel from "../models/ConversationModel.js";
import MessageModel from "../models/MessageModel.js";
import getConversation from "../helpers/getConversation.js";
import dotenv from "dotenv";
dotenv.config();

const onlineUser = new Set();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // URL của React app
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log("Connect User:", socket.id);

    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user) {
      console.log("Unauthorized socket connection");
      socket.disconnect();
      return;
    }

    socket.join(user._id.toString());
    onlineUser.add(user._id.toString());
    io.emit("onlineUser", Array.from(onlineUser));

    // Lắng nghe các sự kiện từ client
    socket.on("message-page", async (userId) => {
      const userDetails = await UserModel.findById(userId).select("-password");
      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId),
      };
      socket.emit("message-user", payload);

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    });

    socket.on("new message", async (data) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      if (!conversation) {
        const createConversation = await ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await createConversation.save();
      }

      const message = new MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      });
      const saveMessage = await message.save();

      await ConversationModel.updateOne(
        { _id: conversation?._id },
        { $push: { messages: saveMessage?._id } }
      );

      const updatedConversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data?.sender).emit("message", updatedConversation?.messages || []);
      io.to(data?.receiver).emit(
        "message",
        updatedConversation?.messages || []
      );

      const conversationSender = await getConversation(data?.sender);
      const conversationReceiver = await getConversation(data?.receiver);

      io.to(data?.sender).emit("conversation", conversationSender);
      io.to(data?.receiver).emit("conversation", conversationReceiver);
    });

    socket.on("seen", async (msgByUserId) => {
      const conversation = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id },
        ],
      });

      const conversationMessageId = conversation?.messages || [];
      await MessageModel.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId },
        { $set: { seen: true } }
      );

      const conversationSender = await getConversation(user._id.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user._id.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    });

    socket.on("disconnect", () => {
      onlineUser.delete(user._id.toString());
      console.log("Disconnect User:", socket.id);
    });
  });
};

export default setupSocket;
>>>>>>> ae44abdb5601d0fc848ea6fe3a246bf72e76a379
