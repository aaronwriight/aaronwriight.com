#!/usr/bin/env python3
"""Lift a logo drawn on paper off its paper: images/logo_orig.png -> images/logo_orig_ink.png (transparent ground).

    python3 scripts/logo_from_paper.py

The brand scripts (brand_assets.py, brand_package.py) need the drawing on a transparent ground. Here the cup (the
largest connected shape, with its rim, foam and handle filled in) stays fully opaque, paper-white rim included, so it
reads the same on any background. Everything else (the viewfinder corners, the dot, the cup's soft outer edge) has the
paper colour taken out of it: each pixel's alpha is how far it is from the paper, and its colour is un-mixed from the
paper accordingly. The original file is never changed. Needs Pillow, NumPy and SciPy.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "images" / "logo_orig.png"
OUTPUT = ROOT / "images" / "logo_orig_ink.png"
INK_LEVEL = 40  # how far (0-255) below the paper a pixel must be to count as ink when finding the shapes
CUP_REACH = 1.7  # shapes lying wholly within this many coffee radii of its centre belong to the cup (rim, handle)


def main() -> None:
    rgb = np.array(Image.open(SOURCE).convert("RGB")).astype(float)
    height, width, _ = rgb.shape

    # The paper: the median colour of a band around the edge, where there is no drawing.
    edge = np.concatenate([rgb[:40].reshape(-1, 3), rgb[-40:].reshape(-1, 3), rgb[:, :40].reshape(-1, 3), rgb[:, -40:].reshape(-1, 3)])
    paper = np.median(edge, axis=0)

    # Colour to alpha against the paper: alpha is the largest per-channel darkening relative to the paper.
    darkening = np.clip((paper - rgb) / np.maximum(paper, 1), 0, 1)
    alpha = darkening.max(axis=2)
    alpha = np.clip((alpha - 0.04) / 0.96, 0, 1)  # paper texture stays clear
    with np.errstate(divide="ignore", invalid="ignore"):
        colour = (rgb - (1 - alpha[..., None]) * paper) / alpha[..., None]
    colour = np.nan_to_num(np.clip(colour, 0, 255))

    # The cup: the largest connected ink shape (the coffee) and every shape lying within reach of it (the rim's
    # outline, the handle), filled in and kept opaque in their original colours. The viewfinder corners and the dot
    # lie farther out and stay as lifted ink.
    ink = (paper.mean() - rgb.mean(axis=2)) > INK_LEVEL
    labels, count = ndimage.label(ndimage.binary_closing(ink, iterations=2), structure=np.ones((3, 3)))
    sizes = ndimage.sum(np.ones_like(labels), labels, index=range(1, count + 1))
    core = labels == int(np.argmax(sizes)) + 1
    ys, xs = np.nonzero(core)
    cy, cx, radius = ys.mean(), xs.mean(), max(np.ptp(ys), np.ptp(xs)) / 2
    yy, xx = np.indices(labels.shape)
    reach = np.hypot(yy - cy, xx - cx)
    farthest = ndimage.maximum(reach, labels, index=range(1, count + 1))
    near = [i + 1 for i, distance in enumerate(farthest) if distance < CUP_REACH * radius]
    cup = ndimage.binary_fill_holes(ndimage.binary_closing(np.isin(labels, near), iterations=4))
    cup = ndimage.binary_erosion(cup, iterations=1)  # leave the outermost pixel of the outline to the soft edge
    colour[cup] = rgb[cup]
    alpha[cup] = 1

    out = np.dstack([colour, alpha * 255]).round().clip(0, 255).astype("uint8")
    Image.fromarray(out, "RGBA").save(OUTPUT, optimize=True)
    print(f"paper {paper.round().astype(int).tolist()}; cup {cup.sum()} px opaque; wrote {OUTPUT.relative_to(ROOT)} ({width}x{height})")


if __name__ == "__main__":
    main()
