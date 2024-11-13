import React, { useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000"); // Kết nối tới server WebSocket

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim()) {
      const messageData = {
        content: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("send_message", messageData); // Gửi tin nhắn tới server qua WebSocket
      setMessage(""); // Reset input sau khi gửi
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
