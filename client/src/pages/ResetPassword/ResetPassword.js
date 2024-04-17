import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ResetPassword/ResetPassword.css";
import characters from "../../assets/characters.svg";

function ResetPassword({ setLoginSignup }) {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const goBackHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="headreset">
        Reset Account Password
        <div style={{ marginTop: "50px" }}></div>
        <img src={characters} alt="characters" className="characters" />
        <div className="reset-password">
          Enter a new password for your account.
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="PasswordTog"
        >
          {passwordVisible ? "Hide Password" : "Show Password"}
        </button>
      </div>
      <input
        type={passwordVisible ? "text" : "password"}
        placeholder="Enter your new password.."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
        required
      />
      <div className="ButtonContainer">
        <button
          type="submit"
          className="ResetButton"
          onClick={() => goBackHome()}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
