import { useState, useEffect } from "react";
import "../Friends/Friends.css";
import FriendFrame from "../FriendFrame/FriendFrame";
import mockFriendsData from "./mockFriendsData.json"; // USE WITH MOCK DATA
import * as APIRoutes from "../../../../utils/APIRoutes";


function Friends({ setSelectedFriend, userEmail }) {
    const [activeButton, setActiveButton] = useState(null);
    // const [friends, setFriends] = useState([]); // USE WITH API -> will fail Friends.test.js 
    const [friends, setFriends] = useState(mockFriendsData); // USE WITH MOCK DATA

    // NEED TO IMPLEMENT API CALL TO GET FRIENDS -> use mockFriendsData for now
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch(APIRoutes.getAllFriends, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: "user@example.com" }) // Replace with dynamic user email
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFriends(data); // Assume the API returns an array of friends
                console.log("Fetched friends:", data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };
        fetchFriends();
    }, []); // Empty dependency array means this effect runs once on mount

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