// frontend/src/components/FriendItem.js
import React from "react";

const FriendItem = ({ friend }) => {
  return (
    <li className="friend-item">
      <span>{friend.name}</span>
      <span
        className={`status ${
          friend.status === "online" ? "online" : "offline"
        }`}
      >
        {friend.status}
      </span>
    </li>
  );
};

export default FriendItem;
