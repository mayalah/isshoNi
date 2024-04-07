import './App.css';// import Login from "./pages/Login";
import Landing from "./pages/Landing";
import MainMenu from "../src/pages/Menu/MainMenu";
import Chat from "../src/pages/Chat/Chat";
import LinkRoom from "./pages/LinkRoom/LinkRoom";
import SignInGoogle from "./pages/LinkRoom/SignInPage";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="menu" element={<MainMenu />} />
        <Route path="chat" element={<Chat />} />
        <Route path="link" element={<LinkRoom />} />
        <Route path="signinwithGG" element={<SignInGoogle />} />
      </Routes>
    </BrowserRouter>
  );  
};

export default App;

