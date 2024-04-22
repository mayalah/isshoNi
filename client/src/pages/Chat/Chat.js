import { useState } from "react";
import { Link } from "react-router-dom";
import "../Chat/Chat.css";
import "../../index.css";
import Friends from "./components/Friends/Friends";
import UserFrame from "./components/User/UserFrame";
import Message from "./components/Message/Message";
import goBack from "../../assets/goBack.svg";

function CHAT({ fromFooter }) {
  const email = localStorage.getItem("userEmail");
  const [activeButton, setActiveButton] = useState("me");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [userEmail, setUserEmail] = useState(email);
  const [friendEmail, setFriendEmail] = useState("");
  const userName = userEmail.split("@")[0];
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
    <div className={`chatDiv ${fromFooter ? "from-footer" : ""}`}>
      {!fromFooter ? (
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
      ) : (
        <div className="footer_back">X</div>
      )}
      <div className={`chat-bg ${fromFooter ? "" : "chat-bg-margin"} `}>
        <div className="left-menu-style">
          {!fromFooter ? <UserFrame userName={userName} /> : <div />}
          <Friends
            fromFooter={fromFooter}
            setSelectedFriend={handleFriendSelection}
            userEmailProp={userEmail}
            setFriendEmail={handleFriendSelectionEmail}
          />
          {!fromFooter ? (
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
                onClick={(e) => {
                  handleButtonClick("group");
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
                join a group
              </button>
            </div>
          ) : (
            <div />
          )}
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
