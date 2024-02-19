import { useState } from "react";
import "../Friends/Friends.css";
import FriendFrame from "../FriendFrame/FriendFrame";

function Friends({ setSelectedFriend }) {
    const [activeButton, setActiveButton] = useState(null);

    const friends = [
        { label: "Agnes#2857", id: "Agnes#2857" },
        { label: "Siri#9264", id: "Siri#9264" },
        { label: "Hana#8725", id: "Hana#8725" },
        { label: "Kishan#0001", id: "Kishan#0001" },
        { label: "Jess#0121", id: "Jess#0121" },
        { label: "Mirhisl#0301", id: "Mirhisl#0301" },
        { label: "Wishan#1301", id: "Wishan#1301" },
        { label: "Carl#8191", id: "Carl#8191" },
        { label: "Jen#2846", id: "Jen#2846" },
        { label: "Pierce#9384", id: "Pierce#9384" },
    ];

    const handleButtonClick = (friendId) => {
        console.log(`IN FRIENDS COMPONENT: ${friendId} is clicked`);
        setActiveButton(friendId);
        setSelectedFriend(friendId); // Pass the friendId to the parent component
    };

    return (
        <div className="friend-container" style={{ overflowY: "scroll", maxHeight: "29rem"}}>
            {friends.map((friend) => (
                <FriendFrame
                    key={friend.id}
                    label={friend.label}
                    isActive={activeButton === friend.id}
                    onClick={() => handleButtonClick(friend.id)}
                />
            ))}
        </div>
    );
}

export default Friends;
