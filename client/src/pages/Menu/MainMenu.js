import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mainmenu.css";
import "../Chat/Chat";
import goBack from "../../assets/goBack.svg";
import cloudCharacter from "../../assets/cloudCharacter.svg";
import redCharacter from "../../assets/redCharacter.svg";

function MENU() {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    switch (buttonName) {
      case "chat":
        navigate("/chat"); // Navigate to the chat page
        break;
      case "create-room":
        navigate("/link"); // Navigate to the create-room page
        break;
      case "join-room":
        navigate("/link"); // Navigate to the join-room page
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <nav className="main-back-button">
        <Link to="/">
          <img
            src={goBack}
            alt="Go Back"
            height={"50px"}
            onClick={() => handleButtonClick("goBack")}
          />
        </Link>
      </nav>
      <div className="main-bg">
        <div className="main-header">
          <p>Hello, Peciti#3561!</p>
          <div className="menu-styling">
            <div className="option-background">
              <button
                id="chat"
                className="chat-button"
                onClick={() => handleButtonClick("chat")}
              >
                <p className="button-text">My Chats</p>
              </button>
              <button
                id="friends"
                className="friends-button"
                onClick={() => handleButtonClick("friends")}
              >
                <p className="button-text">My Friends</p>
              </button>
              <button
                id="audio"
                className="audio-button"
                onClick={() => handleButtonClick("audio")}
              >
                <p className="button-text">Audio Settings</p>
              </button>
              <button
                id="profile"
                className="profile-button"
                onClick={() => handleButtonClick("profile")}
              >
                <p className="button-text">Profile Settings</p>
              </button>
            </div>
            <div className="option-styling">
              <div className="room-background">
                <img
                  src={redCharacter}
                  alt="cloudCharacter"
                  className="red-character"
                />
                <button
                  className="create-room-button create-room-button-text"
                  onClick={() => handleButtonClick("create-room")}
                >
                  JOIN GAME NOW
                </button>
                <p className="join-room-text">
                  Invite your friends to join a game!
                </p>
              </div>
              <div className="room-background">
                <p className="join-room-text">
                  Grab your friends, it's time to watch!
                </p>
                <img
                  src={cloudCharacter}
                  alt="cloudCharacter"
                  className="cloud-character"
                />
                <button
                  className="join-room-button join-room-button-text"
                  onClick={() => handleButtonClick("join-room")}
                >
                  JOIN WATCH PARTY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MENU;
