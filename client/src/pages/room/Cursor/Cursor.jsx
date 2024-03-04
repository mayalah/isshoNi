import styles from "./Cursor.module.css";

export function Cursor({ x, y, color, name }) {
  return (
    <div
      className={styles.cursor}
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <div className={styles.wrapper}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={color}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m13.67 6.03-11-4a.5.5 0 0 0-.64.64l4 11a.5.5 0 0 0 .935.015l1.92-4.8 4.8-1.92a.5.5 0 0 0 0-.935h-.015Z"
            fill="var(--preview-background-inverse)"
          />
        </svg>
        <div className={styles.name_box} style={{ backgroundColor: color }}>
          {name}
        </div>
      </div>
    </div>
  );
}
