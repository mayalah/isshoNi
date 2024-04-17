import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../ResetPassword/ResetPassword.css";
import characters from "../../assets/characters.svg";
import { changePassword } from "../../utils/APIRoutes";
import axios from "axios";


function ResetPassword({}) {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const email = searchParams.get('email');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const goBackHome = () => {
    navigate("/");
  };

  const handleResetPassword = () => {
    axios.post(changePassword, { email, password })
    .then((response) => {
      if (response.status === 200) {
        alert("Password reset successful");
        navigate("/");
      }
    
    else{
      alert("Password reset failed. Please try again");
    }});
  }


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
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
export default ResetPassword;
