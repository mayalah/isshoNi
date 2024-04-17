import "./ForgetPassword.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { forgotPassword} from "../../utils/APIRoutes";
/* global google */

const ForgetPassword = ({ setLoginSignup }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();

  const handleSignIn = (event) => {
    event.preventDefault();

    axios.post(forgotPassword, {email}).then((response) => {
      if (response.status === 200) {
        setLoginSignup("");
        alert("Check your email for password reset link");
        console.log("Email sent");
      }
    })

  };

  
  return (
   <div className="Forget-Password">
     <div className="Forget-PasswordModal">
     <button onClick={() => {setLoginSignup("");}} className="CloseButton">
        X
      </button>

      <div style={{ marginTop: "50px" }}></div>

      <form onSubmit={handleSignIn}>
        <div className="Forget-Password1">Forgot your Password?</div>
        <div className="forget-password" style={{ marginTop: "25px" }}>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </div>

        <div style={{ marginTop: "50px" }}></div>

        <div className="field">
          <a>Email</a>
        </div>

        <input
          type="text"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
          
        <div style={{ marginTop: "50px" }}></div>

        <button type="submit" className="Forget-PasswordButton">
          Reset Password
        </button>

        <div className="for-get">
          Already have an account?
          <a href="#" onClick={() => setLoginSignup("SignIn")}>
            Log in
          </a>
        </div>

        </form>
     </div>
   </div>
 );
};


export default ForgetPassword;
