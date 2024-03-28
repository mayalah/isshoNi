import { useState } from "react";
import { Link } from "react-router-dom";
import "../Chat/Chat.css";
import "../../index.css";
import Friends from "./components/Friends/Friends";
import UserFrame from "./components/User/UserFrame";
import Message from "./components/Message/Message";
import goBack from "../../assets/goBack.svg";
import { set } from "date-fns";

function CHAT() {
  const [activeButton, setActiveButton] = useState("me"); // Set initial value to "me" on page load
  const [selectedFriend, setSelectedFriend] = useState(null); // State to keep track of the selected friend
  const [userEmail, setUserEmail] = useState("koolkishan@gmail.com"); // State to keep track of the user [TO BE IMPLEMENTED LATER]
  const [FriendEmail, setFriendEmail] = useState(""); // State to keep track of the friend [TO BE IMPLEMENTED LATER]

  // Verifies which button is clicked & sets
  const handleButtonClick = (buttonName) => {
    console.log(`${buttonName} is clicked in CHAT component`);
    setActiveButton(buttonName);
  };

  // Updates selectedFriend state with the friendId
  const handleFriendSelection = (friendId) => {
    console.log(`${friendId} is in handleFriendSelection in CHAT component`);
    setSelectedFriend(friendId);
  };

  // Updates selectedFriend state with their email
  const handleFriendSelectionEmail = (friendEmail) => {
    console.log(`${friendEmail} is in handleFriendSelection in CHAT component`);
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
          <UserFrame label="koolkishan" />
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
        <Message setSelectedFriend={selectedFriend} userEmail={userEmail} />
      </div>
    </div>
  );
}

export default CHAT;
