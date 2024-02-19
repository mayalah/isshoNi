import { useState } from "react";
import { Link } from "react-router-dom";
import "../Chat/Chat.css"
import "../../index.css"
import Friends from "./components/Friends/Friends";
import UserFrame from "./components/User/UserFrame";
import Message from "./components/Message/Message";

function CHAT() {

  // State to keep track of the active button
  const [activeButton, setActiveButton] = useState("me"); // Set initial value to "me" on page load
  const [selectedFriend, setSelectedFriend] = useState(null); // State to keep track of the selected friend

  // Verifies which button is clicked & sets
  const handleButtonClick = (buttonName) => {
    console.log(`${buttonName} is clicked in CHAT component`);
    setActiveButton(buttonName);
  };

  // Updates selectedFriend state with the friendId
  const handleFriendSelection = (friendId) => {
    console.log(`${friendId} is in handleFriendSelection in CHAT component`);
    setSelectedFriend(friendId);
  }

  return (
    <div className="fxr" style={{ columnGap: "2rem", paddingTop: "5rem" }}>
      <nav style={{ padding: "0.5rem" }}> 
        <Link to="/">Go Back</Link>
      </nav>
      <div className="fxc" style={{ rowGap: "1rem" }}>
        <UserFrame label="koolkishan" />
        <Friends setSelectedFriend={handleFriendSelection} /> {/* Pass the function to the Friends component as setSelectedFriend */}
        <div className="fxr" style={{ columnGap: "1rem" }}>
          <button
            className={`button-me button-decision-text ${activeButton === "me" ? "active" : ""}`}
            onClick={() => handleButtonClick("me")}
          >
            create a group
          </button>
          <button
            className={`button-group button-decision-text ${activeButton === "group" ? "active" : ""}`}
            onClick={() => handleButtonClick("group")}
          >
            join a group
          </button>
        </div>
      </div>
      <Message setSelectedFriend={selectedFriend} /> {/* Pass the selectedFriend state to the Message component as setSelectedFriend */}
    </div>
  );
}

export default CHAT;
