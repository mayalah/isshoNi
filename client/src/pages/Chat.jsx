import { useState } from "react";
import { Link } from "react-router-dom";
import "../pages/css/chat.css";
import FriendFrame from "../components/FriendFrame";
import UserFrame from "../components/UserFrame";
import Message from "../components/Message";

function CHAT() {
  const [activeButton, setActiveButton] = useState("me"); // Set initial value to "me" on page load
  const handleButtonClick = (buttonName) => {
    console.log("I am clicked");
    setActiveButton(buttonName);
  };

  return (
    <div className="fxr" style={{ columnGap: "2rem", paddingTop: "5rem" }}>
      <nav style={{ padding: "0.5rem" }}> 
        <Link to="/">Go Back</Link>
      </nav>
      <div className="fxc" style={{ rowGap: "1rem" }}>
        <UserFrame label="koolkishan" />
        <div className="scroll-container vcrse">
          <div className="friend-container">
              <FriendFrame label="Agnes#2857" />
              <FriendFrame label="Siri#9264" />
              <FriendFrame label="Hana#8725" />
              <FriendFrame label="Kishan#0001" />
          </div>
        </div>
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
      <Message />
    </div>
  );
}

export default CHAT;
