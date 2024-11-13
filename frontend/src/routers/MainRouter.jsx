import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuComponent from "../components/sidebar/MenuComponent.jsx";
import SearchComponent from "../components/sidebar/SearchComponent.jsx";
import TabComponent from "../components/sidebar/TabComponent.jsx";
import MainDashboard from "../screens/SideScreens/dashboard/MainDashBoard.jsx";

const MainRouter = () => {
  return (
    <>
      <BrowserRouter>
        <div className="flex">
          <div className=" w-2/5">
            <div className=" flex">
              <MenuComponent />
              <SearchComponent />
            </div>
            <TabComponent />
          </div>
          <div className=" flex justify-center items-center  h-full w-4/5">
            <Routes>
              <Route path="/" element={<MainDashboard />} />
              {/* <Route path="/:userId" element={<MessagePage />} /> */}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default MainRouter;
