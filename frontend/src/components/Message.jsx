import React from "react";

const Message = ({ message, currentUserId }) => {
  const isOwnMessage = message.sender._id === currentUserId;

  // Format timestamp to Bangkok timezone
  const formattedTimestamp = new Date(message.timestamp).toLocaleString(
    "en-US",
    {
      timeZone: "Asia/Bangkok",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <div
      className={`p-2 my-1 rounded-md ${
        isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      <p className="font-bold">{message.sender.username}</p>
      <p>{message.content}</p>
      <p className="text-xs text-right">
        {new Date(message.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default Message;
