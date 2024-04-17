import "./Homepage.css";
import character from "../../../assets/characters.svg";
import rocket from "../../../assets/rocket.svg";

import { useNavigate } from "react-router-dom"; //WILL DELETE LATER

const Homepage = ({ setLoginSignup }) => {
  /* WILL DELETE LATER */
  const navigate = useNavigate();
  const handleMainMenuClick = () => {
    // Navigate to the main menu page
    if (localStorage.getItem("userName") === null) {
      alert("Please sign in first");
      return;
    }
    navigate("/menu");
  };
  /* END OF DELETE LATER */

  return (
    <div className="home-page">
      <div className="main-page">
        <p className="headline-1"> The website that connects</p>
        <p className="headline-2">YOUR COMMUNITY</p>
      </div>
      <div
        className="button-container"
        onClick={() => {
          setLoginSignup("SignUp");
        }}
      >
        Create an account
        <img src={rocket} />
        {/* <div className="character-button">
          <p className="button-text">Create an account</p>
        </div> */}
        {/* <img className="character-image" src={character} />
        <div className="button-box">
          <p className="button-text">Create an account</p>
        </div> */}
      </div>

      {/* WILL DELETE LATER */}
      <div className="button-container" onClick={handleMainMenuClick}>
        Main Menu
        <img src={rocket} />
      </div>
      {/* END OF DELETE LATER */}
    </div>
  );
};

export default Homepage;
