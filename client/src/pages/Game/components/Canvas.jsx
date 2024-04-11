import {
  useMutation,
  RoomProvider,
  useHistory,
  useStorage,
  useSelf,
  useOthersMapped,
  useCanUndo,
  useCanRedo,
  useThreads,
  useOthers,
  useBroadcastEvent,
  useEventListener,
} from "../game_liveblocks.config";

import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {

  CanvasMode,
} from "../types";
import styles from "./styles/canvas.module.css";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "../utils";
import SelectionBox from "./SelectionBox";
import { nanoid } from "nanoid";

import LayerComponent from "./LayerComponent";
import SelectionTools from "./SelectionTools";
import useDisableScrollBounce from "../hooks/useDisableScrollBounce";
import useDeleteLayers from "../hooks/useDeleteLayers";
import MultiplayerGuides from "./MultiplayerGuides";
import Path from "./Path";
import ToolsBar from "./ToolsBar";


import { Composer, Thread } from "@liveblocks/react-comments";

import ColorPickPanel from "./colorPickPanel";

import ThreadContainer from "./Thread";
import wordList from "./wordList";


const MAX_LAYERS = 100;
const scribbleWords = [
  "Waterfall",
  "Spaceship",
  "Lighthouse",
  "Kangaroo",
  "Pyramids",
  "Rainbow",
  "Skateboard",
  "Volcano",
  "Scarecrow",
  "Cactus",
];



