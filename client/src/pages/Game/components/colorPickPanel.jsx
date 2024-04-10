import { Color } from "../types";
import { colorToCss } from "../utils";
import styles from "./ColorPickerPanel.module.css";


export default function ColorPickPanel({ onChange }) {
  return (
    <div className=" absolute top-[16px] left-[36px] flex flex-row gap-x-1 w-[313px] h-[66px] border-[#AC4F98] border-sm rounded-[40px] ">
      <ColorButton color={{ r: 243, g: 82, b: 35 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 198, b: 38 }} onClick={onChange} />
      <ColorButton color={{ r: 68, g: 202, b: 99 }} onClick={onChange} />
      <ColorButton color={{ r: 39, g: 142, b: 237 }} onClick={onChange} />
      <ColorButton color={{ r: 155, g: 105, b: 245 }} onClick={onChange} />
      <ColorButton color={{ r: 252, g: 142, b: 42 }} onClick={onChange} />
      <ColorButton color={{ r: 82, g: 82, b: 82 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />
    </div>
  );
}

function ColorButton({
  onClick,
  color,
}) {
  return (
    <button
      //   className={styles.color_swatch_button}
      onClick={() => onClick(color)}
    >
      <div
        className={styles.color_swatch}
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
}
