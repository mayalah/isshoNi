import "./Topbar.css";
const Topbar = ({ setLoginSignup }) => {
  return (
    <div className="top-bar">
      <p className="menu-item">EXPLORE</p>
      <p className="app-name">ISSHONI</p>
      <p
        className="menu-item"
        onClick={() => {
          setLoginSignup("SignIn");
        }}
      >
        SIGN IN
      </p>
    </div>
  );
};

export default Topbar;
