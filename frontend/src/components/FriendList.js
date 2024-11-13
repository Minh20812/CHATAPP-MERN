import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFriends } from "../slices/friendListSlice";
import FriendItem from "./FriendItem";

const FriendList = () => {
  const dispatch = useDispatch();
  const { friends, loading, error } = useSelector((state) => state.friendList);

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);

  if (loading) return <p>Loading friends...</p>;
  if (error) return <p>Error loading friends: {error}</p>;

  return (
    <div className="friend-list">
      <h2>Friend List</h2>
      <ul>
        {friends.map((friend) => (
          <FriendItem key={friend.id} friend={friend} />
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
