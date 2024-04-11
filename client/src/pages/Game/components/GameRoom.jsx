

// import { useSearchParams } from "next/navigation";
import {
  RoomProvider,
  useThreads,
  useSelf,
  useOthers,
} from "../game_liveblocks.config";
import { Loading } from "./Loading";
import { Composer, Thread, Comment } from "@liveblocks/react-comments";
import { ClientSideSuspense } from "@liveblocks/react";
import { ErrorBoundary } from "react-error-boundary";
import { useState, useEffect } from "react";
import ThreadContainer from "./Thread";
import {useLocation} from "react-router-dom";
import Canvas from "./Canvas";
import { Link } from "react-router-dom";
import goBack from "../../../assets/goBack.svg";
import "./GameRoom.module.css";


import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";


// import { Layer } from "@/app/types";

export default function GameRoom() {
  const [activeButton, setActiveButton] = useState("me");
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };


    const location = useLocation();
  const roomId = location.state.roomId;
  console.log("room id", roomId);

  return (
    
    <div className="w-screen h-screen">
      <div className ="fixed top-[45px] left-[298px] ">
      {/* <div className =" flex flex-row justify-start items-center"> */}
        <h1 className=" text-white text-[60px]"> Isshoni.io</h1>
      </div>
      <nav className="absolute top-[20px] left-[30px]">
        <Link to="/menu">
          <img
            src={goBack}
            alt="Go Back"
            height={"40px"}
            onClick={() => handleButtonClick("goBack")}
          />
        </Link>
      </nav>
  
      <RoomProvider id={roomId} 
      initialPresence={{
          selection: [],
          cursor: null,
          pencilDraft: null,
          penColor: null,
        }}
        initialStorage={{
          layers: new LiveMap(),
          layerIds: new LiveList(),
        }}
      >
      <ErrorBoundary
        fallback={
          <div className="error">There was an error while getting threads.</div>
        }
      >
        <ClientSideSuspense fallback={<Loading />}>
          {() => <Canvas/>}
        </ClientSideSuspense>
      </ErrorBoundary>
    </RoomProvider>
    </div>
  );
}


