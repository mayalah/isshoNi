import React from "react";
import { Link } from "react-router-dom";
const Landing = () => {


    
  return (
    <>
    
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <Link
          to="/signUp"
          style={{
            textDecoration: "none",
            border: "1px solid gray",
            padding: "0.5rem 1rem",
            backgroundColor: "wheat",
            color: "#333",
          }}
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            border: "1px solid gray",
            padding: "0.5rem 1rem",
            backgroundColor: "whitesmoke",
            color: "#333",
          }}
        >
          Login
        </Link>
        
      </div>
    </>
  );
};

export default Landing;