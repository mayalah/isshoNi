import "./Landing.css";
import Homepage from "./components/Homepage";
import Description from "./components/Description";
import Topbar from "../Topbar";
import { useState, useEffect } from "react";
import SignUp from "../SignUp";
import SignIn from "../SignIn";

const Landing = () => {
  const [scrollStyle, setScrollStyle] = useState("First-Page");
  const [loginSignUp, setLoginSignup] = useState("");
  const lookup = { 0: "First-Page", 1: "GreenBackground", 2: "PinkBackground" };
  function handleScroll() {
    let section = Math.floor(window.scrollY / window.innerHeight);
    if (scrollStyle !== lookup[section]) {
      setScrollStyle(lookup[section] || "PinkBackground");
    }
  }
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrollStyle]);
  return (
    <div className={`App ${scrollStyle}`}>
      {loginSignUp === "SignUp" ? (
        <SignUp setLoginSignup={setLoginSignup} />
      ) : loginSignUp === "SignIn" ? (
        <SignIn setLoginSignup={setLoginSignup} />
      ) : (
        <></>
      )}
      <Topbar setLoginSignup={setLoginSignup} />
      <Homepage setLoginSignup={setLoginSignup} />
      <Description scrollStyle={scrollStyle} />
    </div>
  );
};

export default Landing;
