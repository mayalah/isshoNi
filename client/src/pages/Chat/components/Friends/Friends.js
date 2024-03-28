import { useState, useEffect } from "react";
import "../Friends/Friends.css";
import FriendFrame from "../FriendFrame/FriendFrame";
import mockFriendsData from "./mockFriendsData.json"; // USE WITH MOCK DATA
import * as APIRoutes from "../../../../utils/APIRoutes";
import axios from "axios";

function Friends({ setSelectedFriend, userEmail, setFriendEmail }) {
  const [activeButton, setActiveButton] = useState(null);
  const [friends, setFriends] = useState([]); // USE WITH API -> will fail Friends.test.js

  useEffect(() => {
    const userEmail = "peciti3561@tospage.com";
    axios
      .post(APIRoutes.getAllFriends, { email: userEmail })
      .then((response) => {
        console.log(response.data);
        setFriends(response.data);
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
      });
  }, []); // Empty dependency array means this effect runs once on mount// Empty dependency array means this effect runs once on mount

  const handleButtonClick = (friendId) => {
    setActiveButton(friendId);
    setSelectedFriend(friendId); // Pass the friendId to the parent component
  };

return (
    <div
        className="friend-container"
        style={{ overflowY: "scroll", maxHeight: "29rem" }}
    >
        {friends.map((friend) => (
            <FriendFrame
                key={friend.id}
                friend={friend}
                isActive={activeButton === friend.id}
                onClick={() => {
                    handleButtonClick(friend.name);
                    setFriendEmail(friend.email);
                }}
            />
        ))}
    </div>
);
}

export default Friends;
