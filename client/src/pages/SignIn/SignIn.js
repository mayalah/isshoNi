import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import {  signUpWithGoogleRoute,loginRoute} from "../../utils/APIRoutes"; // Replace with your actual route
/* global google */

const SignIn = ({ setLoginSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = (event) => {
    event.preventDefault();
    console.log("Signing in with:", password);
    axios.post(loginRoute, { email, password })
    .then((response) => {
      if (response.status === 200) {
        const userName = email.split("@")[0];

        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", email);


        setLoginSignup("");
        navigate("/menu");
      }else{
        console.log("Sign in failed");
      }
      })
    
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogle = async (response) => {
    const credential = response.credential;
    setLoading(true);
    axios
      .post(signUpWithGoogleRoute, { credential: credential })
      .then((response) => {
        const data = response.data;
        if (response.data.message === "success") {
          localStorage.setItem("userName", data.name);
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userImage", data.image);
          console.log(localStorage.getItem("userName"));
          console.log(localStorage.getItem("userEmail"));
          console.log(localStorage.getItem("userImage"));
          navigate("/menu");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleScriptLoad = () => {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogle,
        });
        google.accounts.id.renderButton(
          document.getElementById("googleSignUpDiv"),
          // You can adjust the options
          {
            theme: "filled_white",
            text: "signin_with",
            shape: "pill",
          }
        );
      }
    };

    // Listen for the Google script to load
    window.addEventListener("google-script-loaded", handleScriptLoad);

    // Load the Google API script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.dispatchEvent(new Event("google-script-loaded"));
    document.body.appendChild(script);

    // Cleanup
    return () => {
      window.removeEventListener("google-script-loaded", handleScriptLoad);
    };
  }, []);

  return (
    <div className="SignIn">
      <div className="SignInModal">
        <button
          onClick={() => {
            setLoginSignup("");
          }}
          className="CloseButton"
        >
          X
        </button>

        <div className="login">Log in</div>

        <div className="signup">
          New to isshoni?
          <a href="#" onClick={() => setLoginSignup("SignUp")}>
            Sign up for free
          </a>
        </div>

        <form onSubmit={handleSignIn}>
          <div className="field">
            <a>Email</a>
          </div>

          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="passwordfield">
            <a>Password</a>
          </div>

          <div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="PasswordToggleButton"
            >
              {passwordVisible ? "Hide Password" : "Show Password"}
            </button>
          </div>

          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="ForgetPassword">
            <a href="#" onClick={() => setLoginSignup("ForgetPassword")}>
              Forget password?
            </a>
          </div>

          <button type="submit" className="SignInButton">
            Log in
          </button>

          <div className="DividerContainer">
            <span className="DividerLine"></span>
            <span className="DividerText">OR</span>
            <span className="DividerLine"></span>
          </div>
          {loading ? <div>Loading...</div> : <div id="googleSignUpDiv"></div>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
