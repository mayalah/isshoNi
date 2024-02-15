import "./Homepage.css";
import character from "./../assets/characters.svg";
import rocket from "./../assets/rocket.svg";

const Homepage = () => {
  return (
    <div className="home-page">
      <div className="main-page">
        <p className="headline-1"> The website that connects</p>
        <p className="headline-2">YOUR COMMUNITY</p>
      </div>
      <div className="button-container">
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
    </div>
  );
};

export default Homepage;
