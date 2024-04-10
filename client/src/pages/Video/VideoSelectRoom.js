//import VideoRoom from "./VideoRoom.js";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function VideoSelectRoom() {
  const [selectInput, setSelectInput] = useState("");
  const [selectExist, setSelectExist] = useState("");

  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const navigate = useNavigate();

  function onClickCreateRoomBtn() {
    const uid = "video-" + Date.now() + `-${selectInput}`;
    let isYoutube = false;
    if (selectInput.includes("youtube.com")) {
      isYoutube = true;
    }
    console.log(uid);
    navigate("/video_room", {
      state: { link: selectInput, roomID: uid, isYoutube: isYoutube },
    });
  }

  function onClickJoinRoomBtn() {
    navigate("/video_room", {
      state: { link: "", roomID: selectExist, isYoutube: false },
    });
  }

  function onFileChange(event) {
    setFile(event.target.files[0]);
  }

  function onUploadClick(event) {
    event.preventDefault();
    if (!file) {
      console.error("No file");
      return;
    }
    const formData = new FormData();
    console.log(file);
    formData.append("video", file);
    for (const entry of formData.entries()) {
      console.log(entry);
    }
    console.log(formData);

    fetch(`http://localhost:3111/api/video/uploadVideo/${fileName}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <div>
      <div>
        {/* Input youtube video link or AWS S3 link */}
        <label>Make Video Room</label>
        <input onChange={(e) => setSelectInput(e.target.value)} />
        <button onClick={onClickCreateRoomBtn}>Select</button>
      </div>
      <div>
        {/* Input existing room ID */}
        <label>Go into existing video room</label>
        <input onChange={(e) => setSelectExist(e.target.value)} />
        <button onClick={onClickJoinRoomBtn}>Go!</button>
      </div>
      {/* Upload */}
      <form>
        <label>Pick a video</label>
        <input
          type="file"
          accept="video/quicktime, video/mp4"
          onChange={(event) => onFileChange(event)}
        />
        <input onChange={(e) => setFileName(e.target.value)} />
        <button type="submit" onClick={(event) => onUploadClick(event)}>
          Submit
        </button>
      </form>
    </div>
  );
}
