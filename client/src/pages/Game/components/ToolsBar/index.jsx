import React from "react";
import PencilButton from "./PencilButton";
import RectangleButton from "./RectangleButton";
import EllipseButton from "./EllipseButton";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";
import SelectionButton from "./SelectionButton";
import { CanvasMode, LayerType } from "../../types";
import styles from "./index.module.css";



export default function ToolsBar({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}) {
  return (
    <div className={styles.tools_panel_container}>
      <div className={styles.tools_panel}>
        <div className={styles.tools_panel_section}>
          <SelectionButton
            isActive={
              canvasState.mode === CanvasMode.None ||
              canvasState.mode === CanvasMode.Translating ||
              canvasState.mode === CanvasMode.SelectionNet ||
              canvasState.mode === CanvasMode.Pressing ||
              canvasState.mode === CanvasMode.Resizing
            }
            onClick={() => setCanvasState({ mode: CanvasMode.None })}
          />
          <PencilButton
            isActive={canvasState.mode === CanvasMode.Pencil}
            onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          />
          <RectangleButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Rectangle
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Rectangle,
              })
            }
          />
          <EllipseButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Ellipse
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Ellipse,
              })
            }
          />
        </div>
        <div className={styles.seperator}></div>
        <div className={styles.tools_panel_section}>
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div>
      </div>
    </div>
  );
}
