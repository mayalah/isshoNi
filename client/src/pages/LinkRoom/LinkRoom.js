import { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "./LinkRoom.css";
import "../../index.css";
import goBack from "../../assets/goBack.svg";
import linkCharacter from "../../assets/linkCharacter.svg";
import SignInWithGGButton from "./SignInPage";
import Comments from "../Game/components/Comments";

function LINKROOM() {
  const [activeButton, setActiveButton] = useState("me");
  // const [userEmail, setUserEmail] = useState("peciti3561@tospage.com");
  const [roomId, setRoomId] = useState("");

  const [haveRoomId, setHaveRoomId] = useState(false);

  const navigate = useNavigate();

  // Verifies which button is clicked & sets
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setRoomId(roomId);
    setHaveRoomId(true);
    navigate("/comments", { state: { roomId: roomId } })
  }
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
      <div className="w-[200px] h-[30px] bg-white relative top-4  flex flex-row justify-center items-center rounded-sm ml-2">
        <button onClick ={handleSignInClick}>
          Sign In
        </button>
      </div>
    
     
      <div className="fxr link-bg" style={{ paddingTop: "6rem" }}>
        <div className="fxc main-link-header" style={{ rowGap: "1rem" }}>
          ENTER ROOM ID TO JOIN
          <form className="link-button" onSubmit ={handleOnSubmit}>
          
            <input
              type="text"
              className="link-input"
              placeholder="type here..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleOnSubmit(e);
                }
              }}
            />
            
          </form>
          <img src={linkCharacter} alt="Link Character" />
          
        </div>
      </div>
      {/* {haveRoomId ? <Comments roomIdPara={roomId} /> : <></>} */}
    </div>
  );
}

export default LINKROOM;
