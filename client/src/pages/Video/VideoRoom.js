import { LiveObject } from "@liveblocks/client";
import { useState, useEffect, useRef } from "react";
import {
  useOthers,
  useBroadcastEvent,
  useEventListener,
  useStorage,
  useMutation,
} from "./video_liveblocks.config.js";
import { RoomProvider } from "./video_liveblocks.config.js";
import { ClientSideSuspense, shallow } from "@liveblocks/react";

// import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

import { useLocation } from "react-router-dom";

import io from "socket.io-client";

// const socket = io("http://localhost:3001/");

function VideoRoom() {
  const location = useLocation();
  const roomId = "liveblocks-tutorial-GlIzDpGrbHbuUD_dcDsZEa";
  const link = location.state.link;
  const roomID = location.state.roomID;
  const isYoutube = location.state.isYoutube;
  return (
    <RoomProvider
      id={roomID}
      initialPresence={{
        pause: true,
      }}
      initialStorage={{
        settings: new LiveObject({
          link: "",
          isYoutube: false,
          set: false,
        }),
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => (
          <Video
            link={link}
            isYoutube={location.state.isYoutube}
            roomID={roomID}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

const Video = ({ link, isYoutube, roomID }) => {
  const settings_link = useStorage((root) => `${root.settings.link}`);
  const settings_isYoutube = useStorage((root) => root.settings.isYoutube);
  const settings_set = useStorage((root) => root.settings.set);
  const others = useOthers();

  console.log(settings_isYoutube);
  console.log(settings_link);
  const myMutation = useMutation(({ storage, setMyPresence }) => {
    // Mutate Storage
    storage.get("settings").set("set", true);
    storage.get("settings").set("link", link);
    storage.get("settings").set("isYoutube", isYoutube);
  }, []);

  useEffect(() => {
    console.log(typeof settings_set);
    console.log(settings_set);
    if (settings_set === false) {
      console.log("Before mutation");
      myMutation();
    }
    // socket.on("socket", (msg) => {
    //   console.log("Inside useEffect ", msg);
    // });
    // const response = fetch("http://localhost:3001/", {
    //   headers: { Range: `bytes=0-14454715` },
    // })
    //   .then((response) => {
    //     console.log(response);
    //     return response.blob();
    //   })
    //   .then((blob) => {
    //     console.log(blob);
    //     const videoUrl = URL.createObjectURL(blob);
    //     videoRef.current.src = videoUrl;
    //   })
    //   .catch((error) => console.error("Error fetching video:", error));
  }, []);

  return (
    <div className="App">
      {`Room ID: ${roomID}`}
      <br />
      There are {others.length} other people here!
      <VideoPlayer isYoutube={settings_isYoutube} link={settings_link} />
      {/* <button onClick={() => socket.emit("event", "123")}>Socket</button> */}
    </div>
  );
};

function VideoPlayer({ isYoutube, link }) {
  /**
   * Need to make video look better/stylize (CSS)
   * Figure out ways to get around browser document issue
   * Test the video player more for bugs
   */
  console.log("Link is " + link);
  console.log(typeof link);
  const [currentTime, setCurrentTime] = useState(0);

  const buttonRef = useRef(null);

  const broadcast = useBroadcastEvent();

  const videoRef = useRef(null);

  useEffect(() => {
    console.log("???", isYoutube);
    if (link != "" && !isYoutube) {
      // Only execute if videoRef is available and video is not ready
      // Check if link exists
      videoRef.current.src = `http://localhost:3111/api/video/videoRetrieval/${link}`;
    }
  }, [link]);

  useEventListener(({ connectionId, event }) => {
    switch (event.type) {
      case "pause":
        if (videoRef.current) {
          console.log(videoRef.current);
          videoRef.current.pause();
        }
        break;
      case "play":
        if (videoRef.current) {
          videoRef.current.play();
        }
        break;
      case "seek":
        if (videoRef.current) {
          videoRef.current.currentTime = event.time;
        }
    }
  });

  const handleSeekChange = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    broadcast({ type: "seek", time: newTime });
    console.log(newTime);
    videoRef.current.currentTime = newTime;
  };

  function changeTime() {
    videoRef.current.currentTime = 5;
    buttonRef.current.style.backgroundColor = "blue";
  }
  function handlePlay() {
    broadcast({ type: "play" });
    videoRef.current.play();
    console.log(videoRef.current.currentTime);
    console.log(videoRef.current.duration);
  }
  function handlePause() {
    broadcast({ type: "pause" });
    videoRef.current.pause();
    console.log(videoRef.current.currentTime);
  }
  function handleTimeUpdate() {
    setCurrentTime(videoRef.current.currentTime);
  }
  return (
    <div>
      {isYoutube ? (
        // Video from Youtube
        <div data-vjs-player>
          <video
            id="vid1"
            className="video-js vjs-default-skin"
            autoPlay
            controls
            width="640"
            height="264"
            data-setup='{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "https://www.youtube.com/watch?v=3ptagZOU_Wg"}] }'
          ></video>
        </div>
      ) : (
        // Video retrieved from AWS S3 bucket
        <div style={{ display: "flex", flexDirecion: "column" }}>
          <video
            ref={videoRef}
            width="320"
            height="240"
            onTimeUpdate={handleTimeUpdate}
            // poster={pic}
          >
            <source
              src={`http://localhost:3111/api/video/videoRetrieval/${link}`}
            ></source>
          </video>
          <input
            type="range"
            className="custom-seek-bar"
            min="0"
            max={
              videoRef.current ? parseFloat(videoRef.current.duration) || 0 : 0
            }
            step="0.01"
            value={currentTime}
            onChange={handleSeekChange}
          />
          <button onClick={handlePause}>Pause</button>
          <button onClick={handlePlay}>Play</button>
          <button ref={buttonRef} onClick={() => changeTime(5)}>
            Set Current Time to 5 seconds
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoRoom;
