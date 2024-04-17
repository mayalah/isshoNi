import { LiveObject, LiveList } from "@liveblocks/client";
import { useState, useEffect, useRef } from "react";
import {
  useOthers,
  useBroadcastEvent,
  useEventListener,
  useStorage,
  useMutation,
  useThreads,
} from "./video_liveblocks.config.js";
import { RoomProvider } from "./video_liveblocks.config.js";
import { ClientSideSuspense, shallow } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-comments";

// import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

import { useLocation } from "react-router-dom";

import playSVG from "../../assets/playBtn.svg";
import pauseSVG from "../../assets/pauseBtn.svg";
import copyLinkSVG from "../../assets/copyLink.svg";
import closeSVG from "../../assets/close.svg";

import Loading from "./Loading";

import styles from "./VideoRoom.module.css";

import YouTube from "react-youtube";

import io from "socket.io-client";

// const socket = io("http://localhost:8009/");

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
        chatHistory: new LiveList(),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
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
    // const response = fetch("http://localhost:8009/", {
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
    <div>
      {/* {`Room ID: ${roomID}`} */}
      {/* There are {others.length} other people here! */}
      <VideoPlayer
        isYoutube={settings_isYoutube}
        link={settings_link}
        roomID={roomID}
      />
      {/* <button onClick={() => socket.emit("event", "123")}>Socket</button> */}
    </div>
  );
};

