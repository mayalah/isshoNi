import { useRef, useState, useEffect } from "react";
import createRoomSVG from "../../../assets/create-room.svg";

import styles from "./../VideoSelectRoom.module.css";

const calculateSimilarityScore = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));
  for (let i = 0; i <= len1; i++) {
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // deletion
            dp[i][j - 1], // insertion
            dp[i - 1][j - 1] // substitution
          );
      }
    }
  }
  return dp[len1][len2];
};

const sortArrayBySimilarity = (arr, value) => {
  return arr.slice().sort((a, b) => {
    const similarityA = calculateSimilarityScore(a, value);
    const similarityB = calculateSimilarityScore(b, value);
    return similarityA - similarityB;
  });
};

const DropDown = ({
  videoNames,
  setSelectInput,
  onClickCreateRoomBtn,
  dropdownState,
  setDropdownState,
}) => {
  const [indx, setSelectedIndx] = useState();
  const arr_input = ["options 1", "hi 6", "whoop 5", "options 4"];

  const [arr, setArr] = useState([]);
  useEffect(() => {
    setArr(videoNames);
  }, [videoNames]);

  const handleDropdownInputClick = (e) => {
    e.stopPropagation();
    if (dropdownState.open === false) {
      setDropdownState({ open: true });
    }
  };

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const updateDropdownPosition = () => {
    const element = ref.current;
    if (element) {
      const top = element.getBoundingClientRect().bottom;
      const left = element.getBoundingClientRect().left;
      setDropdownPosition({ top, left });
    }
  };
  const ref = useRef();
  useEffect(() => {
    window.addEventListener("scroll", updateDropdownPosition);
    window.addEventListener("resize", updateDropdownPosition);

    return () => {
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, []);

  return (
    <div>
      <div className={styles.create_inputbox} ref={ref}>
        <input
          className="inputbox"
          placeholder={indx + 1 ? arr[indx] : "Select video!"}
          onChange={(e) => {
            const inputValue = e.target.value;
            //setSelectInput(inputValue);
            const sortedArr = sortArrayBySimilarity([...arr], inputValue);
            setSelectedIndx(null);
            setArr(sortedArr);
          }}
          onClick={(e) => {
            updateDropdownPosition();
            handleDropdownInputClick(e);
          }}
        />
        <div
          className={styles.create_submit_cnt}
          onClick={(e) => {
            onClickCreateRoomBtn();
          }}
        >
          <img className={styles.svg_img} src={createRoomSVG} />
        </div>
      </div>
      {dropdownState.open && (
        <div
          className={
            dropdownState.open
              ? styles.dropdown_box
              : styles.dropdown_box_not_open
          }
          style={{
            top: dropdownPosition.top + 10,
            left: dropdownPosition.left,
          }}
        >
          {arr.map((item, index) => {
            return (
              <li
                id={index}
                className={styles.dropdown_box_item}
                style={index === indx ? { backgroundColor: "#7ac3ff" } : {}}
                onClick={(e) => {
                  switch (e.detail) {
                    case 1: {
                      setSelectedIndx(index);
                      break;
                    }
                    case 2: {
                      setSelectedIndx(null);
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                  setSelectInput(item);
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
                {item}
              </li>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDown;
