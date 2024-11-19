import React from "react";
import ChatBox from "../../../components/ChatBox";

const MainDashboard = ({ chatUser }) => {
  return (
    <div className="bg-slate-400 w-full">
      {chatUser ? (
        <ChatBox chatUser={chatUser} />
      ) : (
        <p>Select a user to start chatting</p>
      )}
    </div>
  );
};

export default MainDashboard;
