import React, { useState } from "react";
import { useSendMessageMutation } from "../redux/api/chatApiSlice";
import { useSelector } from "react-redux";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();

  const currentUserId = useSelector((state) => state.auth.userInfo._id);

  const handleSend = async () => {
    console.log(currentUserId);
    if (!currentUserId || !message.trim()) return;
    try {
      await sendMessage({
        receiverId: "user-id",
        content: "Hello!",
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex items-center p-4 bg-gray-200">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 mr-2 border rounded-md"
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-white rounded-md"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;