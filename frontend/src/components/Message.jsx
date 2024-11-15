// frontend/src/components/Message.jsx
import React from "react";

const Message = ({ message }) => (
  <div
    className={`p-2 my-1 rounded-md ${
      message.isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
    }`}
  >
    <p className="text-sm font-medium">{message.sender}</p>
    <p>{message.text}</p>
    <p className="text-xs text-right">{message.timestamp}</p>
  </div>
);

export default Message;