function VideoPlayer({ isYoutube, link, roomID }) {
  /**
   * Need to make video look better/stylize (CSS)
   * Figure out ways to get around browser document issue
   * Test the video player more for bugs
   */

  console.log("Link is " + link);
  console.log(typeof link);

  const { threads } = useThreads();
  const [currentTime, setCurrentTime] = useState(0);
  const [modal, setModal] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");

  const buttonRef = useRef(null);
  const youtubeRef = useRef(null);

  const broadcast = useBroadcastEvent();

  const videoRef = useRef(null);

  useEffect(() => {
    console.log("???", isYoutube);
    if (link != "" && !isYoutube) {
      // Only execute if videoRef is available and video is not ready
      // Check if link exists
      videoRef.current.src = `http://localhost:8009/api/video/videoRetrieval/${link}`;
    } else {
      setYoutubeLink(link.split("v=")[1]);
    }
  }, [link]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (youtubePlayer) {
        const newTime = youtubePlayer.getCurrentTime();
        setCurrentTime(newTime);
      }
    }, 100); // Update every second

    return () => {
      clearInterval(intervalId); // Cleanup the interval on component unmount
    };
  }, [youtubePlayer]);

  // useEffect(() => {
  //   // Initialize YouTube Player API if the video is from YouTube
  //   if (isYoutube && youtubeRef.current) {
  //     const player = new window.YT.Player(youtubeRef.current, {
  //       events: {
  //         onReady: onYoutubeVideoReady,
  //       },
  //     });
  //     setYoutubePlayer(player);
  //   }
  // }, [isYoutube]);

  useEventListener(({ connectionId, event }) => {
    switch (event.type) {
      case "pause":
        if (videoRef.current) {
          console.log(videoRef.current);
          videoRef.current.pause();
        } else {
          youtubePlayer.pauseVideo();
        }
        break;
      case "play":
        if (videoRef.current) {
          videoRef.current.play();
        } else {
          youtubePlayer.playVideo();
        }
        break;
      case "seek":
        if (videoRef.current) {
          videoRef.current.currentTime = event.time;
        } else {
          youtubePlayer.seekTo(event.time);
        }
    }
  });

  const handleSeekChange = (event) => {
    if (isYoutube) {
      const newTime = parseFloat(event.target.value);
      setCurrentTime(newTime);
      broadcast({ type: "seek", time: newTime });
      console.log(newTime);
      youtubePlayer.seekTo(newTime);
    } else {
      const newTime = parseFloat(event.target.value);
      setCurrentTime(newTime);
      broadcast({ type: "seek", time: newTime });
      console.log(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  function changeTime() {
    videoRef.current.currentTime = 5;
    buttonRef.current.style.backgroundColor = "blue";
  }
  function handlePlay() {
    broadcast({ type: "play" });
    if (isYoutube) {
      if (youtubePlayer) {
        youtubePlayer.playVideo(); // Play the video
        console.log(youtubePlayer.getCurrentTime());
        console.log(youtubePlayer.getDuration());
      }
    } else {
      videoRef.current.play();
      console.log(videoRef.current.currentTime);
      console.log(videoRef.current.duration);
    }
  }
  function handlePause() {
    broadcast({ type: "pause" });
    if (isYoutube) {
      youtubePlayer.pauseVideo();
    } else {
      videoRef.current.pause();
      console.log(videoRef.current.currentTime);
    }
  }
  function handleTimeUpdate() {
    setCurrentTime(videoRef.current.currentTime);
  }
  function onModalClick() {
    setModal(true);
  }
  function onYoutubeVideoReady(event) {
    const player = event.target;
    // Hide the controls
    player.setOption({
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        fs: 0,
        disablekb: 1,
      },
    });
    setYoutubePlayer(player);
    youtubeRef.current = player;
  }

  const opts = {
    height: "500",
    width: "900",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      controls: 0,
    },
  };

  return (
    <div className={styles.container}>
      {modal ? <CopyLinkModal roomID={roomID} setModal={setModal} /> : null}
      <section className={styles.video_cnt}>
        {isYoutube ? (
          //    Video from Youtube
          // <iframe
          //   width="560"
          //   height="315"
          //   src="https://www.youtube.com/embed/3ptagZOU_Wg"
          //   frameborder="0"
          //   allowfullscreen
          //   control={false}
          // ></iframe>
          <YouTube
            className={styles.youtubePlayer}
            videoId={`${youtubeLink}`}
            onReady={onYoutubeVideoReady}
            opts={opts}
          />
        ) : (
          // Video retrieved from AWS S3 bucket
          <video
            ref={videoRef}
            // width="320"
            // height="240"
            onTimeUpdate={handleTimeUpdate}
            // poster={pic}
          >
            <source
              src={`http://localhost:8009/api/video/videoRetrieval/${link}`}
            ></source>
          </video>
        )}
      </section>
      <section className={styles.right_cnt}>
        <div className={styles.comments_cnt}>
          <div className={styles.copy_link_cnt} onClick={onModalClick}>
            <img src={copyLinkSVG} />
          </div>
          <div>
            {/* {threads.map((thread) => (
              <Thread key={thread.id} thread={thread} className="thread" />
            ))}
            <Composer className="composer" /> */}
          </div>
        </div>
        <div className={styles.video_controls_cnt}>
          <div className={styles.seek_bar_cnt}>
            <input
              type="range"
              className="custom-seek-bar"
              min="0"
              max={
                isYoutube && youtubePlayer
                  ? parseFloat(youtubePlayer.getDuration()) || 0
                  : videoRef.current
                  ? parseFloat(videoRef.current.duration) || 0
                  : 0
              }
              step="0.01"
              value={currentTime}
              onChange={handleSeekChange}
            />
          </div>
          <div className={styles.controls_cnt}>
            <div onClick={handlePlay}>
              <img src={playSVG} />
            </div>
            <div onClick={handlePause}>
              <img src={pauseSVG} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CopyLinkModal({ roomID, setModal }) {
  function onModalCloseClick() {
    setModal(false);
  }
  return (
    <div className={styles.modal_cnt}>
      <div className={styles.modal_close_cnt} onClick={onModalCloseClick}>
        <div className={styles.modal_close_hover}>
          <img src={closeSVG} />
        </div>
      </div>
      <div className={styles.modal_content_cnt}>
        <h1>This is the room ID</h1>
        <h2>Invite your friends</h2>
        <div className={styles.roomID_cnt}>
          <h3>{roomID}</h3>
        </div>
      </div>
    </div>
  );
}

export default VideoRoom;
