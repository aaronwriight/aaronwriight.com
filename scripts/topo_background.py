"""Regenerate the site's contour-map background (public/textures/high-peaks-mist.json).

The background is a faint contour map of the Adirondack High Peaks ("high peaks mist" in the texture study).
Elevations come from AWS Terrain Tiles (terrarium PNGs: open data from USGS 3DEP, SRTM and other sources).
This script downloads the tiles it needs (cached in .topo-cache/), decodes them to metres, frames the chosen
view, smooths it, and writes a compact JSON file that src/components/site/topo-background.tsx draws at runtime.

Usage:
    python3 scripts/topo_background.py [--out public/textures/high-peaks-mist.json]

Requires numpy, scipy and Pillow. Tiles are static, so the output only changes when the settings below change.
"""
import argparse
import base64
import json
import math
import os
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, maximum_filter, zoom

ROOT = Path(__file__).resolve().parent.parent
TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
ZOOM = 12                      # about 27 m per sample at this latitude

# The view chosen in the texture study: the High Peaks core, from Marcy Dam and Algonquin across Colden and
# Marcy to Basin and Gothics. A 30% margin is kept so the map can widen or heighten to fit any screen.
CENTER = (44.13, -73.92)       # lat, lon
SPAN_KM = (18.0, 10.1)         # width, height
MARGIN = 0.3
SMOOTH = math.hypot(1.2, 5.5)  # Gaussian sigma in samples: calm, flowing lines
RESOLUTION = 420               # width of the embedded grid in samples
STYLE = {"interval": 40, "index": 5, "lineAlpha": 0.52, "lineWidth": 0.6, "colour": "flow"}

# Optional labels (off on the site by default): published summit heights in feet and approximate positions.
# Each label is moved to the nearest true summit in the data.
PEAKS = [
    ("mount marcy", 44.1128, -73.9237, 5344), ("algonquin peak", 44.1437, -73.9867, 5114),
    ("mount haystack", 44.1058, -73.9008, 4960), ("mount skylight", 44.0995, -73.9306, 4926),
    ("iroquois peak", 44.1365, -74.0005, 4840), ("basin mountain", 44.1213, -73.8862, 4827),
    ("gothics", 44.1280, -73.8577, 4736), ("mount colden", 44.1265, -73.9599, 4714),
    ("wright peak", 44.1527, -73.9814, 4580), ("phelps mountain", 44.1575, -73.9213, 4161),
    ("cascade mountain", 44.2186, -73.8604, 4098),
]
PLACES = [("marcy dam", 44.1588, -73.9531)]


