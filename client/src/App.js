import './App.css';// import Login from "./pages/Login";
import Landing from "./pages/Landing";
import MainMenu from "../src/pages/Menu/MainMenu";
import Chat from "../src/pages/Chat/Chat";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="menu" element={<MainMenu />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );  
};

export default App;

