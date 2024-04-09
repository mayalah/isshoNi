import { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "./LinkRoom.css";
import "../../index.css";
import goBack from "../../assets/goBack.svg";
import linkCharacter from "../../assets/linkCharacter.svg";
import SignInWithGGButton from "./SignInPage";

function LINKROOM() {
  const [activeButton, setActiveButton] = useState("me");
  const [userEmail, setUserEmail] = useState("peciti3561@tospage.com");
  const [linkInput, setLinkInput] = useState("");

  const navigate = useNavigate();

  // Verifies which button is clicked & sets
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Send a message to the server from UI
  const handleSendMessage = () => {
    if (linkInput.trim()) {
      console.log("Message sent:", linkInput);
      setLinkInput("");
    }
  };
  const handleSignInClick = () => {
    navigate("/signinwithGG");
  }


  return (
    <div>
      <nav className="back-button">
        <Link to="/menu">
          <img
            src={goBack}
            alt="Go Back"
            height={"50px"}
            onClick={() => handleButtonClick("goBack")}
          />
        </Link>
      </nav>
      <div className="w-[100px] h-[30px] bg-white relative top-4 flex flex-row justify-center items-center rounded-sm ml-2">
        <button onClick ={handleSignInClick}>
          Sign In
        </button>
      </div>
    
     
      <div className="fxr link-bg" style={{ paddingTop: "6rem" }}>
        <div className="fxc main-link-header" style={{ rowGap: "1rem" }}>
          ENTER ROOM ID TO JOIN
          <div className="link-button">
          
            <input
              type="text"
              className="link-input"
              placeholder="type here..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
          </div>
          <img src={linkCharacter} alt="Link Character" />
        </div>
      </div>
    </div>
  );
}

export default LINKROOM;
