import { useGetMessagesQuery } from "../../redux/api/messageApiSlice";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Chat";

const ChatMessages = ({ conversationId }) => {
  const { data: messages = [], isLoading } =
    useGetMessagesQuery(conversationId);

  if (isLoading) {
    return <MessageSkeleton />;
  }

  return (
    <div>
      {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
};

export default ChatMessages;
