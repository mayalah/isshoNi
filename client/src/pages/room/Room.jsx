import { RoomProvider } from "./liveblocks.config.js";
import { ClientSideSuspense } from "@liveblocks/react";
import Canvas from "./Canvas.jsx";
import { LiveMap } from "@liveblocks/client";

export default function Room() {
  const roomId = "liveblocks-tutorial-GlIzDpGrbHbuUD_dcDsZE";
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: { x: null, y: null },
        name: "Ethan",
        currentShapeId: null,
        currentShape: null,
        currentShapePosition: null,
        currentColor: null,
        pencilDraft: null,
      }}
      initialStorage={{
        square: new LiveMap(),
        circle: new LiveMap(),
        drawings: new LiveMap(),
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => <Canvas />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
