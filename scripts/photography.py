#!/usr/bin/env python3
"""Local photography metadata + approved derivative review. Never reads a collection automatically."""
from __future__ import annotations

import argparse
import base64
import hashlib
import html
import io
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SLUG = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*\Z")
FIELDS = {"slug", "category", "title", "subtitle", "description", "visibility", "publicApproved", "picTimeUrl", "images"}
IMAGE_FIELDS = {"source", "alt", "caption", "shape", "portfolio"}


class PhotographyError(ValueError):
    pass


def output_path(root, *parts):
    path = root.joinpath(*parts)
    cursor = path
    while cursor != root:
        if cursor.is_symlink():
            raise PhotographyError("Generated review and public destinations must not be symlinks.")
        cursor = cursor.parent
    if not path.resolve().is_relative_to(root.resolve()):
        raise PhotographyError("Generated output must remain inside this site repository.")
    return path


def check_image_boundary(content, image_format):
    """Reject bytes outside the image container that decoders may silently ignore."""
    invalid = PhotographyError("Export a clean image without trailing data or a truncated container.")
    if image_format == "WEBP":
        if len(content) < 12 or content[:4] != b"RIFF" or int.from_bytes(content[4:8], "little") + 8 != len(content):
            raise invalid
    elif image_format == "PNG":
        offset = 8
        while offset + 12 <= len(content):
            size = int.from_bytes(content[offset:offset + 4], "big")
            end = offset + size + 12
            if end > len(content):
                raise invalid
            if content[offset + 4:offset + 8] == b"IEND":
                if size or end != len(content):
                    raise invalid
                return
            offset = end
        raise invalid
    elif image_format == "JPEG":
        if not content.startswith(b"\xff\xd8"):
            raise invalid
        offset = 2
        while offset < len(content):
            if content[offset] != 0xff:
                raise invalid
            while offset < len(content) and content[offset] == 0xff:
                offset += 1
            if offset >= len(content):
                raise invalid
            marker = content[offset]
            offset += 1
            if marker == 0xd9:
                if offset != len(content):
                    raise invalid
                return
            if marker in {0, 0xd8} or 0xd0 <= marker <= 0xd7 or offset + 2 > len(content):
                raise invalid
            if marker == 1:
                continue
            size = int.from_bytes(content[offset:offset + 2], "big")
            if size < 2 or offset + size > len(content):
                raise invalid
            offset += size
            if marker == 0xda:
                # Entropy-coded scans escape literal FF bytes and may contain
                # restart markers; progressive JPEGs have multiple such scans.
                while offset < len(content):
                    start = content.find(b"\xff", offset)
                    if start < 0:
                        raise invalid
                    offset = start + 1
                    while offset < len(content) and content[offset] == 0xff:
                        offset += 1
                    if offset >= len(content):
                        raise invalid
                    if content[offset] == 0 or 0xd0 <= content[offset] <= 0xd7:
                        offset += 1
                        continue
                    offset = start
                    break
        raise invalid


def atomic_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", dir=path.parent, delete=False, encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary = Path(handle.name)
    try:
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def safe_text(value, name, required=False, maximum=2000):
    if not isinstance(value, str) or len(value) > maximum or (required and not value.strip()):
        raise PhotographyError(f"{name} must be {'nonempty ' if required else ''}text, at most {maximum} characters.")
    return value.strip()


