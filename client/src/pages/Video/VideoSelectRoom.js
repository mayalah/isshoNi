//import VideoRoom from "./VideoRoom.js";
import { useState, useRef, useEffect } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import joinRoomSVG from "../../assets/join-room.svg";
import linkCharacterSVG from "../../assets/linkCharacter.svg";
import blueSubmitSVG from "../../assets/blueSubmit.svg";
import DropDown from "./component/Dropdown";

import { addRoomID } from "../../utils/APIRoutes";
import { Link } from "react-router-dom";
import goBack from "../../assets/goBack.svg";

import styles from "./VideoSelectRoom.module.css";

export default function VideoSelectRoom() {
  const [selectInput, setSelectInput] = useState("");
  const [selectExist, setSelectExist] = useState("");
  const [noRoomExist, setNoRoomExist] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [videoArr, setVideoArr] = useState([]);

  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8009/api/video/getVideos`)
      .then((res) => {
        console.log(res.data);
        setVideoArr(res.data);
      })
      .catch((err) => {
        console.error(err);
        console.log("Use effect catch statement");
      });
  }, []);

  function onClickCreateRoomBtn() {
    if (selectInput === "" || selectInput.length < 1) {
      return;
    }
    const uid = "video-" + Date.now() + `-${selectInput}`;
    let isYoutube = false;
    if (selectInput.includes("youtube.com")) {
      isYoutube = true;
    }
    console.log("Clicked on create room");
    console.log("Select Input, ", selectInput);
    fetch(`http://localhost:8009/api/video/addRoomID`, {
      method: "POST",
      body: uid,
    })
      .then(() => {
        console.log(uid);
        navigate("/video_room", {
          state: { link: selectInput, roomID: uid, isYoutube: isYoutube },
        });
      })
      .catch(console.error);
  }

  function onClickJoinRoomBtn() {
    if (selectExist.includes("youtube.com")) {
      const parts = selectExist.split("-");
      const numberPart = parts[1];
      const ytVideoIDParts = selectExist.split("v=");
      const ytVideoID = ytVideoIDParts[1];
      // fetch(
      //   `http://localhost:8009/api/video/checkIfYTRoomExist/${numberPart}/${ytVideoID}`,
      //   {
      //     method: "GET",
      //   }
      // )
      axios
        .get(
          `http://localhost:8009/api/video/checkIfYTRoomExist/${numberPart}/${ytVideoID}`
        )
        .then((res) => {
          console.log(res.data.result);
          if (res.data.result > 0) {
            navigate("/video_room", {
              state: { link: "", roomID: selectExist, isYoutube: false },
            });
          } else {
            setNoRoomExist("No such room exists!");
            console.log("No such room exists here!");
          }
        })
        .catch(console.error);
    } else {
      // Non youtube link
      axios
        .get(`http://localhost:8009/api/video/checkIfRoomExist/${selectExist}`)
        .then((res) => {
          console.log(res.data.result);
          if (res.data.result > 0) {
            navigate("/video_room", {
              state: { link: "", roomID: selectExist, isYoutube: false },
            });
          } else {
            setNoRoomExist("No such room exists!");
            console.log("No such room exists here!");
          }
        })
        .catch(console.error);
    }
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
    setUploadMessage("Uploading...");
    const formData = new FormData();
    console.log(file);
    formData.append("video", file);
    for (const entry of formData.entries()) {
      console.log(entry);
    }
    console.log(formData);

    fetch(`http://localhost:8009/api/video/uploadVideo/${fileName}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data !== null && data.data === "success") {
          setUploadMessage("Upload Successful!");
        }
      })
      .catch((error) => {
        setUploadMessage("Upload Failed! Try Again.");
        console.error("Error:", error);
      });
  }

  function onClickBrowseComputer() {
    fileRef.current.click();
  }
  const [dropdownState, setDropdownState] = useState({ open: false });
  const handleDropdownClick = () => {
    if (dropdownState.open) {
      setDropdownState({ open: false });
    }
  };
  console.log(selectInput);
  return (
    <div className={styles.container} onClick={handleDropdownClick}>
      <nav className="back-button">
        <Link to="/menu">
          <img src={goBack} alt="Go Back" height={"50px"} />
        </Link>
      </nav>
      {/* Creating a room */}
      <section className={styles.create_video_cnt}>
        <h1>Create a Video Room!</h1>
        <DropDown
          videoNames={videoArr}
          selectInput={selectInput}
          setSelectInput={setSelectInput} //
          dropdownState={dropdownState} //
          setDropdownState={setDropdownState} //
          onClickCreateRoomBtn={onClickCreateRoomBtn} //
        />
        <div className={styles.youtube_cnt}>
          <input
            className={styles.youtube_input}
            placeholder="Or Input YouTube Link!"
            onChange={(e) => setSelectInput(e.target.value)}
          />
          <div
            className={styles.create_submit_cnt}
            onClick={onClickCreateRoomBtn}
          >
            <img className={styles.svg_img} src={joinRoomSVG} />
          </div>
        </div>
      </section>
      {/* Joining a room */}
      <section className={styles.join_videoroom_cnt}>
        <h2>Joining a Room?</h2>
        <div className={styles.no_room_error}>{noRoomExist}</div>
        <div className={styles.join_inputbox}>
          <input
            placeholder="insert URL"
            onChange={(e) => setSelectExist(e.target.value)}
          />
          <div className={styles.join_submit_cnt} onClick={onClickJoinRoomBtn}>
            <img className={styles.svg_img} src={joinRoomSVG} />
          </div>
        </div>
        <img src={linkCharacterSVG} className={styles.link_character} />
      </section>
      {/* Upload video */}
      <section className={styles.upload_video_cnt}>
        <h2>Upload Video!</h2>
        <div className={styles.video_upload_message}>{uploadMessage}</div>
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
              <img className={styles.svg_img} src={blueSubmitSVG} />
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
