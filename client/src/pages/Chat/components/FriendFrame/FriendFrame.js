import { useState } from "react";
import "../FriendFrame/FriendFrame.css";
import "./FriendFrame.css";
import "../../../../index.css";
import userIcon from "../../../../assets/userIcon.svg";

function FriendFrame({ fromFooter, friend, onClick, isActive }) {
  return (
    <button
      className={`friend-frame-button friend-frame-text ${
        isActive ? "active" : ""
      } ${fromFooter ? "from-footer" : ""}`} // Add "from-footer" class if fromFooter is true
      onClick={onClick}
    >
      <img
        src={friend.pictureURL}
        alt="userIcon"
        className={`icon ${fromFooter ? "small" : ""}`}
      />{" "}
      <p>{friend.name}</p>
    </button>
  );
}

export default FriendFrame;
