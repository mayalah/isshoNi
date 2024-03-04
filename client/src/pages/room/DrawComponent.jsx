import getStroke from "perfect-freehand";
import { useStorage } from "./liveblocks.config";
import { memo } from "react";

const DrawComponent = memo(({ id, selectionColor }) => {
  const layer = useStorage((root) => root.drawings.get(id));
  return (
    <Path
      style={{ position: "absolute", top: 0, left: 0 }}
      points={layer.points}
      x={layer.x}
      y={layer.y}
      selectionColor={layer.fill}
    />
  );
});
export default DrawComponent;

export function Path({ points, x, y, selectionColor }) {
  return (
    <path
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      fill={selectionColor}
      stroke={selectionColor}
      strokeWidth={1}
    />
  );
}

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
