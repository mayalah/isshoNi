import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Chat from "./../../assets/chat.svg";
import "./Footer.css";
import CHAT from "../Chat/Chat";

const Footer = () => {
  const location = useLocation();
  const { pathname } = location;
  const [FooterState, setFooterState] = useState({ open: false });

  const handleFooterClick = () => setFooterState({ open: !FooterState.open });

  // Render Footer for all routes except "/"
  if (pathname === "/" || pathname === "/chat") {
    return null;
  }
  return (
    <div className="footer_container" onClick={handleFooterClick}>
      {FooterState.open ? (
        <img
          src={Chat}
          style={{
            height: `40px`,
            width: `40px`,
          }}
        />
      ) : (
        <CHAT fromFooter={true} />
      )}
    </div>
  );
};

export default Footer;
