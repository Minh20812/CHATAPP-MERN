import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useGetMessagesBetweenUsersQuery } from "../redux/api/chatApiSlice";

const ChatBox = ({ chatUser }) => {
  const currentUserId = useSelector((state) => state.auth.userInfo._id);
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useGetMessagesBetweenUsersQuery({
    user1: currentUserId,
    user2: chatUser._id,
  });

  const sendMessage = (text) => {
    if (text.trim()) {
      const messageData = {
        sender: "You",
        text,
        timestamp: new Date().toLocaleTimeString(),
        isOwnMessage: true,
      };
      // Here, you could implement message sending logic
      // setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  };

  useEffect(() => {
    if (chatUser) {
      // Optional: reset or fetch data here if needed
    }
  }, [chatUser]);

  if (isLoading) return <p>Loading messages...</p>;
  if (isError) return <p>Error loading messages.</p>;

  return (
    <div className="chat-box bg-white shadow-lg p-4 rounded-md h-full flex flex-col">
      <div className="flex gap-2">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {chatUser.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{chatUser.username}</h2>
          <p className="text-sm text-gray-400">{chatUser.email}</p>
        </div>
      </div>
      <div className="messages flex-1 overflow-y-auto mb-4">
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
