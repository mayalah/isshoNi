import "./App.css";
import Homepage from "./components/Homepage";
import Description from "./components/Description";
import Topbar from "./components/Topbar";

import { useState, useEffect, useRef } from "react";

function App() {
  const [scrollStyle, setScrollStyle] = useState("First-Page");
  useEffect(() => {
    function handleScroll(event) {
      if (
        window.scrollY >= window.screen.height / 2 &&
        window.scrollY < window.screen.height * 1.5 &&
        scrollStyle !== "GreenBackground"
      ) {
        setScrollStyle("GreenBackground");
      } else if (
        window.scrollY < window.screen.height / 2 &&
        scrollStyle !== "First-Page"
      ) {
        setScrollStyle("First-Page");
      } else if (
        window.scrollY >= window.screen.height * 1.5 &&
        scrollStyle !== "PinkBackground"
      ) {
        setScrollStyle("PinkBackground");
      }
    }
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrollStyle]);
  return (
    <div className={`App ${scrollStyle}`}>
      <Topbar />
      <Homepage />
      <Description scrollStyle={scrollStyle} />
    </div>
  );
}

export default App;
