//import VideoRoom from "./VideoRoom.js";
import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import joinRoomSVG from "../../assets/join-room.svg";
import createRoomSVG from "../../assets/create-room.svg";
import linkCharacterSVG from "../../assets/linkCharacter.svg";
import blueSubmitSVG from "../../assets/blueSubmit.svg";

import styles from "./VideoSelectRoom.module.css";

export default function VideoSelectRoom() {
  const [selectInput, setSelectInput] = useState("");
  const [selectExist, setSelectExist] = useState("");

  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const fileRef = useRef(null);

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
    if (event.target.files[0] === undefined) return;
    setFile(event.target.files[0]);
  }

  function onUploadClick(event) {
    event.preventDefault();
    if (!file) {
      console.error("No file");
      return;
    }
    if (fileName == "") {
      console.error("Input video name");
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

  function onClickBrowseComputer() {
    fileRef.current.click();
  }
  console.log(file);
  return (
    <div className={styles.container}>
      {/* Creating a room */}
      <section className={styles.create_video_cnt}>
        <h1>Create a Video Room!</h1>
        <div className={styles.create_inputbox}>
          <input
            placeholder="select video!"
            onChange={(e) => setSelectInput(e.target.value)}
          />
          <div
            className={styles.create_submit_cnt}
            onClick={onClickCreateRoomBtn}
          >
            <img src={createRoomSVG} />
          </div>
        </div>
      </section>
      {/* Joining a room */}
      <section className={styles.join_videoroom_cnt}>
        <h2>Joining a Room?</h2>
        <div className={styles.join_inputbox}>
          <input
            placeholder="insert URL"
            onChange={(e) => setSelectExist(e.target.value)}
          />
          <div className={styles.join_submit_cnt} onClick={onClickJoinRoomBtn}>
            <img src={joinRoomSVG} />
          </div>
        </div>
        <img src={linkCharacterSVG} className={styles.link_character} />
      </section>
      {/* Upload video */}
      <section className={styles.upload_video_cnt}>
        <h2>Upload Video!</h2>
        <form className={styles.video_form}>
          <input
            className={styles.file_input}
            ref={fileRef}
            type="file"
            accept="video/quicktime, video/mp4"
            onChange={(event) => onFileChange(event)}
          />

          <div
            className={
              file === "" ? styles.video_upload : styles.video_upload_selected
            }
            onClick={onClickBrowseComputer}
          >
            {file === ""
              ? "Browse Computer to Upload Video!"
              : `Upload ${file["name"]}!`}
          </div>

          <div className={styles.join_inputbox}>
            <input
              className={styles.video_name_input}
              type="text"
              onChange={(e) => setFileName(e.target.value)}
              placeholder="rename and click enter"
            />
            <div className={styles.join_submit_cnt} onClick={onUploadClick}>
              <img src={blueSubmitSVG} />
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
