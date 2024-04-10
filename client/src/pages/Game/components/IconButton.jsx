import styles from "./IconButton.module.css";



export default function IconButton(
  { onClick, children, isActive, disabled }
) {
  return (
    <button
      className={`${styles.button} ${isActive ? styles.button_active : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