def validate(path):
    try:
        raw = path.read_bytes()
        data = json.loads(raw)
    except (OSError, ValueError):
        raise PhotographyError("Cannot read a valid gallery JSON file.") from None
    if not isinstance(data, dict) or set(data) != FIELDS:
        raise PhotographyError("Gallery fields must match the draft template; do not store client data here.")
    slug = safe_text(data["slug"], "slug", True, 80)
    if slug != data["slug"] or not SLUG.fullmatch(slug) or slug.startswith("study-"):
        raise PhotographyError("Use a lowercase hyphenated slug; study- is reserved for placeholders.")
    for key in ("category", "title", "subtitle", "description"):
        safe_text(data[key], key, key in ("category", "title", "description"))
    if data["visibility"] != "public":
        raise PhotographyError("Only public gallery metadata belongs in this pipeline. Deliver private galleries through Pic-Time.")
    if type(data["publicApproved"]) is not bool:
        raise PhotographyError("publicApproved must be true or false.")
    url = safe_text(data["picTimeUrl"], "picTimeUrl", maximum=500)
    if url:
        parsed = urlsplit(url)
        if (url != data["picTimeUrl"] or any(c.isspace() or ord(c) < 32 for c in url)
                or parsed.scheme != "https" or parsed.netloc != "frameitwrightphotography.pic-time.com"
                or parsed.query or parsed.fragment or parsed.username or parsed.password
                or not re.fullmatch(r"/[A-Za-z0-9/_-]*", parsed.path)
                or any(part.lower() in {"professional", "login", "invite", "invitation", "access", "admin"} for part in parsed.path.split("/"))):
            raise PhotographyError("Use an ordinary HTTPS public Pic-Time gallery URL on your host, without account paths, credentials, queries, or fragments.")
    if not isinstance(data["images"], list) or len(data["images"]) > 12:
        raise PhotographyError("images must be a list of at most 12 approved web derivatives.")
    assets = []
    digest = hashlib.sha256(raw)
    seen = set()
    for item in data["images"]:
        if not isinstance(item, dict) or set(item) != IMAGE_FIELDS:
            raise PhotographyError("Image fields must match the documented derivative template.")
        source = safe_text(item["source"], "source", True, 500)
        relative = Path(source)
        if relative.is_absolute() or ".." in relative.parts:
            raise PhotographyError("Image source must stay inside the gallery draft folder.")
        candidate = path.parent / relative
        resolved = candidate.resolve()
        if not resolved.is_relative_to(path.parent.resolve()) or candidate.is_symlink() or not resolved.is_file():
            raise PhotographyError("Image source must be an existing regular file inside the draft folder.")
        if resolved in seen:
            raise PhotographyError("An image can only appear once per gallery.")
        seen.add(resolved)
        extension = resolved.suffix.lower()
        expected = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG", ".webp": "WEBP"}.get(extension)
        if not expected or resolved.stat().st_size > 3 * 1024 * 1024:
            raise PhotographyError("Use JPEG, PNG, or WebP derivatives no larger than 3 MiB.")
        safe_text(item["alt"], "alt", True, 500)
        safe_text(item["caption"], "caption", maximum=1000)
        if item["shape"] not in ("portrait", "landscape", "square") or type(item["portfolio"]) is not bool:
            raise PhotographyError("Choose portrait, landscape, or square; portfolio must be true or false.")
        try:
            from PIL import Image, UnidentifiedImageError
        except ImportError:
            raise PhotographyError("Image validation requires Pillow; install the documented photography requirements.") from None
        content = resolved.read_bytes()
        check_image_boundary(content, expected)
        try:
            with Image.open(io.BytesIO(content)) as image:
                width, height = image.size
                if image.format != expected or getattr(image, "n_frames", 1) != 1:
                    raise PhotographyError("Image bytes must match the extension and contain one still image.")
                if not 1 <= width <= 8000 or not 1 <= height <= 8000:
                    raise PhotographyError("Image dimensions must be between 1 and 8000 pixels.")
                display_metadata = {"icc_profile", "jfif", "jfif_version", "jfif_unit", "jfif_density", "dpi",
                                    "progressive", "progression", "loop", "background", "duration",
                                    "transparency", "gamma", "srgb", "chromaticity", "aspect"}
                if image.getexif() or any(key.lower() not in display_metadata for key in image.info):
                    raise PhotographyError("Export a clean web derivative without EXIF, comments, or other source metadata first.")
            with Image.open(io.BytesIO(content)) as image:
                image.verify()
            with Image.open(io.BytesIO(content)) as image:
                image.load()
        except (UnidentifiedImageError, OSError, SyntaxError, Image.DecompressionBombError):
            raise PhotographyError("An image could not be decoded safely.") from None
        asset_hash = hashlib.sha256(content).hexdigest()
        digest.update(content)
        assets.append({"bytes": content, "extension": extension, "hash": asset_hash, "width": width, "height": height, "item": item})
    return data, assets, digest.hexdigest()


