import React, { useState } from "react";
import TabComponent from "./TabComponent";
import MenuComponent from "./MenuComponent";
import SearchComponent from "./SearchComponent";

const SideChatComponent = ({ setChatUser }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const addUserToAllTab = (user) => {
    setSelectedUsers((prevUsers) => {
      if (prevUsers.some((u) => u._id === user._id)) return prevUsers;
      return [...prevUsers, user];
    });
    setShowSearchResults(false);
    setChatUser(user);
  };

  return (
    <div>
      <div className="flex">
        <MenuComponent />
        <SearchComponent
          addUserToAllTab={addUserToAllTab}
          showSearchResults={showSearchResults}
          setShowSearchResults={setShowSearchResults}
        />
      </div>
      <TabComponent selectedUsers={selectedUsers} setChatUser={setChatUser} />
    </div>
  );
};

export default SideChatComponent;
