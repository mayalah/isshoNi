import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
console.log(process.env);
const client = createClient({
  publicApiKey: "",
  // authEndpoint: "/api/auth",
  throttle: 16,
});

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
  },
} = createRoomContext(client);
