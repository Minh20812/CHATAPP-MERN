import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideChatComponent from "../components/sidebar/SideChatComponent.jsx";
import MainDashboard from "../screens/SideScreens/dashboard/MainDashBoard.jsx";

const MainRouter = () => {
  const [chatUser, setChatUser] = useState(null); // Add state for selected user

  return (
    <BrowserRouter>
      <div className="flex">
        <div className="w-2/5">
          <SideChatComponent setChatUser={setChatUser} />{" "}
          {/* Pass setChatUser */}
        </div>
        <div className="flex justify-center items-center h-full w-4/5">
          <Routes>
            <Route path="/" element={<MainDashboard chatUser={chatUser} />} />{" "}
            {/* Pass chatUser */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default MainRouter;
