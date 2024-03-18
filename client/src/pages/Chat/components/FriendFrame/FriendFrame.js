import { useState } from "react";
import "../FriendFrame/FriendFrame.css";
import "./FriendFrame.css";
import "../../../../index.css";
import userIcon from "../../../../assets/userIcon.svg";

function FriendFrame({ label, onClick, isActive }) {
  return (
    <button
      className={`friend-frame-button friend-frame-text ${isActive ? "active" : ""}`}
      onClick={onClick} 
    >
      <img src={userIcon} alt="userIcon" className="icon" />
      <p>{label}</p>
    </button>
  );
}

export default FriendFrame;
