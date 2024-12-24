import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import MessageInput from "./MessageInput";
import {
  useGetMessagesBetweenUsersQuery,
  useDeleteAllMessagesMutation,
} from "../redux/api/chatApiSlice";
import { addMessage } from "../redux/feature/chatSlice";
import socket from "../socket";

const ChatBox = ({ chatUser }) => {
  const [deleteAllMessages, { isLoading: isDeleting }] =
    useDeleteAllMessagesMutation();

  const dispatch = useDispatch();

  const currentUserId = useSelector((state) => state.auth.userInfo._id);

  const {
    data: messages = [],
    isLoading,
    isError,
    refetch, // Thêm refetch từ query hook
  } = useGetMessagesBetweenUsersQuery(
    {
      user1: currentUserId,
      user2: chatUser._id,
    },
    {
      // Add polling to check for new messages
      pollingInterval: 1000,
      // Ensure we get fresh data
      refetchOnMountOrArgChange: true,
    }
  );

  const sendMessage = async (text) => {
    if (text.trim()) {
      const messageData = {
        sender: currentUserId,
        receiver: chatUser._id,
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      // Gửi tin nhắn qua WebSocket
      try {
        // Emit to socket first
        socket.emit("sendMessage", messageData);

        // Add message to Redux store
        dispatch(addMessage(messageData));

        // Force refetch messages
        await refetch();
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all messages?")) {
      try {
        await deleteAllMessages({
          user1: currentUserId,

          user2: chatUser._id,
        }).unwrap();
        await refetch();
        alert("Messages deleted successfully");
      } catch (err) {
        console.error("Failed to delete messages:", err);

        alert("Failed to delete messages. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (message) => {
      // Only handle messages related to current chat
      if (
        message.sender === chatUser._id ||
        message.receiver === chatUser._id
      ) {
        // Add to Redux store
        dispatch(addMessage(message));
        // Refetch latest messages
        await refetch();
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, chatUser._id, dispatch, refetch]);

  useEffect(() => {
    const messageContainer = document.querySelector(".messages");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  if (isLoading) return <p>Loading messages...</p>;
  if (isError) return <p>Error loading messages.</p>;

  return (
    <div className="chat-box bg-white shadow-lg p-4 rounded-md h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {chatUser.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{chatUser.username}</h2>
            <p className="text-sm text-gray-400">{chatUser.email}</p>
          </div>
        </div>
        <button
          onClick={handleDeleteAll}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete All"}
        </button>
      </div>
      <div className="messages flex-1 overflow-y-auto px-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={{
              ...msg,
              isOwnMessage: msg.sender === currentUserId,
            }}
          />
        ))}
      </div>
      <MessageInput onSendMessage={sendMessage} receiverId={chatUser._id} />
    </div>
  );
};

export default ChatBox;
