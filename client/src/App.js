import "./App.css"; // import Login from "./pages/Login";
import Landing from "./pages/Landing";
import MainMenu from "../src/pages/Menu/MainMenu";
import Chat from "../src/pages/Chat/Chat";
import LinkRoom from "./pages/LinkRoom/LinkRoom";
import SignInGoogle from "./pages/LinkRoom/SignInPage";
import VideoSelectRoom from "./pages/Video/VideoSelectRoom";
import VideoRoom from "./pages/Video/VideoRoom";
import WorkInProgress from "./pages/Progress/Progress";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import GameRoom from "./pages/Game/components/GameRoom";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Footer from "./pages/Footer/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="menu" element={<MainMenu />} />
        <Route path="chat" element={<Chat />} />
        <Route path="link" element={<LinkRoom />} />
        <Route path="signinwithGG" element={<SignInGoogle />} />
        <Route path="gameRoom" element={<GameRoom />} />
        <Route path="videoselect" element={<VideoSelectRoom />} />
        <Route path="video_room" element={<VideoRoom />} />
        <Route path="work_in_progress" element={<WorkInProgress />} />
        <Route path="resetpassword" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
