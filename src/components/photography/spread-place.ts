import type { CSSProperties } from "react";

// An irregular, repeating arrangement shared by the portfolio's photographs and the empty frames that stand in for
// them. On wide screens each frame takes a place on a 12-column grid (start column, span for landscape and upright
// frames, drop from the top in rem); pairs share a row and sit at different heights. On narrow screens it is one
// column, with the width and left offset (percent) varying instead. Kept out of photo-spread.tsx, a client module, so
// server components can place frames too.
const SLOTS = [
  { start: 1, landscape: 8, upright: 5, top: 0, width: 100, left: 0 },
  { start: 9, landscape: 4, upright: 4, top: 7, width: 72, left: 28 },
  { start: 3, landscape: 7, upright: 4, top: 3, width: 86, left: 0 },
  { start: 10, landscape: 3, upright: 3, top: 9, width: 64, left: 18 },
  { start: 5, landscape: 8, upright: 5, top: 2, width: 100, left: 0 },
  { start: 1, landscape: 6, upright: 4, top: 4, width: 78, left: 22 },
  { start: 8, landscape: 5, upright: 4, top: 8, width: 70, left: 6 },
];

// The place for the frame at this position: its column span on wide screens, its width (percent) on narrow ones, and
// the custom properties .photo-spread-item reads.
export function spreadPlace(index: number, upright: boolean) {
  const slot = SLOTS[index % SLOTS.length];
  const span = upright ? slot.upright : slot.landscape;
  const width = upright ? Math.round(slot.width * 0.85) : slot.width;
  const style = { "--col": `${slot.start} / span ${span}`, "--top": `${slot.top}rem`, "--w": `${width}%`, "--ml": `${slot.left}%` } as CSSProperties;
  return { span, width, style };
}
