import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useDispatch } from "react-redux";
import { addMessage } from "../redux/slices/conversationSlice";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      dispatch(addMessage(newMessage));
    };

    socket?.on("newMessage", handleNewMessage);

    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, dispatch]);
};

export default useListenMessages;
