import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mainmenu.css";
import "../Chat/Chat";
import goBack from "../../assets/goBack.svg";

function MENU() {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    switch (buttonName) {
      case "chat":
        navigate("/chat"); // Navigate to the chat page
        break;
      case "friends":
        navigate("/"); // Navigate to HOME FOR TESTING
        break;
      // case "audio":
      //   navigate("/home"); // Navigate to HOME FOR TESTING - no current page
      //   break;
      // case "profile":
      //   navigate("/home"); // Navigate to HOME FOR TESTING - no current page
      //   break;
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
      <div className="fxc main-bg">
        <div className="main-header vcrse" style={{ paddingTop: "4rem" }}>
          <p>Hello, Peciti#3561!</p>
          <div className="fxr" style={{ columnGap: "2rem" }}>
            <div className="option-background vcrse">
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
            <div className="fxc" style={{ rowGap: "2rem" }}>
              <div className="room-background vcr">
                <button
                  className="create-room-button create-room-button-text"
                  onClick={() => handleButtonClick("create-room")}
                >
                  CREATE ROOM
                </button>
                <p className="join-room-text">to create a room</p>
              </div>
              <div className="room-background vcr">
                <p className="join-room-text">Joining a room?</p>
                <button
                  className="join-room-button join-room-button-text"
                  onClick={() => handleButtonClick("join-room")}
                >
                  JOIN NOW
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
