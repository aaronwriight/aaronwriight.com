#!/usr/bin/env python3
"""Write content/photography/stamps.json: the capture date of each published photograph, for the retro date stamps.

Published images carry no metadata (scripts/photography.py strips it). This reads only the capture date from the
original files on this computer and records it, as a date with no time, against the published image path:

    {"/images/photography/graduation/<hash>.jpg": "2023-05-01", ...}

A published image is matched to its draft in .photography-workspace by content hash, and the draft to its original
(any file with the same name under the originals folder, the camera JPEG or raw) by name. Photographs it cannot date
simply get no stamp. Run it after publishing new photographs:

    python3 scripts/photo_stamps.py [--originals ~/Desktop/life/photography]
"""

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLISHED = ROOT / "content/photography/published.json"
WORKSPACE = ROOT / ".photography-workspace"
OUTPUT = ROOT / "content/photography/stamps.json"
DATE_TAKEN, DATE_TIME, EXIF_IFD = 36867, 306, 0x8769


def capture_date(path):
    from PIL import Image
    try:
        with Image.open(path) as image:
            exif = image.getexif()
            value = exif.get_ifd(EXIF_IFD).get(DATE_TAKEN) or exif.get(DATE_TIME)
    except Exception:
        return None
    if not value or len(value) < 10:
        return None
    return value[:10].replace(":", "-")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--originals", type=Path, default=Path.home() / "Desktop/life/photography")
    args = parser.parse_args()

    published = json.loads(PUBLISHED.read_text(encoding="utf-8"))
    by_hash = {Path(image["src"]).stem: image["src"] for gallery in published for image in gallery["images"]}
    drafts = {}
    for draft in WORKSPACE.glob("*/*.jpg"):
        src = by_hash.get(hashlib.sha256(draft.read_bytes()).hexdigest())
        if src:
            drafts[src] = draft.stem

    originals = {}
    for path in args.originals.rglob("*"):
        if path.is_file():
            originals.setdefault(path.stem, []).append(path)

    stamps = {}
    for src, stem in sorted(drafts.items()):
        # Camera JPEGs first: Pillow reads their dates; raw files are a fallback.
        for path in sorted(originals.get(stem, []), key=lambda p: p.suffix.lower() not in (".jpg", ".jpeg")):
            date = capture_date(path)
            if date:
                stamps[src] = date
                break

    OUTPUT.write_text(json.dumps(stamps, indent=2) + "\n", encoding="utf-8")
    print(f"{len(stamps)} of {len(by_hash)} published photographs dated; wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
