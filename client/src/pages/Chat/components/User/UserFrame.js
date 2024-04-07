import { FunctionComponent, useMemo, useState } from "react";
import "../../../../index.css";
import userIcon from "../../../../assets/userIcon.svg";
import "./UserFrame.css";


function UserFrame ({userName}) {
    return (
      <div className="user-frame user-text">
        <div className="icon">
          <img src={userIcon} alt="userIcon" className="icon"/>
        </div>
        <p>{userName}</p>
      </div>
    );
  };

export default UserFrame;
