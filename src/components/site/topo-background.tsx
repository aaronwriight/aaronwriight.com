"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  drawTopo,
  sampleTopo,
  type TopoField,
  type TopoPalette,
  type TopoTexture,
} from "@/lib/topo-background";

// The settings chosen in the texture study ("high peaks mist"). Regenerate the data with scripts/topo_background.py.
const TEXTURE_URL = "/textures/high-peaks-mist.json";
const STRENGTH = 0.2; // overall strength of the contours: a faint watermark, so text always reads first
const NIGHT_STRENGTH = 0.85; // night mode draws a little softer, because colour glows on dark
const SHOW_PEAK_LABELS = false; // true adds small summit names and heights
const DRIFT_PER_PIXEL = 0.004; // contour intervals the lines move per pixel scrolled
const GRID_STEP = 5; // CSS pixels between elevation samples (more on very large screens, see gridStep)
const MAX_CELLS = 60000; // keeps one redraw within a frame on large displays
const MIN_PHASE_CHANGE = 0.02; // contour intervals the drift must move before the lines are redrawn
// Path prefixes where the background is not drawn (none at the moment; every page shares it).
const HIDDEN_ON: string[] = [];

const DAY: TopoPalette = { maroon: "#954f72", orange: "#f4a825", olive: "#6f8200", cyan: "#2aa198" };
const NIGHT: TopoPalette = { maroon: "#c47fa3", orange: "#f2be5c", olive: "#b0bf59", cyan: "#4fc3b6" };

// Wider spacing on very large canvases, so the work per redraw stays about the same as on a laptop screen.
function gridStep(width: number, height: number) {
  return Math.max(GRID_STEP, Math.sqrt((width * height) / MAX_CELLS));
}

export function TopoBackground() {
  const pathname = usePathname() ?? "";
  const hidden = HIDDEN_ON.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (hidden || !canvas || !context) {
      root.removeAttribute("data-topo");
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let texture: TopoTexture | null = null;
    let field: TopoField | null = null;
    let fieldSize = "";
    let drawnKey = "";
    let drawnPhase = Number.NaN;
    let frame = 0;
    let stopped = false;

    const paint = () => {
      frame = 0;
      if (!texture) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const size = `${width}x${height}@${ratio}`;
      if (size !== fieldSize) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        field = sampleTopo(texture, width, height, gridStep(width, height));
        fieldSize = size;
      }
      if (!field) return;
      const night = root.classList.contains("dark");
      const phase = reducedMotion.matches ? 0 : window.scrollY * DRIFT_PER_PIXEL;
      // Skip frames that would look the same: nothing resized or changed theme, and the drift has barely moved.
      const key = `${size}|${night}`;
      if (key === drawnKey && Math.abs(phase - drawnPhase) < MIN_PHASE_CHANGE) return;
      drawnKey = key;
      drawnPhase = phase;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawTopo(context, width, height, field, texture, {
        palette: night ? NIGHT : DAY,
        strength: STRENGTH * (night ? NIGHT_STRENGTH : 1),
        phase,
        labels: SHOW_PEAK_LABELS,
        labelColour: getComputedStyle(root).getPropertyValue("--site-text-secondary").trim() || "#78716c",
        labelFont: `10px ${getComputedStyle(root).getPropertyValue("--font-serif").trim() || "Georgia, serif"}`,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const load = async () => {
      try {
        const response = await fetch(TEXTURE_URL);
        if (!response.ok || stopped) return;
        const data = (await response.json()) as TopoTexture;
        if (stopped) return;
        texture = data;
        root.setAttribute("data-topo", "on");
        schedule();
      } catch {
        // Without the data the page simply stays plain.
      }
    };
    // Load once the page has settled, so the background never competes with the content.
    const idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(load, { timeout: 1500 }) : null;
    const timer = idle === null ? window.setTimeout(load, 300) : null;

    const themeObserver = new MutationObserver(schedule);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
    // The canvas follows the viewport, which also narrows when a scrollbar appears.
    const sizeObserver = new ResizeObserver(schedule);
    sizeObserver.observe(canvas);
    // Moving the window to a screen with a different pixel density changes no CSS size, so watch the density itself.
    let density: MediaQueryList | null = null;
    const watchDensity = () => {
      density?.removeEventListener("change", onDensity);
      density = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      density.addEventListener("change", onDensity);
    };
    const onDensity = () => {
      watchDensity();
      schedule();
    };
    watchDensity();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    reducedMotion.addEventListener("change", schedule);

    return () => {
      stopped = true;
      if (idle !== null) window.cancelIdleCallback(idle);
      if (timer !== null) window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      sizeObserver.disconnect();
      density?.removeEventListener("change", onDensity);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      reducedMotion.removeEventListener("change", schedule);
      root.removeAttribute("data-topo");
    };
  }, [hidden]);

  if (hidden) return null;
  return <canvas ref={canvasRef} className="topo-background" aria-hidden="true" data-topo-background="" />;
}
