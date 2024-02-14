import { useState } from "react";
import "../components/css/FriendFrame.css";
import "../index.css";
import userIcon from "../assets/userIcon.svg";

function FriendFrame({ label }) {
  const [activeButton, setActiveButton] = useState(""); // Set initial value to empty string on page load

  const handleButtonClick = (buttonName) => {
    console.log("ORANGE BUTTON: I am clicked");
    setActiveButton(buttonName);
  };

  return (
    <button
      className={`friend-frame-button friend-frame-text ${activeButton === label ? "active" : ""}`}
      onClick={() => handleButtonClick(label)}
    >
      <img src={userIcon} alt="userIcon" className="icon" />
      <p>{label}</p>
    </button>
  );
}

export default FriendFrame;
