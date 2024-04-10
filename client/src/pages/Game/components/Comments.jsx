

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


import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";


// import { Layer } from "@/app/types";

export default function Comments() {

    const location = useLocation();
  const roomId = location.state.roomId;
  console.log("room id", roomId);

  return (
    <div className="w-screen h-screen">
      <div className ="">
        <h1 className=" text-white text-4xl"> Isshoni</h1>
      </div>

  
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