def review(path, root=ROOT):
    data, assets, digest = validate(path)
    folder = output_path(root, ".photography-workspace", "reviews", data["slug"])
    folder.mkdir(parents=True, exist_ok=True)
    esc = html.escape
    frames = []
    for asset in assets:
        item = asset["item"]
        mime = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}[asset["extension"]]
        encoded = base64.b64encode(asset["bytes"]).decode()
        frames.append(f'<figure><img src="data:{mime};base64,{encoded}" alt="{esc(item["alt"], quote=True)}"><figcaption>{esc(item["caption"])}<br>Alt: {esc(item["alt"])} · Portfolio: {item["portfolio"]}</figcaption></figure>')
    document = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Local gallery review</title><style>body{{max-width:900px;margin:3rem auto;padding:1rem;font:17px Georgia;line-height:1.6;background:#faf9f6;color:#292524}}img{{max-width:100%;max-height:65vh}}figure{{margin:2rem 0}}p{{overflow-wrap:anywhere}}</style><h1>{esc(data['title'])}</h1><p>LOCAL REVIEW — not published</p><p>{esc(data['category'])} · {esc(data['subtitle'])}</p><p>{esc(data['description'])}</p><p>Public Pic-Time destination: {esc(data['picTimeUrl']) or 'none'}</p><p>Public approval: {data['publicApproved']}</p>{''.join(frames) or '<p>No photographs selected. Metadata-only draft.</p>'}</html>'''
    output_path(root, ".photography-workspace", "reviews", data["slug"], "index.html").write_text(document, encoding="utf-8")
    atomic_json(output_path(root, ".photography-workspace", "reviews", data["slug"], "receipt.json"), {"digest": digest})
    return folder / "index.html"


def publish(path, root=ROOT, dry_run=False, confirm_public=False, replace=False):
    data, assets, digest = validate(path)
    if not data["publicApproved"] or not confirm_public:
        raise PhotographyError("Publication requires publicApproved: true and --confirm-public after checking consent and Pic-Time visibility.")
    receipt = output_path(root, ".photography-workspace", "reviews", data["slug"], "receipt.json")
    try:
        reviewed = json.loads(receipt.read_text()).get("digest")
    except (OSError, ValueError):
        reviewed = None
    if reviewed != digest:
        raise PhotographyError("Run review again: the manifest or image bytes have changed, or no review exists.")
    catalog_path = output_path(root, "content", "photography", "published.json")
    catalog = json.loads(catalog_path.read_text()) if catalog_path.exists() else []
    if any(item["slug"] == data["slug"] for item in catalog) and not replace:
        raise PhotographyError("This gallery already exists. Review the changes and use --replace explicitly.")
    record = {key: data[key] for key in ("slug", "category", "title", "subtitle", "description", "picTimeUrl")}
    record["images"] = []
    destinations = []
    for asset in assets:
        relative = f'/images/photography/{data["slug"]}/{asset["hash"]}{asset["extension"]}'
        destination = output_path(root, "public", relative.lstrip("/"))
        if not destination.resolve().is_relative_to((root / "public").resolve()):
            raise PhotographyError("Public destination escapes the public directory.")
        if destination.exists() and destination.read_bytes() != asset["bytes"]:
            raise PhotographyError("An existing derivative conflicts with its content hash.")
        destinations.append((destination, asset["bytes"]))
        record["images"].append({"src": relative, "width": asset["width"], "height": asset["height"], **{key: asset["item"][key] for key in ("alt", "caption", "shape", "portfolio")}})
    if dry_run:
        return record
    created = []
    try:
        for destination, content in destinations:
            destination.parent.mkdir(parents=True, exist_ok=True)
            if not destination.exists():
                with destination.open("xb") as handle:
                    handle.write(content)
                created.append(destination)
        atomic_json(catalog_path, [item for item in catalog if item["slug"] != data["slug"]] + [record])
    except Exception:
        for destination in created:
            destination.unlink(missing_ok=True)
        raise
    return record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    draft = commands.add_parser("draft")
    draft.add_argument("slug")
    for name in ("check", "review", "publish"):
        command = commands.add_parser(name)
        command.add_argument("manifest", type=Path)
        if name == "publish":
            command.add_argument("--dry-run", action="store_true")
            command.add_argument("--confirm-public", action="store_true")
            command.add_argument("--replace", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "draft":
            if not SLUG.fullmatch(args.slug) or args.slug.startswith("study-"):
                raise PhotographyError("Use a lowercase hyphenated slug; study- is reserved.")
            path = output_path(ROOT, ".photography-workspace", args.slug, "gallery.json")
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("x", encoding="utf-8") as handle:
                json.dump({"slug": args.slug, "category": "photography", "title": "Untitled collection", "subtitle": "", "description": "A collection in progress.", "visibility": "public", "publicApproved": False, "picTimeUrl": "", "images": []}, handle, indent=2)
                handle.write("\n")
            print(f"Draft created: {path.relative_to(ROOT)}")
        elif args.command == "check":
            data, assets, _ = validate(args.manifest)
            print(f"Valid draft: {len(assets)} derivatives. Public approval: {data['publicApproved']}. Nothing published.")
        elif args.command == "review":
            print(f"Open this private local file to review: {review(args.manifest)}")
        else:
            record = publish(args.manifest, dry_run=args.dry_run, confirm_public=args.confirm_public, replace=args.replace)
            print(f"{'Would stage' if args.dry_run else 'Staged'} {len(record['images'])} images and public gallery metadata. {'No files changed.' if args.dry_run else 'Review the git diff before committing/deploying.'}")
    except (PhotographyError, OSError, ValueError) as error:
        # Never echo file contents or upstream credential-bearing URLs.
        print(f"Photography: {error if isinstance(error, PhotographyError) else 'File operation failed; check the manifest and destination.'}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
