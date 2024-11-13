// import { useState } from "react";
// import { BsSend } from "react-icons/bs";
// import { useSendMessageMutation } from "../../redux/api/messageApiSlice";
// import { useSelector } from "react-redux";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !selectedConversation) return;
    try {
      await sendMessage({
        message,
        conversationId: selectedConversation._id,
      }).unwrap();
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
          disabled={isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="loading loading-spinner" aria-hidden="true"></div>
          ) : (
            <BsSend aria-hidden="true" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
