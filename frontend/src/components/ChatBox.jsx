// frontend/src/components/ChatBox.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message";

const socket = io.connect("http://localhost:5000"); // Kết nối tới server WebSocket

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Lắng nghe sự kiện nhận tin nhắn từ server
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="chat-box">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
