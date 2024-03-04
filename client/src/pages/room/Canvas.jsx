import "./Canvas.css";
import {
  useMutation,
  useStorage,
  useUpdateMyPresence,
  useHistory,
  useSelf,
  useOthers,
} from "./liveblocks.config";
import { useState } from "react";
import { ClientSideSuspense, shallow } from "@liveblocks/react";
import SelectionTools from "./SelectionTools/SelectionTools";
import { Cursor } from "./Cursor/Cursor";
import DrawComponent from "./DrawComponent";
import { LiveObject } from "@liveblocks/client";
import { Path } from "./DrawComponent";
const COLORS = ["blue", "red", "orange", "aquamarine", "green"];

/*
Several modes for pointer:
CURSOR_MODE
PENCIL_MODE
SELECTION_MODE
*/

export default function Canvas() {
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState("CURSOR_MODE");
  const [color, setColor] = useState("black");
  const [boundingBox, setBoundingBox] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const others = useOthers();
  const me = useSelf();
  const updateMyPresence = useUpdateMyPresence();
  const rectKeys = useStorage(
    (root) => Array.from(root.square.keys()),
    shallow
  );
  const circleKeys = useStorage(
    (root) => Array.from(root.circle.keys()),
    shallow
  );

  const drawingKeys = useStorage(
    (root) => Array.from(root.drawings.keys()),
    shallow
  );

  const history = useHistory();

  const insertShape = useMutation(
    ({ storage, setMyPresence }, thisShape) => {
      if (mode === "PENCIL_MODE") {
        return;
      }
      const shapeId = Date.now().toString();
      const xPos = Math.floor(Math.random() * 250);
      const yPos = Math.floor(Math.random() * 250);
      const color = COLORS[Math.floor(Math.random() * 5)];
      const curShape = thisShape === "circle" ? "circle" : "square";
      const shape = { x: xPos, y: yPos, color: color };
      storage.get(curShape).set(shapeId, shape);
      setColor(color);
      setMyPresence(
        {
          currentShapeId: null,
          currentShape: curShape,
          currentShapePosition: { x: xPos, y: yPos },
          currentColor: color,
        },
        { addToHistory: true }
      );
    },
    [mode]
  );

  const deleteSquare = useMutation(({ storage, self }) => {
    if (mode === "PENCIL_MODE") {
      return;
    }
    const shapeId = self.presence.currentShapeId;
    const curShape = self.presence.currentShape;

    if (!shapeId) {
      return;
    }

    storage.get(curShape).delete(self.presence.currentShapeId);
    updateMyPresence({ currentShapeId: null }, { currentShape: null });
  }, []);

  const onCanvasPointerDown = useMutation(
    ({}, mouseEvent) => {
      if (mode === "PENCIL_MODE") {
        const point = pointerEventToCanvasPoint(mouseEvent, camera);
        startDrawing(point, mouseEvent.pressure);
      } else if (mode === "CURSOR_MODE") {
        setMode("SELECTION_MODE");
        setBoundingBox({
          xStart: mouseEvent.clientX,
          yStart: mouseEvent.clientY,
          xEnd: mouseEvent.clientX,
          yEnd: mouseEvent.clientY,
        });
      }
    },
    [mode]
  );

  const startDrawing = useMutation(({ setMyPresence }, point, pressure) => {
    setMyPresence({ pencilDraft: [[point.x, point.y, pressure]] });
  }, []);

  const onShapePointerDown = useMutation(
    ({ setMyPresence, storage }, event, shapeId, shape, x, y) => {
      if (mode === "PENCIL_MODE") {
        return;
      }
      event.stopPropagation();
      history.pause();
      const currColor = storage.get(shape).get(shapeId).color;
      if (shape === "square") {
        setMyPresence(
          {
            currentShapeId: shapeId,
            currentShape: shape,
            currentShapePosition: { x, y },
            currentColor: currColor,
          },
          { addToHistory: true }
        );
      } else if (shape === "circle") {
        setMyPresence(
          {
            currentShapeId: shapeId,
            currentShape: shape,
            currentShapePosition: { x: x - 50, y: y - 50 },
            currentColor: currColor,
          },
          { addToHistory: true }
        );
      }

      setIsDragging(true);
    },
    [history, mode]
  );
  const onShapePointerUp = useMutation(({ setMyPresence }) => {
    history.resume();
    setIsDragging(false);
  }, []);

  const onCanvasPointerUp = useMutation(
    ({ setMyPresence, storage, self }) => {
      if (mode === "PENCIL_MODE") {
        const drawingMap = storage.get("drawings");
        const lastUsedColor = self.presence.currentColor;
        const drawId = Date.now().toString();
        if (self.presence.pencilDraft === null) {
          return;
        }
        drawingMap.set(
          drawId,
          new LiveObject(
            penPointsToPathLayer(self.presence.pencilDraft, lastUsedColor)
          )
        );
        setMyPresence({ pencilDraft: null });
      } else if (mode === "SELECTION_MODE") {
        console.log("CURSOR MODE POINTER UP");
        // Point down on canavs and up on canvas
        if (!isDragging) {
          setMyPresence(
            {
              currentShapeId: null,
              currentShape: null,
              currentShapePosition: null,
            },
            { addToHistory: true }
          );
        }
        setIsDragging(false);
        history.resume();
        setMode("CURSOR_MODE");
        setBoundingBox(null);
      }
    },
    [history, isDragging, mode]
  );

  const continueDrawing = useMutation(
    ({ setMyPresence, self }, point, pressure) => {
      const { pencilDraft } = self.presence;
      if (pencilDraft === null) {
        return;
      }
      setMyPresence({
        pencilDraft: [...pencilDraft, [point.x, point.y, pressure]],
      });
    },
    []
  );

  const onCanvasPointerMove = useMutation(
    ({ storage, self, setMyPresence }, mouseEvent) => {
      setMyPresence({
        cursor: { x: mouseEvent.clientX, y: mouseEvent.clientY },
      });
      if (mode === "PENCIL_MODE") {
        const current = pointerEventToCanvasPoint(mouseEvent, camera);
        continueDrawing(current, mouseEvent.pressure);
      } else if (mode === "CURSOR_MODE") {
        mouseEvent.stopPropagation();
        if (!isDragging) {
          return;
        }
        const currentShape = self.presence.currentShape;
        if (!currentShape) {
          return;
        }
        const shapeId = self.presence.currentShapeId;
        const map = storage.get(currentShape);
        const color = storage.get(currentShape).get(shapeId).color;
        if (currentShape === "circle" && map) {
          map.set(shapeId, {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
            color: color,
          });
        } else if (currentShape === "square" && map) {
          map.set(shapeId, {
            x: mouseEvent.clientX - 50,
            y: mouseEvent.clientY - 50,
            color: color,
          });
        }
        setMyPresence({
          currentShapePosition: {
            x: mouseEvent.clientX - 50,
            y: mouseEvent.clientY - 50,
          },
        });
      } else if (mode === "SELECTION_MODE") {
        setBoundingBox({
          ...boundingBox,
          xEnd: mouseEvent.clientX,
          yEnd: mouseEvent.clientY,
        });
      }
    },
    [isDragging, mode, continueDrawing, boundingBox]
  );
  return (
    <>
      <svg
        className="rec-cnt"
        onPointerUp={onCanvasPointerUp}
        onPointerMove={onCanvasPointerMove}
        onPointerDown={onCanvasPointerDown}
      >
        {drawingKeys.map((dKey) => (
          <DrawComponent id={dKey} key={dKey} selectionColor={color} />
        ))}
        {me.presence.pencilDraft !== null &&
          me.presence.pencilDraft.length > 1 && (
            <Path
              points={me.presence.pencilDraft}
              x={0}
              y={0}
              selectionColor={color}
            />
          )}
        {others.map(({ connectionId, presence }) => {
          if (presence.pencilDraft) {
            return (
              <Path
                points={presence.pencilDraft}
                x={0}
                y={0}
                selectionColor={presence.currentColor}
              />
            );
          }
        })}

        {boundingBox ? (
          <rect
            x={Math.min(boundingBox.xStart, boundingBox.xEnd)}
            y={Math.min(boundingBox.yStart, boundingBox.yEnd)}
            width={Math.max(
              boundingBox.xEnd - boundingBox.xStart,
              boundingBox.xStart - boundingBox.xEnd
            )}
            height={Math.max(
              boundingBox.yEnd - boundingBox.yStart,
              boundingBox.yStart - boundingBox.yEnd
            )}
            fill="rgba(0,0,255,.05)"
            stroke="blue"
          />
        ) : null}
        {rectKeys.map((rectKey) => (
          <Square
            key={rectKey}
            rectId={rectKey}
            onShapePointerDown={onShapePointerDown}
            onShapePointerUp={onShapePointerUp}
          />
        ))}
        {circleKeys.map((circleKey) => (
          <Circle
            key={circleKey}
            circleId={circleKey}
            onShapePointerDown={onShapePointerDown}
            onShapePointerUp={onShapePointerUp}
          />
        ))}
      </svg>

      {me.presence.currentShapeId && (
        <SelectionTools
          position={me.presence.currentShapePosition}
          id={me.presence.currentShapeId}
          shape={me.presence.currentShape}
          setColor={setColor}
        />
      )}

      {others.map(({ connectionId, presence }) => {
        if (presence.cursor) {
          return (
            <Cursor
              x={presence.cursor.x}
              y={presence.cursor.y}
              color="aquamarine"
              name={presence.name}
            />
          );
        }
      })}
      <div
        className="nav"
        onPointerMove={(e) => {
          updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } });
        }}
        onPointerUp={() => {
          if (mode === "SELECTION_MODE") {
            setBoundingBox(null);
            setMode("CURSOR_MODE");
          }
        }}
      >
        <button onClick={() => insertShape("square")}>Square</button>
        <button onClick={() => insertShape("circle")}>Circle</button>
        <button onClick={deleteSquare}>Delete</button>
        <button onClick={() => history.redo()}>Redo</button>
        <button onClick={() => history.undo()}>Undo</button>
        <button onClick={() => setMode("CURSOR_MODE")}>Cursor</button>
        <button onClick={() => setMode("PENCIL_MODE")}>Pencil</button>
        {mode}
      </div>
    </>
  );
}

