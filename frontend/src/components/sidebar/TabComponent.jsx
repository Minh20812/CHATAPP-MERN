import React, { useState } from "react";

const TabComponent = ({ selectedUsers, setChatUser }) => {
  const [activeTab, setActiveTab] = useState("all");

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <ul className="space-y-4">
              {selectedUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center bg-gray-700 p-3 rounded-lg shadow hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => setChatUser(user)}
                >
                  <div className="mr-4">
                    {/* Placeholder avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-400">
                      {user.email || user.phone}
                    </p>
                    <p className="text-sm text-gray-400">{user._id}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
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
