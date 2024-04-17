import { useState, useEffect } from "react";
import "../Friends/Friends.css";
import FriendFrame from "../FriendFrame/FriendFrame";
import * as APIRoutes from "../../../../utils/APIRoutes";
import axios from "axios";

function Friends({ setSelectedFriend, userEmailProp, setFriendEmail }) {
  const [activeButton, setActiveButton] = useState(null);
  const [friends, setFriends] = useState([]); 

  useEffect(() => {
    const userEmail = userEmailProp;
    axios
      .post(APIRoutes.getAllFriends, { email: userEmail })
      .then((response) => {
        console.log(response.data);
        setFriends(response.data);
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
      });
  }, []); 

  const handleButtonClick = (friendId) => {
    setActiveButton(friendId);
    setSelectedFriend(friendId); 
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
