"""Rebuilds every logo asset from the master drawing.

    python3 scripts/brand_assets.py

Reads images/aaronwriight.png (the logo on a transparent ground) and writes:
- public/brand/aaronwriight-logo.png        the header logo by day
- public/brand/aaronwriight-logo-night.png  the night version: the cup dimmed, everything around it in light ink
- public/favicon.ico, public/brand/icon-32.png        the cup alone, for browser tabs
- public/brand/apple-touch-icon.png, icon-192.png, icon-512.png   the whole mark on white, for home screens
- public/brand/og-image.jpg                 the sharing image (images/brand/og-template.png with the logo dropped in)

The largest connected shape in the drawing is taken to be the cup; everything else (corners, small vignettes) is
"around it". Needs Pillow, NumPy and SciPy.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "images" / "aaronwriight.png"
OG_TEMPLATE = ROOT / "images" / "brand" / "og-template.png"
OUT = ROOT / "public" / "brand"

LOGO_WIDTH = 640  # pixels; the header shows it at 64-96 CSS px, so this covers high-density screens
NIGHT_CUP = 0.86  # brightness of the cup at night
NIGHT_INK = 0.9  # brightness of the inverted marks around the cup at night
OG_BOX = (110, 155, 360, 320)  # where the logo sits in the sharing template: x, y, width, height


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    src = np.array(Image.open(MASTER).convert("RGBA")).astype(float)
    alpha = src[..., 3]
    ink = alpha > 24
    labels, count = ndimage.label(ink, structure=np.ones((3, 3)))
    sizes = ndimage.sum(np.ones_like(alpha), labels, index=range(1, count + 1))
    cup_id = int(np.argmax(sizes)) + 1
    cup = ndimage.binary_dilation(labels == cup_id, iterations=4)  # take in the cup's soft outer edge

    # Clear faint specks far from any ink, then crop to the drawing with a little air.
    day = src.copy()
    day[..., 3][~ndimage.binary_dilation(ink, iterations=6)] = 0
    ys, xs = np.nonzero(ink)
    pad = 10
    box = (slice(max(0, ys.min() - pad), ys.max() + pad + 1), slice(max(0, xs.min() - pad), xs.max() + pad + 1))

    # Night: the cup dims; the marks around it turn to light ink by inverting them, which keeps their line detail.
    night = day.copy()
    around = ~cup & (night[..., 3] > 0)
    night[..., :3][around] = (255 - night[..., :3][around]) * NIGHT_INK
    night[..., :3][cup] *= NIGHT_CUP

    def to_image(arr: np.ndarray) -> Image.Image:
        return Image.fromarray(arr[box].clip(0, 255).astype("uint8"), "RGBA")

    logo = to_image(day)
    logo = logo.resize((LOGO_WIDTH, round(logo.height * LOGO_WIDTH / logo.width)), Image.LANCZOS)
    logo.save(OUT / "aaronwriight-logo.png", optimize=True)
    night_logo = to_image(night).resize(logo.size, Image.LANCZOS)
    night_logo.save(OUT / "aaronwriight-logo-night.png", optimize=True)

    # The cup alone, square, for tab icons.
    cys, cxs = np.nonzero(labels == cup_id)
    side = max(cxs.max() - cxs.min(), cys.max() - cys.min()) + 24
    cx, cy = (cxs.min() + cxs.max()) // 2, (cys.min() + cys.max()) // 2
    cup_only = day.copy()
    cup_only[..., 3][~cup] = 0
    canvas = np.zeros((side, side, 4))
    y0, x0 = cy - side // 2, cx - side // 2
    sy0, sx0 = max(0, y0), max(0, x0)
    sy1, sx1 = min(cup_only.shape[0], y0 + side), min(cup_only.shape[1], x0 + side)
    canvas[sy0 - y0: sy1 - y0, sx0 - x0: sx1 - x0] = cup_only[sy0:sy1, sx0:sx1]
    cup_square = Image.fromarray(canvas.clip(0, 255).astype("uint8"), "RGBA")

    def fit(img: Image.Image, size: int, background=None, margin=0.0) -> Image.Image:
        tile = Image.new("RGBA", (size, size), background or (0, 0, 0, 0))
        inner = round(size * (1 - 2 * margin))
        scaled = img.copy()
        scaled.thumbnail((inner, inner), Image.LANCZOS)
        tile.alpha_composite(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2))
        return tile

    tabs = [fit(cup_square, s) for s in (16, 32, 48)]
    tabs = [t.filter(ImageFilter.UnsharpMask(radius=0.6, percent=60, threshold=0)) if t.width <= 32 else t for t in tabs]
    tabs[2].save(ROOT / "public" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=tabs[:2])
    tabs[1].save(OUT / "icon-32.png", optimize=True)

    # Home-screen icons: the whole mark on white (iOS and Android fill transparency with black).
    white = (255, 255, 255, 255)
    for name, size in [("apple-touch-icon", 180), ("icon-192", 192), ("icon-512", 512)]:
        fit(logo, size, white, 0.1).convert("RGB").save(OUT / f"{name}.png", optimize=True)

    # Sharing image: the template's contours and name, with the logo in its box.
    og = Image.open(OG_TEMPLATE).convert("RGBA")
    x, y, w, h = OG_BOX
    scaled = logo.copy()
    scaled.thumbnail((w, h), Image.LANCZOS)
    og.alpha_composite(scaled, (x + (w - scaled.width) // 2, y + (h - scaled.height) // 2))
    og.convert("RGB").save(OUT / "og-image.jpg", quality=90, optimize=True, progressive=True)

    print(f"logo {logo.size[0]}x{logo.size[1]}; cup is shape {cup_id} of {count}; wrote {OUT.relative_to(ROOT)}/ and public/favicon.ico")


if __name__ == "__main__":
    main()
