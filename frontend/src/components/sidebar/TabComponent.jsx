import React, { useState } from "react";

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return <div>Here are all your chats.</div>;
      case "unread":
        return <div>These are your unread messages.</div>;
      case "personal":
        return <div>Here are your personal chats.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-white h-full flex flex-col p-4">
      <div className="flex justify-between">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "all"
              ? "bg-gray-700 text-blue-400"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Chats
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "unread"
              ? "bg-gray-700 text-blue-400"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "personal"
              ? "bg-gray-700 text-blue-400"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Personal
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-700 rounded-md">{renderContent()}</div>
    </div>
  );
};

export default TabComponent;
