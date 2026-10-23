#!/usr/bin/env python3
"""Review an explicit plot handoff from the independent TidyTuesday repository.

No source writes, code execution, network requests, or automatic publishing.
See docs/tidytuesday-publishing.txt for the author workflow.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import struct
import subprocess
import sys
import tempfile
from datetime import date
from urllib.parse import quote, urlsplit
import zlib

ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = "https://github.com/aaronwriight/tidytuesday"
FIELDS = {"slug", "title", "date", "description", "caption", "alt", "image", "source", "datasetUrl"}
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


class PlotError(ValueError):
    pass


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def json_bytes(value: object) -> bytes:
    return (json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode()


def child(root: Path, relative: str, *, must_exist: bool = True) -> Path:
    """Keep both source reads and generated writes within their expected roots."""
    parts = PurePosixPath(relative)
    if parts.is_absolute() or not parts.parts or any(p in {"..", "."} or p.startswith(".") for p in parts.parts) or "\\" in relative:
        raise PlotError("Paths must be relative, without hidden components or traversal.")
    candidate = root / parts
    if not candidate.resolve().is_relative_to(root.resolve()):
        raise PlotError("Path escapes its allowed directory through a symlink.")
    if must_exist and not candidate.is_file():
        raise PlotError("A specified source file does not exist.")
    return candidate


def generated_root(root: Path, relative: str) -> Path:
    """Do not write through symlinked build/output directories."""
    candidate = root / relative
    cursor = candidate
    while cursor != root:
        if cursor.is_symlink():
            raise PlotError("Generated directories must not be symlinks.")
        cursor = cursor.parent
    return candidate


def clean_png(data: bytes) -> tuple[bytes, int, int]:
    """Validate a static 8-bit PNG and remove ancillary metadata without cropping."""
    if len(data) > 15 * 1024 * 1024 or not data.startswith(PNG_SIGNATURE):
        raise PlotError("Use a PNG no larger than 15 MiB.")
    offset, chunks, image_data, width, height = 8, [], [], 0, 0
    seen_end = False
    seen_idat = False
    idat_ended = False
    color = None
    palette_entries = None
    seen_transparency = False
    while offset < len(data):
        if offset + 12 > len(data):
            raise PlotError("Truncated PNG chunk.")
        length = struct.unpack(">I", data[offset:offset + 4])[0]
        end = offset + length + 12
        if end > len(data):
            raise PlotError("Truncated PNG data.")
        kind, body = data[offset + 4:offset + 8], data[offset + 8:end - 4]
        expected = struct.unpack(">I", data[end - 4:end])[0]
        if zlib.crc32(kind + body) & 0xffffffff != expected:
            raise PlotError("PNG checksum mismatch.")
        if not chunks and kind != b"IHDR":
            raise PlotError("PNG must begin with IHDR.")
        if kind in {b"acTL", b"fcTL", b"fdAT"}:
            raise PlotError("Export a static PNG; animations are not supported.")
        if kind == b"IHDR":
            if chunks or length != 13:
                raise PlotError("Invalid PNG header.")
            width, height, depth, color, compression, filtering, interlace = struct.unpack(">IIBBBBB", body)
            if not (1 <= width <= 10000 and 1 <= height <= 10000 and width * height <= 24_000_000):
                raise PlotError("PNG dimensions exceed the 24 megapixel/10,000 pixel limits.")
            if depth != 8 or color not in {0, 2, 3, 4, 6} or compression or filtering or interlace:
                raise PlotError("Export a non-interlaced, 8-bit static PNG.")
        elif kind == b"PLTE":
            if (palette_entries is not None or seen_idat or seen_transparency
                    or color in {0, 4} or not 3 <= length <= 768 or length % 3):
                raise PlotError("Invalid PNG palette length, color type, or chunk order.")
            palette_entries = length // 3
        elif kind == b"tRNS":
            if seen_transparency or seen_idat or color in {4, 6}:
                raise PlotError("Invalid PNG transparency color type or chunk order.")
            if ((color == 0 and length != 2) or (color == 2 and length != 6)
                    or (color == 3 and (palette_entries is None or length > palette_entries))):
                raise PlotError("Invalid PNG transparency length or palette.")
            seen_transparency = True
        elif kind == b"IDAT":
            if idat_ended:
                raise PlotError("PNG image data must be consecutive.")
            if color == 3 and palette_entries is None:
                raise PlotError("Indexed PNG requires a palette before its image data.")
            seen_idat = True
            image_data.append(body)
        elif seen_idat:
            idat_ended = True
        if kind == b"IEND":
            if length or end != len(data):
                raise PlotError("Unexpected bytes after PNG end.")
            seen_end = True
        if kind[0] & 32 == 0 and kind not in {b"IHDR", b"PLTE", b"IDAT", b"IEND"}:
            raise PlotError("Unsupported critical PNG chunk.")
        if kind in {b"IHDR", b"PLTE", b"tRNS", b"IDAT", b"IEND"}:
            chunks.append(data[offset:end])
        offset = end
    if not seen_end or not image_data:
        raise PlotError("Incomplete PNG.")
    if color == 3 and palette_entries is None:
        raise PlotError("Indexed PNG is missing its palette.")
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[color]
    stride = width * channels + 1
    size = height * stride
    decoder = zlib.decompressobj()
    try:
        pixels = decoder.decompress(b"".join(image_data), size + 1)
    except zlib.error as exc:
        raise PlotError("Invalid compressed PNG pixels.") from exc
    if len(pixels) != size or not decoder.eof or decoder.unused_data or any(pixels[i] > 4 for i in range(0, size, stride)):
        raise PlotError("Invalid PNG pixel data or scanlines.")
    return PNG_SIGNATURE + b"".join(chunks), width, height


def git(source_root: Path, *args: str) -> bytes:
    result = subprocess.run(["git", "-C", str(source_root), *args], capture_output=True)
    if result.returncode:
        raise PlotError("Provenance requires a Git checkout with the source file committed at HEAD.")
    return result.stdout


def prepare(manifest: Path, source_root: Path) -> tuple[dict, bytes, dict]:
    try:
        raw = manifest.read_bytes()
        data = json.loads(raw)
    except (OSError, ValueError) as exc:
        raise PlotError("Could not read valid plot JSON.") from exc
    if not isinstance(data, dict) or set(data) != FIELDS:
        raise PlotError("Plot JSON must contain exactly the fields in plot.example.json.")
    if any(not isinstance(v, str) or not v.strip() or len(v) > 2000 for v in data.values()):
        raise PlotError("All plot fields must be nonempty strings of at most 2,000 characters.")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", data["slug"]) or len(data["slug"]) > 100:
        raise PlotError("Slug must use lowercase letters, numbers, and single hyphens (max 100 characters).")
    try:
        if date.fromisoformat(data["date"]).isoformat() != data["date"]:
            raise ValueError
    except ValueError as exc:
        raise PlotError("Date must be YYYY-MM-DD.") from exc
    url = urlsplit(data["datasetUrl"])
    if (url.scheme != "https" or not url.hostname or url.username or url.password or url.query or url.fragment
            or any(c.isspace() or ord(c) < 32 for c in data["datasetUrl"])):
        raise PlotError("Dataset URL must be a public HTTPS URL without credentials, query, or fragment.")
    if not source_root.is_dir():
        raise PlotError("Source root must be an existing TidyTuesday checkout.")
    source_root = source_root.resolve()
    if Path(git(source_root, "rev-parse", "--show-toplevel").decode().strip()).resolve() != source_root:
        raise PlotError("Source root must be the top of the TidyTuesday Git checkout.")
    # Only the intended independent repository is a valid provenance destination.
    remote = git(source_root, "remote", "get-url", "origin").decode().strip()
    if remote not in {REPOSITORY, REPOSITORY + ".git", "git@github.com:aaronwriight/tidytuesday.git"}:
        raise PlotError("Source checkout origin must be aaronwriight/tidytuesday on GitHub.")
    source = child(source_root, data["source"])
    image_path = child(source_root, data["image"])
    if source.suffix.lower() not in {".qmd", ".r", ".py"} or image_path.suffix.lower() != ".png":
        raise PlotError("Source must be .qmd, .R, or .py; the rendered image must be .png.")
    revision = git(source_root, "rev-parse", "HEAD").decode().strip()
    source_bytes = source.read_bytes()
    if git(source_root, "show", f"{revision}:{data['source']}") != source_bytes:
        raise PlotError("Commit the reviewed analysis source in TidyTuesday before handing off a plot.")
    image_bytes = image_path.read_bytes()
    derivative, width, height = clean_png(image_bytes)
    record = {key: data[key] for key in ("slug", "title", "date", "description", "caption", "alt", "datasetUrl")}
    record.update({"image": f"/images/tidy-tuesday/{data['slug']}/plot.png", "width": width, "height": height,
                   "sourceUrl": f"{REPOSITORY}/blob/{revision}/{quote(data['source'], safe='/')}",
                   "provenance": {"repository": REPOSITORY, "revision": revision, "source": data["source"],
                                  "sourceSha256": digest(source_bytes), "originalImageSha256": digest(image_bytes),
                                  "publishedImageSha256": digest(derivative)}})
    receipt = {"manifestSha256": digest(raw), "recordSha256": digest(json_bytes(record)), "imageSha256": digest(derivative)}
    return record, derivative, receipt


def review(manifest: Path, source_root: Path, root: Path = ROOT) -> Path:
    record, derivative, receipt = prepare(manifest, source_root)
    review_root = generated_root(root, ".tidytuesday-review")
    review_root.mkdir(parents=True, exist_ok=True)
    # New versioned directory each time; never overwrite a prior review.
    folder = Path(tempfile.mkdtemp(prefix=record["slug"] + "-", dir=review_root))
    (folder / "plot.png").write_bytes(derivative)
    (folder / "record.json").write_bytes(json_bytes(record))
    (folder / "receipt.json").write_bytes(json_bytes(receipt))
    esc = html.escape
    preview = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local plot review</title>
<style>body{{max-width:70rem;margin:3rem auto;padding:0 1.5rem;font:18px/1.6 Georgia,serif;background:#faf9f5;color:#292524}}img{{max-width:100%;height:auto}}a{{color:#526300}}</style>
<p>Local review · not published</p><h1>{esc(record['title'])}</h1><p>{esc(record['description'])}</p><figure><img src="plot.png" alt="{esc(record['alt'])}"><figcaption>{esc(record['caption'])}</figcaption></figure>
<p><strong>Image description:</strong> {esc(record['alt'])}</p><p><a href="{esc(record['sourceUrl'])}">Analysis at recorded commit</a> · <a href="{esc(record['datasetUrl'])}">Dataset source</a></p></html>'''
    (folder / "index.html").write_text(preview)
    return folder


def publish(manifest: Path, source_root: Path, reviewed: Path, *, root: Path = ROOT, yes: bool = False, dry_run: bool = False) -> str:
    record, derivative, receipt = prepare(manifest, source_root)
    reviews = generated_root(root, ".tidytuesday-review")
    if not reviewed.resolve().is_relative_to(reviews.resolve()):
        raise PlotError("Use a review folder created by this site's review command.")
    try:
        if (json.loads((reviewed / "receipt.json").read_text()) != receipt
                or (reviewed / "record.json").read_bytes() != json_bytes(record)
                or (reviewed / "plot.png").read_bytes() != derivative):
            raise PlotError("The handoff or review changed. Create and inspect a fresh review.")
    except (OSError, json.JSONDecodeError) as exc:
        raise PlotError("Review files are missing or invalid. Run review first.") from exc
    catalog_path = generated_root(root, "content/tidy-tuesday/plots.json")
    target = generated_root(root, f"public/images/tidy-tuesday/{record['slug']}")
    catalog = json.loads(catalog_path.read_text())
    if not isinstance(catalog, list) or any(not isinstance(p, dict) or "slug" not in p for p in catalog):
        raise PlotError("Published plot catalog is malformed.")
    if target.exists() or any(p["slug"] == record["slug"] for p in catalog):
        raise PlotError("This slug already exists; publication never overwrites existing work.")
    if dry_run:
        return f"Ready: {record['slug']}; no public files written."
    if not yes:
        raise PlotError("Inspect the review, then pass --yes to explicitly stage public files.")
    catalog.append(record)
    catalog.sort(key=lambda p: (p["date"], p["slug"]), reverse=True)
    target.parent.mkdir(parents=True, exist_ok=True)
    # Stage on the same filesystem, then roll back assets if the catalog promotion fails.
    with tempfile.TemporaryDirectory(prefix=".plot-stage-", dir=target.parent) as staging:
        staged = Path(staging)
        asset = staged / "asset"
        asset.mkdir()
        (asset / "plot.png").write_bytes(derivative)
        staged_catalog = staged / "plots.json"
        staged_catalog.write_bytes(json_bytes(catalog))
        asset.rename(target)
        try:
            os.replace(staged_catalog, catalog_path)
        except BaseException:
            shutil.rmtree(target)
            raise
    return f"Staged public plot: {record['slug']}. Review the Git diff; commit/deploy separately."


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["validate", "review", "publish"])
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--source-root", type=Path, default=os.environ.get("TIDYTUESDAY_SOURCE_ROOT"))
    parser.add_argument("--review", type=Path, help="Previously inspected local review folder (publish only)")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--yes", action="store_true")
    args = parser.parse_args()
    try:
        if args.command != "publish" and (args.review or args.dry_run or args.yes):
            raise PlotError("--review, --dry-run, and --yes apply only to publish.")
        if not args.source_root:
            raise PlotError("Set TIDYTUESDAY_SOURCE_ROOT or pass --source-root explicitly.")
        if args.command == "validate":
            record, _, _ = prepare(args.manifest, args.source_root)
            print(f"Valid plot handoff: {record['slug']}; no files written.")
        elif args.command == "review":
            print(review(args.manifest, args.source_root) / "index.html")
        else:
            if not args.review:
                raise PlotError("Publish requires --review PATH from an inspected local review.")
            print(publish(args.manifest, args.source_root, args.review, yes=args.yes, dry_run=args.dry_run))
    except (PlotError, OSError, ValueError) as exc:
        print(f"Plot handoff failed: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
