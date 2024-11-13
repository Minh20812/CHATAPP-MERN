// frontend/src/components/Message.js
import React from "react";

const Message = ({ message }) => {
  return (
    <div className="message">
      <span>{message.content}</span>
      <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
    </div>
  );
};

export default Message;
