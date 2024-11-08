import { useEffect } from "react";
import { useGetMessagesQuery } from "../redux/api/messageApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/slices/conversationSlice";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const {
    data: messages = [],
    error,
    isLoading,
  } = useGetMessagesQuery(selectedConversation?._id, {
    skip: !selectedConversation?._id,
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch messages.");
    } else {
      dispatch(setMessages(messages));
    }
  }, [messages, error, dispatch]);

  return { messages, isLoading };
};

export default useGetMessages;
