import { FunctionComponent, useMemo, useState } from "react";
import "../../../../index.css";
import userIcon from "../../../../assets/userIcon.svg";
import "./UserFrame.css";


function UserFrame ({userName}) {
  const userPic = localStorage.getItem("userImage");

  return (
    <div className="user-frame user-text">
      <div className="icon">
        <img src={userPic || userIcon} alt="userIcon" className="icon" />
      </div>
      <p>{userName}</p>
    </div>
  );
}

export default UserFrame;
