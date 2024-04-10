import { useState } from "react";
import { Link } from "react-router-dom";
import "../Chat/Chat.css";
import "../../index.css";
import Friends from "./components/Friends/Friends";
import UserFrame from "./components/User/UserFrame";
import Message from "./components/Message/Message";
import goBack from "../../assets/goBack.svg";

function CHAT() {
  const [activeButton, setActiveButton] = useState("me");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [userEmail, setUserEmail] = useState("peciti3561@tospage.com");
  const [friendEmail, setFriendEmail] = useState("");

  // Verifies which button is clicked & sets
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Updates selectedFriend state with the friendId
  const handleFriendSelection = (friendId) => {
    setSelectedFriend(friendId);
  };

  // Updates selectedFriend state with their email
  const handleFriendSelectionEmail = (friendEmail) => {
    setFriendEmail(friendEmail);
  };

  return (
    <div>
      <nav className="back-button-chat">
        <Link to="/menu">
          <img
            src={goBack}
            alt="Go Back"
            height={"50px"}
            onClick={() => handleButtonClick("goBack")}
          />
        </Link>
      </nav>
      <div className="chat-bg chat-bg-margin">
        <div className="left-menu-style">
          <UserFrame userName="peciti#3561" />
          <Friends
            setSelectedFriend={handleFriendSelection}
            userEmail={userEmail}
            setFriendEmail={handleFriendSelectionEmail}
          />
          <div className="bottom-button-menu-style">
            <button
              className={`button-me button-decision-text ${
                activeButton === "me" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("me")}
            >
              create a group
            </button>
            <button
              className={`button-group button-decision-text ${
                activeButton === "group" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("group")}
            >
              join a group
            </button>
          </div>
        </div>
        {friendEmail && (
          <Message
            setSelectedFriend={selectedFriend}
            userEmail={userEmail}
            friendEmail={friendEmail}
          />
        )}
      </div>
    </div>
  );
}

export default CHAT;
