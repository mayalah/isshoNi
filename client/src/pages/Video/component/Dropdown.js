import { useRef, useState, useEffect } from "react";
import createRoomSVG from "../../../assets/create-room.svg";

import styles from "./../VideoSelectRoom.module.css";

const DropDown = ({ setSelectInput, onClickCreateRoomBtn }) => {
  const [dropdownState, setDropdownState] = useState({ open: false });

  const handleDropdownClick = () =>
    setDropdownState({ open: !dropdownState.open });
  const arr = ["options 1", "options 6", "options 5", "options 4"];
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
          placeholder="select video!"
          onChange={(e) => setSelectInput(e.target.value)}
          onClick={(e) => {
            updateDropdownPosition();
            handleDropdownClick();
          }}
        />
        <div
          className={styles.create_submit_cnt}
          onClick={onClickCreateRoomBtn}
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
              <li id={index} className={styles.dropdown_box_item}>
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
