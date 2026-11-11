#!/usr/bin/env python3
"""Render the CV and the resume as page images on the site's sand paper, for the /cognitive-science/cv and /resume
pages.

    python3 scripts/cv_pages.py

Reads the PDFs the site already serves (public/files/cv/*.pdf and public/files/resume/*.pdf), renders each page with
pdftoppm (poppler), and multiplies it by the sand paper colour, so white paper becomes sand and ink stays ink. Writes
public/images/cv/<pdf name>-<page>.png and content/cv-pages.json ({"cv": [{src, width, height}, ...], "resume": [...]}).
Run it whenever the CV or resume PDF is replaced (see the cv-resume notes: bump the ?v= cache-buster too).
"""

import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "cv"
MANIFEST = ROOT / "content" / "cv-pages.json"
SAND = (248, 242, 230)  # --color-paper in globals.css
RESOLUTION = 180  # dpi: a letter page is 1530 pixels wide, sharp at the page's 765px column on high-density screens


def render(pdf: Path) -> list[dict]:
    pages = []
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-r", str(RESOLUTION), "-png", str(pdf), f"{tmp}/page"], check=True)
        for index, page in enumerate(sorted(Path(tmp).glob("page-*.png")), start=1):
            with Image.open(page) as image:
                rgb = image.convert("RGB")
                tinted = ImageChops.multiply(rgb, Image.new("RGB", rgb.size, SAND))
                name = f"{pdf.stem}-{index}.png"
                tinted.save(OUT / name, optimize=True)
                pages.append({"src": f"/images/cv/{name}", "width": rgb.width, "height": rgb.height})
    return pages


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.png"):
        old.unlink()
    manifest = {}
    for key, folder in (("cv", "cv"), ("resume", "resume")):
        pdfs = sorted((ROOT / "public" / "files" / folder).glob("*.pdf"))
        if pdfs:
            manifest[key] = render(pdfs[0])
            print(f"{key}: {pdfs[0].name}, {len(manifest[key])} pages")
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
