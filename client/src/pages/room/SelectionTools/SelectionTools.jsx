import styles from "./SelectionTools.module.css";
import { useMutation } from "../liveblocks.config";

export default function SelectionTools({ position, id, shape, setColor }) {
  const { x, y } = position;

  const colorPicker = useMutation(
    ({ storage, setMyPresence }, id, shape, newColor) => {
      const map = storage.get(shape);
      setMyPresence({
        currentColor: newColor,
      });
      if (map) {
        map.set(id, {
          color: newColor,
          x: map.get(id).x,
          y: map.get(id).y,
        });
      }
    },
    [id, shape]
  );

  return (
    <div
      className={styles.container}
      style={{
        top: `${y - 100}px`,
        left: `${x - 20}px`,
        //transform: `translate(calc(${x}px - 100%), calc(${y - 16}px - 100%))`,
      }}
      onPointerUp={(e) => e.stopPropagation()}
    >
      <div className={styles.color_chooser}>
        <div
          className={styles.color_element}
          style={{ backgroundColor: "red" }}
          onClick={() => {
            colorPicker(id, shape, "red");
            setColor("red");
          }}
        />
        <div
          className={styles.color_element}
          style={{ backgroundColor: "orange" }}
          onClick={() => {
            colorPicker(id, shape, "orange");
            setColor("orange");
          }}
        />
        <div
          className={styles.color_element}
          style={{ backgroundColor: "green" }}
          onClick={() => {
            colorPicker(id, shape, "green");
            setColor("green");
          }}
        />
        <div
          className={styles.color_element}
          style={{ backgroundColor: "blue" }}
          onClick={() => {
            colorPicker(id, shape, "blue");
            setColor("blue");
          }}
        />
        <div
          className={styles.color_element}
          style={{ backgroundColor: "purple" }}
          onClick={() => {
            colorPicker(id, shape, "purple");
            setColor("purple");
          }}
        />
        <div
          className={styles.color_element}
          style={{ backgroundColor: "violet" }}
          onClick={() => {
            colorPicker(id, shape, "violet");
            setColor("violet");
          }}
        />
        <div
          className={styles.color_element}
          style={{ backgroundColor: "white" }}
          onClick={() => {
            colorPicker(id, shape, "white");
            setColor("white");
          }}
        />
        <div
          className={styles.color_element}
          style={{ backgroundColor: "black" }}
          onClick={() => {
            colorPicker(id, shape, "black");
            setColor("black");
          }}
        />
      </div>
      <div className={styles.move_cnt}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 6.5L12 2L15 6.5H12.75V9.71429L19.976 11.7789C20.7013 11.9861 20.7013 13.0139 19.976 13.2211L12.8242 15.2645C12.2855 15.4184 11.7145 15.4184 11.1758 15.2645L4.024 13.2211C3.29872 13.0139 3.29872 11.9861 4.024 11.7789L11.25 9.71429V6.5H9ZM6.7493 15.5L4.02345 16.2788C3.29817 16.486 3.29817 17.5139 4.02345 17.7211L11.1753 19.7645C11.714 19.9184 12.285 19.9184 12.8236 19.7645L19.9755 17.7211C20.7007 17.5139 20.7007 16.486 19.9755 16.2788L17.2493 15.4999L12.8233 16.7645C12.2847 16.9184 11.7137 16.9184 11.175 16.7645L6.7493 15.5Z"
            fill="currentColor"
          />
        </svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.1758 4.23547L4.024 6.27885C3.29872 6.48607 3.29872 7.51391 4.024 7.72114L11.1758 9.76452C11.7145 9.91842 12.2855 9.91842 12.8242 9.76452L19.976 7.72114C20.7013 7.51391 20.7013 6.48607 19.976 6.27885L12.8242 4.23547C12.2855 4.08156 11.7145 4.08156 11.1758 4.23547ZM4.02345 10.7788L6.7493 10L11.9992 11.5L17.2493 9.99992L19.9755 10.7788C20.7007 10.986 20.7007 12.0139 19.9755 12.2211L12.8236 14.2645C12.7991 14.2715 12.7746 14.2782 12.75 14.2845V17.5H15L12 22L9 17.5H11.25V14.2848C11.225 14.2783 11.2001 14.2716 11.1753 14.2645L4.02345 12.2211C3.29817 12.0139 3.29817 10.986 4.02345 10.7788Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div></div>
    </div>
  );
}