function Square({ rectId, onShapePointerDown, onShapePointerUp }) {
  const { x, y, color } = useStorage((root) => root.square.get(rectId));
  const selectedShape = useSelf((me) => me.presence.currentShapeId === rectId);
  const selectedColor = selectedShape ? "black" : color;
  return (
    <rect
      onPointerDown={(e) => onShapePointerDown(e, rectId, "square", x, y)}
      onPointerUp={onShapePointerUp}
      x={x}
      y={y}
      height={100}
      width={100}
      fill={color}
      stroke={selectedColor}
      strokeWidth={"3px"}
    />
  );
}

function Circle({ circleId, onShapePointerDown, onShapePointerUp }) {
  const { x, y, color } = useStorage((root) => root.circle.get(circleId));
  const selectedShape = useSelf(
    (me) => me.presence.currentShapeId === circleId
  );
  const selectedColor = selectedShape ? "black" : color;
  return (
    <ellipse
      onPointerDown={(e) => onShapePointerDown(e, circleId, "circle", x, y)}
      onPointerUp={onShapePointerUp}
      cx={x}
      cy={y}
      rx={50}
      ry={50}
      fill={color}
      stroke={selectedColor}
      strokeWidth={"3px"}
    />
    // <div
    //   onPointerDown={(e) => onShapePointerDown(e, circleId, "circle", x, y)}
    //   onPointerUp={onShapePointerUp}
    //   style={{
    //     width: "100px",
    //     height: "100px",
    //     borderRadius: "50px",
    //     backgroundColor: color,
    //     position: "absolute",
    //     top: `${y}px`,
    //     left: `${x}px`,
    //     border: `${selectedColor} 3px solid`,
    //   }}
    // />
  );
}

function penPointsToPathLayer(points, color) {
  if (points.length < 2) {
    throw new Error("Can't transform points with less than 2 points");
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;
    if (left > x) {
      left = x;
    }
    if (top > y) {
      top = y;
    }
    if (right < x) {
      right = x;
    }
    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}

function pointerEventToCanvasPoint(e, camera) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}
