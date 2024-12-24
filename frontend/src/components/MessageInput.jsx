import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSendMessageMutation } from "../redux/api/chatApiSlice";
import {
  setSocketConnection,
  setOnlineStatus,
} from "../redux/feature/userSlice";
import io from "socket.io-client";

const MessageInput = ({ receiverId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading, isError, error }] = useSendMessageMutation();
  const currentUserId = useSelector((state) => state.auth.userInfo?._id);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!currentUserId || !token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000, // Đặt lại kết nối sau 1000ms !!! Important
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setSocket(newSocket);
      dispatch(setSocketConnection(true));
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      dispatch(setSocketConnection(false));
    });

    newSocket.on("onlineUser", (users) => {
      dispatch(setOnlineStatus(users));
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();

        setSocket(null);

        dispatch(setSocketConnection(false));
      }
    };
  }, [currentUserId, token, dispatch]);

  const handleSend = async () => {
    if (!message.trim() || !receiverId) {
      console.error("Missing required fields:", {
        message: message.trim(),
        receiverId,
      });

      return;
    }

    // Create timestamp with UTC+7
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Bangkok", // UTC+7
    });

    const messagePayload = {
      receiverId: receiverId,
      content: message.trim(),
      timestamp: timestamp,
    };

    // console.log("Message payload:", messagePayload);

    try {
      // Gửi tin nhắn qua API trước
      const response = await sendMessage(messagePayload).unwrap();
      // console.log("Message sent successfully:", response);

      // Nếu API thành công, gửi qua socket
      if (socket?.connected) {
        socket.emit("new message", response);
      }

      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
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
        onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        className={`p-2 ${
          isLoading ? "bg-gray-500" : "bg-blue-500"
        } text-white rounded-md`}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
      {isError && (
        <div className="text-red-500 text-sm mt-1">
          {error?.data?.message || "Failed to send message"}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
