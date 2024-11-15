import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
import { useSelector } from "react-redux"; // if using Redux
import Message from "./Message";
import MessageInput from "./MessageInput";

const ChatBox = () => {
  const currentUserId = useSelector((state) => state.auth.userInfo._id);
  const [messages, setMessages] = useState([]);

  // const socket = io("http://localhost:5000", {
  //   query: { userId: currentUserId },
  //   transports: ["websocket"],
  // });

  // useEffect(() => {
  //   const handleReceiveMessage = (data) => {
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //   };

  //   socket.on("receive_message", handleReceiveMessage);

  //   return () => {
  //     socket.off("receive_message", handleReceiveMessage);
  //   };
  // }, [socket]);

  const sendMessage = (text) => {
    if (text.trim()) {
      const messageData = {
        sender: "You",
        text,
        timestamp: new Date().toLocaleTimeString(),
        isOwnMessage: true,
      };

      // socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  };

  return (
    <div className="chat-box bg-white shadow-lg p-4 rounded-md h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <div className="messages flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatBox;
