import {
  useMyPresence,
  useOthers,
  useBroadcastEvent,
  useEventListener,
  useOthersMapped,
} from "./liveblocks.config";
import { Cursor } from "./Cursor/Cursor";
import { Suspense } from "react";

const COLORS = ["red", "blue", "gold", "aquamarine", "purple"];

export default function RoomTest() {
  const [myPresence, updateMyPresence] = useMyPresence();
  const broadcast = useBroadcastEvent();

  const others = useOthers();

  // Get list of other users
  // const others = useOthers();
  function handlePointerMove(e) {
    const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
    updateMyPresence({ cursor });
  }

  function handlePointerLeave(e) {
    updateMyPresence({ cursor: null });
  }
  useEventListener(({ event }) => {
    if (event.b === "shout") {
      alert(event.name);
    }
  });

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Cursor: {JSON.stringify(myPresence.cursor)} */}
      {myPresence.cursor
        ? `x: ${myPresence.cursor.x} y: ${myPresence.cursor.y}`
        : "Move your mouse to the whiteboard!"}
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence }) => (
          <Cursor
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
            color={COLORS[connectionId % COLORS.length]}
            name={presence.name}
          />
        ))}
      <button onClick={() => broadcast({ name: "Tommy", b: "shout" })}>
        Click Me!
      </button>
    </div>
  );
}
