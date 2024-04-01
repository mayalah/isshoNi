import { useState } from "react";
import { Link } from "react-router-dom";
import "../Chat/Chat.css";
import "../../index.css";
import Friends from "./components/Friends/Friends";
import UserFrame from "./components/User/UserFrame";
import Message from "./components/Message/Message";
import goBack from "../../assets/goBack.svg";

function CHAT() {
  const [activeButton, setActiveButton] = useState("me"); // Set initial value to "me" on page load
  const [selectedFriend, setSelectedFriend] = useState(null); // State to keep track of the selected friend
  const [userEmail, setUserEmail] = useState("peciti3561@tospage.com"); // State to keep track of the user [TO BE IMPLEMENTED LATER]
  const [friendEmail, setFriendEmail] = useState(""); // State to keep track of the friend [TO BE IMPLEMENTED LATER]

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
      <nav className="back-button">
        <Link to="/menu">
          <img
            src={goBack}
            alt="Go Back"
            height={"50px"}
            onClick={() => handleButtonClick("goBack")}
          />
        </Link>
      </nav>
      <div
        className="fxr chat-bg"
        style={{ columnGap: "2rem", paddingTop: "5rem" }}
      >
        <div className="fxc" style={{ rowGap: "1rem" }}>
          <UserFrame userName="peciti#3561" />
          <Friends
            setSelectedFriend={handleFriendSelection}
            userEmail={userEmail}
            setFriendEmail={handleFriendSelectionEmail}
          />
          <div className="fxr" style={{ columnGap: "1rem" }}>
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
        {friendEmail && <Message setSelectedFriend={selectedFriend} userEmail={userEmail} friendEmail={friendEmail}/>}
      </div>
    </div>
  );
}

export default CHAT;
