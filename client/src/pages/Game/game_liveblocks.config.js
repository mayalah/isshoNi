
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import axios from "axios";
import {liveblocksAuthRoute, resolveUsersRoute} from "../../utils/APIRoutes";
// import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
// import { Point, Color, Layer } from "@/app/types";


const client = createClient({
    // publicApiKey: "pk_dev_NuJ1AsSi7ZMuhid7MEn26xi9KnCjDz958niahaMbptRIMl2JmNLujZBDB1xeZ6Uo",
  throttle: 16,
  // authEndpoint: "/api/liveblocks-auth",

  authEndpoint: async () => {

    const userEmail = localStorage.getItem("userEmail");

    const response = await axios.post(liveblocksAuthRoute, { userEmail: userEmail });

    return await response.data;
  },

// //   // Get users' info from their ID
  resolveUsers: async ({ userIds }) => {
    const params = new URLSearchParams();
    userIds.forEach((userId) => {
      params.append('userIds', userId);
    });

    const response = await axios.post(`http://localhost:3111/api/liveblocks/resolveUsers?${params.toString()}`);


    const users = await response.data;
    console.log("users from config", users);
    return users;
  },
});

// type Presence = {
//   selection: string[];
//   cursor: Point | null;
//   pencilDraft: [x: number, y: number, pressure: number][] | null;
//   penColor: Color | null;
// };
// type Player={
//   name: string;
//   words: string[];
// }
// type Storage = {
//   layers: LiveMap<string, LiveObject<Layer>>;
//   layerIds: LiveList<string>;


// };

// type UserMeta = {
//   id: string;
//   info: {
//     name: string;
//     avatar: string;
//   };
// };

export const {
  suspense: { RoomProvider, 
    useOthersListener,
    useThreads,
    useCanRedo,
    useCanUndo,
    useHistory,
    useMutation,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useRoom,
    useSelf,
    useStorage,
    useUpdateMyPresence,
    useBroadcastEvent,
    useEventListener,
    useEditComment,
    },
// } = createRoomContext<Presence, Storage /* UserMeta, RoomEvent */>(client);
} = createRoomContext(client);



