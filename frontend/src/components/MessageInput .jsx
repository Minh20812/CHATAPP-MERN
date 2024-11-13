import React, { useState } from "react";
import { useSendMessageMutation } from "../services/messages";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage({ content: message });
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
