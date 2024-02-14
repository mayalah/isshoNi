
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/css/mainmenu.css";
import "../pages/Chat"

function MENU() {
  
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    console.log(buttonName)
    console.log("I am clicked");
    setActiveButton(buttonName);
    switch (buttonName) {
      case "chat":
        navigate("/chat"); // Navigate to the chat page
        break;
      case "friends":
        navigate("/home"); // Navigate to HOME FOR TESTING
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
    <div className="fxc">
        <nav style={{ padding: "0.5rem" }}> 
          <Link to="/">Go Back</Link>
        </nav>
        <div className="main-header vcrse" style={{paddingTop: '4rem'}}> 
          <p>Hello, USERID#1234!</p>
          <div className="fxr" style={{ columnGap: '2rem' }}>
            <div className="option-background vcrse">
              <button id="chat" className="chat-button" onClick={() => handleButtonClick('chat')}> 
                <p className="button-text">My Chats</p>
              </button>
              <button id="friends" className="friends-button" onClick={() => handleButtonClick('friends')}>
                <p className="button-text">My Friends</p>
              </button>
              <button id="audio" className="audio-button" onClick={() => handleButtonClick('audio')}>
                <p className="button-text">Audio Settings</p>
              </button>
              <button id="profile" className="profile-button" onClick={() => handleButtonClick('profile')}>
                <p className="button-text">Profile Settings</p>
              </button>
            </div>
            <div className="fxc" style={{ rowGap: '2rem' }}>
              <div className="room-background vcr">
                <button className="create-room-button create-room-button-text" onClick={() => handleButtonClick('create-room')}>
                  CREATE ROOM
                </button>
                <p className="join-room-text">to create a room</p>
              </div>
              <div className="room-background vcr">
                <p className="join-room-text">Joining a room?</p>
                <button className="join-room-button join-room-button-text" onClick={() => handleButtonClick('join-room')}>
                    JOIN NOW
                </button> 
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default MENU;

