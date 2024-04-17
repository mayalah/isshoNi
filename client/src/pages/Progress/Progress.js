import { useNavigate } from "react-router-dom";
import "./Progress.css";
import "../../index.css";
import groupCharacters from "../../assets/characters.svg"


function PROGRESS(userEmailProp) {

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/menu");
  };

  return (
    <div>
      <div className="progress-bg" style={{ paddingTop: "8rem" }}>
        <div className="main-progress-header">
          Sorry, this page is still under construction. 
          <button className="go-home-button" onClick={() => handleGoBack()}>
            GO HOME
          </button>
          <img src={groupCharacters} alt="Group Character" />
        </div>
      </div>
    </div>
  );
}

export default PROGRESS;