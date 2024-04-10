// Layers.js
// Defining enums as objects
export const LayerType = {
  Rectangle: 0,
  Ellipse: 1,
  Path: 2,
};

export const Side = {
  Top: 1,
  Bottom: 2,
  Left: 4,
  Right: 8,
};

export const CanvasMode = {
  None: 0,
  Pressing: 1,
  SelectionNet: 2,
  Translating: 3,
  Inserting: 4,
  Resizing: 5,
  Pencil: 6,
};

// Layer creation functions
export function createRectangleLayer(x, y, height, width, fill) {
  return { type: LayerType.Rectangle, x, y, height, width, fill };
}

export function createEllipseLayer(x, y, height, width, fill) {
  return { type: LayerType.Ellipse, x, y, height, width, fill };
}

export function createPathLayer(x, y, height, width, fill, points) {
  return { type: LayerType.Path, x, y, height, width, fill, points };
}