def mercator(lon: float, lat: float) -> tuple[float, float]:
    """Global Web Mercator pixel coordinates at ZOOM (256-pixel tiles)."""
    n = 256 * 2 ** ZOOM
    return (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n


def metres_per_sample(lat: float) -> float:
    return 40075016.686 * math.cos(math.radians(lat)) / (256 * 2 ** ZOOM)


def mosaic(x0: float, y0: float, x1: float, y1: float, cache: Path) -> tuple[np.ndarray, int, int]:
    """Elevations (metres) for the pixel box, plus the global pixel origin of the returned array."""
    cache.mkdir(parents=True, exist_ok=True)
    tx0, ty0, tx1, ty1 = int(x0 // 256), int(y0 // 256), int(x1 // 256), int(y1 // 256)
    rows = []
    for ty in range(ty0, ty1 + 1):
        row = []
        for tx in range(tx0, tx1 + 1):
            path = cache / f"{ZOOM}_{tx}_{ty}.png"
            if not path.exists():
                path.write_bytes(urllib.request.urlopen(TILE_URL.format(z=ZOOM, x=tx, y=ty), timeout=30).read())
            rgb = np.asarray(Image.open(path).convert("RGB"), dtype=np.float64)
            row.append(rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768)
        rows.append(np.hstack(row))
    return np.vstack(rows), tx0 * 256, ty0 * 256


def build(cache: Path) -> dict:
    lat, lon = CENTER
    mpp = metres_per_sample(lat)
    cx, cy = mercator(lon, lat)
    vw, vh = SPAN_KM[0] * 1000 / mpp, SPAN_KM[1] * 1000 / mpp
    x0, x1 = cx - vw * (0.5 + MARGIN), cx + vw * (0.5 + MARGIN)
    y0, y1 = cy - vh * (0.5 + MARGIN), cy + vh * (0.5 + MARGIN)
    pad = int(4 * SMOOTH)  # extra data around the crop so smoothing has no edge effects
    dem, ox, oy = mosaic(x0 - pad, y0 - pad, x1 + pad, y1 + pad, cache)
    sl = (slice(int(y0 - pad) - oy, int(y1 + pad) - oy), slice(int(x0 - pad) - ox, int(x1 + pad) - ox))
    smoothed = gaussian_filter(dem[sl], sigma=SMOOTH)
    crop = smoothed[pad:smoothed.shape[0] - pad, pad:smoothed.shape[1] - pad]  # explicit ends, so pad = 0 keeps everything
    grid = zoom(crop, RESOLUTION / crop.shape[1], order=1)
    lo, hi = float(grid.min()), float(grid.max())
    quantised = np.round((grid - lo) / (hi - lo) * 65535).astype("<u2")
    cw, ch = crop.shape[1], crop.shape[0]
    view = [(cx - vw / 2 - x0) / cw, (cy - vh / 2 - y0) / ch, (cx + vw / 2 - x0) / cw, (cy + vh / 2 - y0) / ch]

    labels = []
    search = 22  # about 600 m
    for name, plat, plon, feet in PEAKS:
        px, py = mercator(plon, plat)
        fx, fy = px - x0, py - y0
        if not (0 <= fx < cw and 0 <= fy < ch):
            continue
        xi, yi = int(round(fx)), int(round(fy))
        wy0, wy1, wx0, wx1 = max(0, yi - search), min(ch, yi + search + 1), max(0, xi - search), min(cw, xi + search + 1)
        window = crop[wy0:wy1, wx0:wx1]
        # Nearest true summit, so a small peak beside a big one is not dragged up its neighbour's flank.
        summits = np.argwhere((window == maximum_filter(window, size=9)) & (window > np.percentile(window, 60)))
        if len(summits):
            sy, sx = min(summits, key=lambda q: math.hypot(q[1] + wx0 - fx, q[0] + wy0 - fy))
            fx, fy = sx + wx0, sy + wy0
        labels.append({"name": name, "kind": "peak", "feet": feet, "x": round(fx / cw, 4), "y": round(fy / ch, 4)})
    for name, plat, plon in PLACES:
        px, py = mercator(plon, plat)
        if 0 <= px - x0 < cw and 0 <= py - y0 < ch:
            labels.append({"name": name, "kind": "place", "feet": None, "x": round((px - x0) / cw, 4), "y": round((py - y0) / ch, 4)})

    return {
        **STYLE,
        "source": "AWS Terrain Tiles (USGS 3DEP, SRTM and other open data); Adirondack High Peaks, NY",
        "view": [round(v, 4) for v in view],
        "dem": {"w": int(grid.shape[1]), "h": int(grid.shape[0]), "min": round(lo, 1), "max": round(hi, 1),
                "data": base64.b64encode(quantised.tobytes()).decode()},
        "labels": labels,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "textures" / "high-peaks-mist.json")
    parser.add_argument("--cache", type=Path, default=ROOT / ".topo-cache")
    args = parser.parse_args()
    args.out = args.out.resolve()
    texture = build(args.cache)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(texture, separators=(",", ":")))
    dem = texture["dem"]
    print(f"wrote {os.path.relpath(args.out, ROOT)}: {dem['w']}x{dem['h']} grid, {dem['min']:.0f} to {dem['max']:.0f} m, "
          f"{len(texture['labels'])} labels, {args.out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
