import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import ChatMessages from "./ChatMessages";
import MessageInput from "./ChatInput";
import { clearSelectedConversation } from "../../redux/api/conversationSlice";
import { TiMessages } from "react-icons/ti";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  useEffect(() => {
    return () => dispatch(clearSelectedConversation());
  }, [dispatch]);

  if (!selectedConversation) {
    return <NoChatSelected />;
  }

  return (
    <div className="md:min-w-[450px] flex flex-col">
      {/* Header */}
      <div className="bg-slate-500 px-4 py-2 mb-2">
        <span className="label-text">To:</span>{" "}
        <span className="text-gray-900 font-bold">
          {selectedConversation.fullName}
        </span>
      </div>
      <ChatMessages conversationId={selectedConversation._id} />
      <MessageInput />
    </div>
  );
};

const NoChatSelected = () => {
  const authUser = useSelector((state) => state.auth.userInfo);

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};

export default MessageContainer;
