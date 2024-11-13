// frontend/src/components/ChatApp.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000"); // Kết nối tới server WebSocket

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Lắng nghe sự kiện `receive_message` từ server và cập nhật danh sách tin nhắn
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup event listener khi component unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Gửi tin nhắn mới qua sự kiện `send_message`
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        content: message,
        timestamp: new Date().toISOString(),
      };
      socket.emit("send_message", messageData); // Gửi tin nhắn đến server
      setMessages((prevMessages) => [...prevMessages, messageData]); // Cập nhật tin nhắn local
      setMessage(""); // Reset input
    }
  };

  return (
    <div>
      <h2>Chat App</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>
            <span>{msg.content}</span>{" "}
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