export default function Canvas() {
  const others = useOthers();
  const currentUser = useSelf();

  const layerIds = useStorage((root) => root.layerIds);

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const [canvasState, setState] = useState({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState({
    r: 252,
    g: 142,
    b: 42,
  });
  const selection = useSelf((me) => me.presence.selection);

  const setFill = useMutation(
    ({ storage }, fill) => {
      const liveLayers = storage.get("layers");
      setLastUsedColor(fill);
      selection.forEach((id) => {
        liveLayers.get(id)?.set("fill", fill);
      });
    },
    [selection, setLastUsedColor]
  );
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useDisableScrollBounce();

  const deleteLayers = useDeleteLayers();

  /**
   * Hook used to listen to Undo / Redo and delete selected layers
   */
  useEffect(() => {
    function onKeyDown(e) {
      switch (e.key) {
        case "Backspace": {
          deleteLayers();
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  /**
   * Select the layer if not already selected and start translating the selection
   */
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e, layerId) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setState({ mode: CanvasMode.Translating, current: point });
    },
    [setState, camera, history, canvasState.mode]
  );

  /**
   * Start resizing the layer
   */
  const onResizeHandlePointerDown = useCallback(
    (corner, initialBounds) => {
      history.pause();
      setState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  /**
   * Insert an ellipse or a rectangle at the given position and select it
   */
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType,
      position
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  /**
   * Transform the drawing of the current user in a layer and reset the presence to delete the draft.
   */
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;
      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);
      setMyPresence({ pencilDraft: null });
      setState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  /**
   * Move selected layers on the canvas
   */
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  /**
   * Resize selected layer. Only resizing a single layer is allowed.
   */
  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  /**
   * Insert the first path point and start drawing with the pencil
   */
  const startDrawing = useMutation(
    ({ setMyPresence }, point, pressure) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  /**
   * Continue the drawing and send the current draft to other users in the room
   */
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point, e) => {
      const { pencilDraft } = self.presence;
      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  /**
   * Start multiselection with the selection net if the pointer move enough since pressed
   */
  const startMultiSelection = useCallback((current, origin) => {
    // If the distance between the pointer position and the pointer position when it was pressed
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      // Start multi selection
      setState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  /**
   * Update the position of the selection net and select the layers accordingly
   */
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current, origin) => {
      const layers = storage.get("layers").toImmutable();
      setState({
        mode: CanvasMode.SelectionNet,
        origin: origin,
        current,
      });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );
      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  /**
   * Create a map layerId to color based on the selection of all the users in the room
   */
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection = {};

    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const onWheel = useCallback((e) => {
    // Pan the camera based on the wheel delta
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerDown = React.useCallback(
    (e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setState, startDrawing]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }
      setMyPresence({ cursor: current });
    },
    [
      camera,
      canvasState,
      continueDrawing,
      resizeSelectedLayer,
      startMultiSelection,
      translateSelectedLayers,
      updateSelectionNet,
    ]
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => setMyPresence({ cursor: null }),
    []
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [
      camera,
      canvasState,
      history,
      insertLayer,
      insertPath,
      setState,
      unselectLayers,
    ]
  );

  useEventListener(({event})=>{
    if (event.type ==="play"){
      console.log(event.word)
      setWord(event.word)

      setPlayer(event.sender)
    }

  })
 
  const [word, setWord] = useState("")
  const [player, setPlayer] = useState("")
  const [isRunning, setIsRunning] = useState(false);
  

  return (
    // start return
    <>
      <div>
        <div>
          <div className="relative top-[136px] left-[40px] border-8 border-[#AC4F98] rounded-[44px] w-[816px] 2xl:w-[1000px] 2xl:h-[700px]">

           <ColorPickPanel onChange={setFill} />
           <PlayButton   setWord ={setWord} setPlayer={setPlayer}  setRunningClock={setIsRunning} ></PlayButton>
           {word && <WordDisplay word={word} player ={player} currentUser={currentUser}></WordDisplay>} 
           <CountdownClock initialSeconds={60} isRunning={isRunning} />
           <div className="absolute p-3 top-[-90px] left-[1020px] 2xl:left-[1220px] flex flex-row flex-wrap gap-x-2 gap-y-[2px] justify-start items-start  w-[180px] h-[150px] border-2 border-[#EB87B6] rounded-[24px]">

            {currentUser && <User user={currentUser}></User>}
            {others.map((other) => (
              <User user={other}></User>
            ))}

         
        </div>
            <SelectionTools
              isAnimated={
                canvasState.mode !== CanvasMode.Translating &&
                canvasState.mode !== CanvasMode.Resizing
              }
              camera={camera}
              setLastUsedColor={setLastUsedColor}
            />

            <svg
              className="w-[800px] h-[661px] 2xl:w-[980px] 2xl: h-[680px] bg-[#171717] rounded-[44px] "
              // className =" w-[1000px] h-[700px] bg-white"
              // className ={styles.renderer_svg}
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              onPointerUp={onPointerUp}
            >
              <g
                style={{
                  transform: `translate(${camera.x}px, ${camera.y}px)`,
                }}
              >
                {layerIds.map((layerId) => (
                  <LayerComponent
                    key={layerId}
                    id={layerId}
                    mode={canvasState.mode}
                    onLayerPointerDown={onLayerPointerDown}
                    selectionColor={layerIdsToColorSelection[layerId]}
                  />
                ))}
                {/* Blue square that show the selection of the current users. Also contains the resize handles. */}
                <SelectionBox
                  onResizeHandlePointerDown={onResizeHandlePointerDown}
                />
                {/* Selection net that appears when the user is selecting multiple layers at once */}
                {canvasState.mode === CanvasMode.SelectionNet &&
                  canvasState.current != null && (
                    <rect
                      className={styles.selection_net}
                      x={Math.min(canvasState.origin.x, canvasState.current.x)}
                      y={Math.min(canvasState.origin.y, canvasState.current.y)}
                      width={Math.abs(
                        canvasState.origin.x - canvasState.current.x
                      )}
                      height={Math.abs(
                        canvasState.origin.y - canvasState.current.y
                      )}
                    />
                  )}
                <MultiplayerGuides />
                {/* Drawing in progress. Still not commited to the storage. */}
                {pencilDraft != null && pencilDraft.length > 0 && (
                  <Path
                    points={pencilDraft}
                    fill={colorToCss(lastUsedColor)}
                    x={0}
                    y={0}
                  />
                )}
              </g>
            </svg>
            <ToolsBar
            canvasState={canvasState}
            setCanvasState={setState}
            undo={history.undo}
            redo={history.redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
           <ThreadContainer word={word} />
          </div>

        

        
        </div>
       
      </div>
    </>
  );
}





function User({ user }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div>
      <div
        id="tooltip-jese"
        role="tooltip"
        className={`absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm ${
          isTooltipVisible ? "opacity-100 visible" : "opacity-0 invisible"
        } tooltip dark:bg-gray-700`}
      >
        {user.info.name}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
      <img
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        className="w-10 h-10 rounded-full border-[#FB8C8C] shadow-sm border-4"
        src={user.info.image}
        alt="Medium avatar"
      />
    </div>
  );
}
const CountdownClock = ({ initialSeconds , isRunning }) => {

  const [seconds, setSeconds] = useState(initialSeconds);



  useEffect(() => {
    if (seconds <= 0) {
      // Stop the countdown at 0 to avoid negative values
      return;
    }
    if (isRunning){
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [seconds, isRunning]);

  useEffect(() => {
    if (seconds <= 0) {
      // Handle completion, e.g., alert or callback
      // alert("Time's up!");
      setSeconds(initialSeconds);
    }
  }, [seconds, initialSeconds]);

  // Calculate the stroke dashoffset for the SVG circle
  const radius = 25; // Adjusted radius for size of the clock
  const circumference = 2 * Math.PI * radius;
  const offset = ((initialSeconds - seconds) / initialSeconds) * circumference;

  return (
    <div className="absolute top-[-90px] left-[850px] 2xl:left-[1050px]">
      {/* Adjusted viewBox and direct attribute specification for size */}
      <svg width="148" height="148" viewBox="0 0 60 60">
        <circle
          className="text-gray-300"

          stroke="currentColor"
          fill="transparent"
          strokeWidth="8"
          r="25" // Adjusted radius
          cx="30" // Adjusted center x-coordinate
          cy="30" // Adjusted center y-coordinate
        />
        <circle
          className="text-[#4FC8B7]"
          stroke="currentColor"
          fill="transparent"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r="25" // Adjusted radius
          cx="30" // Adjusted center x-coordinate
          cy="30" // Adjusted center y-coordinate
          transform="rotate(-90 30 30)" // Adjust rotation center
        />
        <text
          x="50%"
          y="50%"
          className="text-cyan-600"
          textAnchor="middle"
          strokeWidth="1px"
          dy=".3em"
          fill="currentColor"
          style={{ fontSize: '18px' }} // Adjust font size for visibility
        >
          {seconds}
        </text>
      </svg>
    </div>
  );
};


const WordDisplay = ({ word, player, currentUser }) => {
  const wordUppercase = word.toUpperCase();
  const wordArr = wordUppercase.split('');

  return (
    <div className="absolute top-[560px] left-[20px] flex justify-center my-8">
      {wordArr.map((c, index) => (
        <div
          key={index}
          className="w-12 h-12 bg-gray-700 border-2 border-gray-600 rounded-md flex justify-center items-center text-3xl font-bold text-white mx-[0.5px]"
        >
          {currentUser.info.name === player ? c : (
            <span className="text-transparent text-shadow-glow">{c}</span>
          )}
        </div>
      ))}
    </div>
  );
};

function PlayButton ( {setWord, setPlayer, setRunningClock}){

  const broadcast=  useBroadcastEvent()
  const currentUser = useSelf()
 
  const broadcastClick =()=>{
    const word = wordList[Math.floor(Math.random() * wordList.length)]

    broadcast({type:"play", word:word, sender:currentUser.info.name})
    setWord(word)
    setPlayer(currentUser.info.name)
    setRunningClock(true)
  }

  return(
    <div className=" absolute top-[20px] right-[20px] z-10 flex flex-row justify-center items-center w-[133px] h-[52px] border-[#EB87B6] bg-[#AC4F98]  rounded-[30px] border-[6px] ">
      <button className ='text-white text-2xl' onClick ={broadcastClick}>Play</button>
    </div>
  )
}

