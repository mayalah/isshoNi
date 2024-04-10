import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { signInWithGoogleRoute, signUpWithGoogleRoute } from "../../utils/APIRoutes"; // Replace with your actual route
/* global google */

const SignIn = ({ setLoginSignup}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = (event) => {
    event.preventDefault();
    console.log("Signing in with:", username, password);
    setLoginSignup("");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogle = async (response) => {
    // const credential = response.credential;
    // setLoading(true);
    // axios.post(signInWithGoogleRoute, { credential: credential })
    //   .then((response) => {
    //     if (response.data.message === "success") {
    //       console.log(response.data);
    //       localStorage.setItem("userName", data.name)
    //             localStorage.setItem("userEmail", data.email)
    //             localStorage.setItem("userImage", data.image)
    //             console.log(localStorage.getItem("userName"))
    //             console.log(localStorage.getItem("userEmail"))
    //             console.log(localStorage.getItem("userImage"))
    //       navigate("/menu");
    //     }
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     setLoading(false);
    //   });
    const url = signUpWithGoogleRoute
        const credential =response.credential
        console.log(credential)
        setLoading(true)
        axios.post(url,
          {credential: credential}).then(response =>{
            const data = response.data
            const message = data.message
            console.log(data)

             if (message == "success"){
                localStorage.setItem("userName", data.name)
                localStorage.setItem("userEmail", data.email)
                localStorage.setItem("userImage", data.image)
                console.log(localStorage.getItem("userName"))
                console.log(localStorage.getItem("userEmail"))
                console.log(localStorage.getItem("userImage"))
                navigate("/menu")
            }
            setLoading(false)
        }).catch(error =>{
          console.log(error)

        })
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
          // { theme: "outline", size: "large" } // You can adjust the options
          {
            theme: "filled_white",
            text: "signin_with",
            shape: "pill",
            
          }
        );
      }
    };
  
    // Listen for the Google script to load
    window.addEventListener('google-script-loaded', handleScriptLoad);
  
    // Load the Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => window.dispatchEvent(new Event('google-script-loaded'));
    document.body.appendChild(script);
  
    // Cleanup
    return () => {
      window.removeEventListener('google-script-loaded', handleScriptLoad);
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
            <a>Username</a>
          </div>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            <a href="#" >Forget password?</a>
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
