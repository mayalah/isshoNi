import { useState } from "react";
import "../FriendFrame/FriendFrame.css";
import "./FriendFrame.css";
import "../../../../index.css";
import userIcon from "../../../../assets/userIcon.svg";

function FriendFrame({ friend, onClick, isActive }) {
  return (
    <button
      className={`friend-frame-button friend-frame-text ${isActive ? "active" : ""}`}
      onClick={onClick} 
    >
      <img src={friend.pictureURL} alt="userIcon" className="icon" />
      <p>{friend.name}</p>
    </button>
  );
}

export default FriendFrame;
