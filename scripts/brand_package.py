"""Builds the brand package: the four brands that share the topographic coffee cup.

    python3 scripts/brand_package.py

Every brand is the same mark with its own name, a line beneath it and one accent colour, which only ever draws the
short rule between the name and the line (never text). Run scripts/brand_assets.py first when the master drawing
changes; this script reads the same master at full resolution. The contour grounds under the cards and banners are
captured from the site by scripts/brand_grounds.mjs.

Writes, for each brand, public/brand/<slug>/ (served by the site):
- lockup.png, lockup-night.png                  the mark beside the name and line, on a transparent ground
- lockup-stacked.png, lockup-stacked-night.png  the mark above the name and line, centred
- wordmark.png, wordmark-night.png              the name alone
- card.jpg                                      the 1200x630 sharing image
- email-header.jpg                              1200x300, shown at 600x150 at the top of an email
and copies the card into the brand's section of the site (opengraph-image.jpg and twitter-image.jpg, with alt text),
so links to any page in that section share it. aaron wright also gets banner-linkedin.jpg and banner-bluesky.jpg,
and Frame It Wright Photography watermark-light.png and watermark-dark.png (the name for signing photographs).
public/brand/avatar.jpg is the mark on the contour ground for profile pictures, small enough to survive a circular
crop, and public/brand/email-header.jpg heads emails from the whole practice (the creative mailing list).

Then it assembles brand-package/, the local package (ignored by Git and replaced whole on every run, so keep nothing
of your own in it): the same files with the lockups, wordmarks and watermarks at the master drawing's full resolution,
the mark and the master identity, the cup alone, the icons, the contour grounds, the palette (CSS, JSON and an Adobe
swatch file), the fonts with their licence, and guide.html, a brand guide that opens offline.

Needs Pillow, NumPy and SciPy, and Cormorant Garamond, the site's face: BRAND_FONT_DIR, else the TeX Live copy.
"""

import html
import json
import math
import os
import shutil
import struct
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from brand_assets import cup_alone, read_master

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "brand"
PACKAGE = ROOT / "brand-package"
PACKAGE_TMP = ROOT / ".brand-package.tmp"  # built here, then moved over PACKAGE, so a failed run leaves the old one
GROUNDS = ROOT / "images" / "brand"
SECTIONS = ROOT / "src" / "app" / "(site)"
MASTER_DRAWING = ROOT / "images" / "logo_vmono.png"
FONT_DIR = Path(os.environ.get(
    "BRAND_FONT_DIR", "/usr/local/texlive/2024/texmf-dist/fonts/truetype/catharsis/cormorantgaramond"))
# The fonts' licence: beside the fonts, else where TeX Live keeps it.
FONT_LICENCE = [FONT_DIR / "OFL.txt", Path("/usr/local/texlive/2024/texmf-dist/doc/fonts/cormorantgaramond/OFL.txt")]
PACKAGE_FONTS = {"Regular": (400, "normal"), "Italic": (400, "italic"), "Medium": (500, "normal"),
                 "MediumItalic": (500, "italic"), "SemiBold": (600, "normal"), "SemiBoldItalic": (600, "italic")}
SITE = "https://aaronwriight.com"
PRINT_PPI = 300

# Ink and the secondary grey by day and at night (the design system's ink and ink-secondary).
INK = {"day": ("#1c1917", "#78716c"), "night": ("#f5f5f4", "#a8a29e")}
SUPERSAMPLE = 4  # text is set this many times larger, then reduced, for even letter spacing and smooth edges
TRACKING = 0.1  # the name's letter spacing in em, as the site sets "aaron wright"
CARD_MARK_BOX = (110, 155, 360, 320)  # where the mark sits on a card, as on the site's own sharing image
WEB_MARK_HEIGHT = 600  # the mark's height in the web lockups; every other measure in a lockup is in proportion
# Profile banners: the platform's size, and the share of the width kept clear on the left for the profile photo.
BANNERS = {"banner-linkedin.jpg": (1584, 396), "banner-bluesky.jpg": (3000, 1000)}
BANNER_CLEAR_LEFT = 0.4


@dataclass(frozen=True)
class Brand:
    slug: str
    title: str  # the brand's name in sentences, and its folder in the local package
    name: str  # the name as the lockups set it
    line: str
    accent: tuple[str, str] | None  # by day, at night; the master identity has none
    token: str | None  # the accent's token in the design system
    section: str | None  # the site section whose pages share this brand's card
    stacked: tuple[str, ...]  # the name broken into lines for cards and the stacked lockup
    tag: bool = False  # the site colours this brand's post tag in its accent
    banners: bool = False  # it has LinkedIn and Bluesky profiles


BRANDS = [
    Brand("aaron-wright", "aaron wright", "aaron wright", "cognitive scientist", ("#6f8200", "#b0bf59"),
          "brand-aaron-wright", "cognitive-science", ("aaron wright",), banners=True),
    Brand("scope-for-imagination", "Scope for Imagination", "scope for imagination", "a digital journal by aaron wright",
          ("#f4a825", "#f2be5c"), "brand-sfi", "scope-for-imagination", ("scope for", "imagination"), tag=True),
    Brand("venture", "Venture", "venture", "a field journal by aaron wright", ("#586e75", "#586e75"), "brand-venture",
          "venture", ("venture",), tag=True),
    Brand("frame-it-wright-photography", "Frame It Wright Photography", "frame it wright photography",
          "photo sessions with aaron wright", ("#954f72", "#c47fa3"), "brand-photography", "frame-it-wright-photography",
          ("frame it wright", "photography")),
]
# The whole practice, as the home page and the creative mailing list present it: no accent, no section of its own.
MASTER = Brand("master", "aaron wright", "aaron wright", "cognitive scientist, photographer, artist", None, None, None,
               ("aaron wright",))

# The colours brand files use, as the design system's tokens (tokens.json) have them: name, day, night, use.
PALETTE = [
    ("paper", "#ffffff", "#0c0a09", "The ground under everything."),
    ("paper-tint", "#f6f5f1", "#1c1917", "The one filled surface: photo frames and the night mat."),
    ("ink", INK["day"][0], INK["night"][0], "Names, titles and body text."),
    ("ink-secondary", INK["day"][1], INK["night"][1], "The line under a name, subtitles and descriptions."),
    ("rule", "#d6d3d1", "#44403c", "The one hairline."),
    ("olive", "#6f8200", "#b0bf59", "Links, hovers and the current page, in every brand."),
] + [(b.token, *b.accent,
      f"{b.title}'s accent: the rule under its name in its lockups, card and email header"
      + (", and its post tag" if b.tag else "") + ". Marks only, never text.")
     for b in BRANDS] + [
    ("contour-maroon", "#954f72", "#c47fa3", "The contour background's lines, stop 1 of 4 (lower left). Decorative lines only."),
    ("contour-orange", "#f4a825", "#f2be5c", "The contour background's lines, stop 2 of 4."),
    ("contour-olive", "#6f8200", "#b0bf59", "The contour background's lines, stop 3 of 4."),
    ("contour-cyan", "#2aa198", "#4fc3b6", "The contour background's lines, stop 4 of 4 (upper right)."),
]


def font(weight: str, size: float) -> ImageFont.FreeTypeFont:
    path = FONT_DIR / f"CormorantGaramond-{weight}.ttf"
    if not path.exists():
        raise SystemExit(f"Cormorant Garamond not found at {FONT_DIR}; set BRAND_FONT_DIR to a folder holding {path.name}")
    return ImageFont.truetype(str(path), round(size))


def text_mask(text: str, face: ImageFont.FreeTypeFont, tracking: float, pad: int) -> Image.Image:
    """The text as a coverage mask, letter-spaced by `tracking` em, in a box as tall as the face's ascent and descent.
    The first letter's origin is `pad` pixels in, and as much room is left after the last, so letters that reach past
    their own width (the serifs of v, p and y) are never cut off."""
    step = tracking * face.size
    ascent, descent = face.getmetrics()
    width = sum(face.getlength(c) for c in text) + step * (len(text) - 1)
    mask = Image.new("L", (math.ceil(width) + 2 * pad, ascent + descent))
    draw = ImageDraw.Draw(mask)
    x = float(pad)
    for c in text:
        draw.text((x, 0), c, font=face, fill=255)
        x += face.getlength(c) + step
    return mask


def ink_layer(mask: Image.Image, colour: str) -> Image.Image:
    """Solid colour shown through the mask, so light ink keeps clean edges on a transparent ground."""
    layer = Image.new("RGBA", mask.size, colour)
    layer.putalpha(mask)
    return layer


def name_block(lines: tuple[str, ...], line: str | None, accent: str | None, theme: str, size: float,
               align: str = "left") -> Image.Image:
    """The name, then the accent rule and the line beneath it, as one transparent image cropped to its ink.
    `size` is the name's size in pixels; everything else is in proportion to it."""
    s = size * SUPERSAMPLE
    pad = math.ceil(0.15 * s)  # room around each line of text for overhanging serifs; cropped off at the end
    ink, secondary = INK[theme]
    name_face = font("SemiBold", s)
    ascent = name_face.getmetrics()[0]
    pieces: list[tuple[Image.Image, int, int]] = []  # each piece, its x when left-aligned, and the y of its top
    baseline = ascent
    for index, text in enumerate(lines):
        if index:
            baseline += round(1.08 * s)
        pieces.append((ink_layer(text_mask(text, name_face, TRACKING, pad), ink), 0, baseline - ascent))
    y = baseline + round(0.42 * s)  # below the descenders
    if accent:
        rule = Image.new("RGBA", (round(0.9 * s), max(2 * SUPERSAMPLE, round(0.05 * s))), accent)
        pieces.append((rule, pad, y))  # starts where the text's first letter does
        y += rule.height
    if line:
        line_face = font("Medium", 0.46 * s)
        line_ascent = line_face.getmetrics()[0]
        x_height = line_face.getbbox("x", anchor="ls")[1] * -1
        # The line's x-height starts 0.3 em below the rule.
        top = y + round(0.3 * s) - (line_ascent - x_height)
        pieces.append((ink_layer(text_mask(line, line_face, 0.03, pad), secondary), 0, top))

    width = max(left + piece.width for piece, left, _ in pieces)
    height = max(top + piece.height for piece, _, top in pieces)
    block = Image.new("RGBA", (width, height))
    for piece, left, top in pieces:
        block.alpha_composite(piece, ((width - piece.width) // 2 if align == "center" else left, top))
    block = block.crop(block.getbbox())
    return block.resize((max(1, round(block.width / SUPERSAMPLE)), max(1, round(block.height / SUPERSAMPLE))), Image.LANCZOS)


def scaled(img: Image.Image, height: float) -> Image.Image:
    return img.resize((round(img.width * height / img.height), round(height)), Image.LANCZOS)


def fit_within(img: Image.Image, width: float, height: float) -> Image.Image:
    factor = min(width / img.width, height / img.height, 1.0)
    return img if factor == 1.0 else img.resize((round(img.width * factor), round(img.height * factor)), Image.LANCZOS)


def padded(img: Image.Image, pad: int) -> Image.Image:
    canvas = Image.new("RGBA", (img.width + 2 * pad, img.height + 2 * pad))
    canvas.alpha_composite(img, (pad, pad))
    return canvas


def side_by_side(mark: Image.Image, block: Image.Image, gap: int, pad: int = 0, ground: Image.Image | None = None) -> Image.Image:
    """The mark with the block beside it, vertically centred on each other, on `ground` (centred) or transparent."""
    width, height = mark.width + gap + block.width, max(mark.height, block.height)
    canvas = ground.copy() if ground else Image.new("RGBA", (width + 2 * pad, height + 2 * pad))
    x0, y0 = (canvas.width - width) // 2, (canvas.height - height) // 2
    canvas.alpha_composite(mark, (x0, y0 + (height - mark.height) // 2))
    canvas.alpha_composite(block, (x0 + mark.width + gap, y0 + (height - block.height) // 2))
    return canvas


def stacked(mark: Image.Image, block: Image.Image, gap: int, pad: int) -> Image.Image:
    width, height = max(mark.width, block.width), mark.height + gap + block.height
    canvas = Image.new("RGBA", (width + 2 * pad, height + 2 * pad))
    canvas.alpha_composite(mark, (pad + (width - mark.width) // 2, pad))
    canvas.alpha_composite(block, (pad + (width - block.width) // 2, pad + mark.height + gap))
    return canvas


def ground(width: int, height: int) -> Image.Image:
    return Image.open(GROUNDS / f"ground-{width}x{height}.png").convert("RGBA")


def accent(brand: Brand, theme: str) -> str | None:
    return brand.accent[0 if theme == "day" else 1] if brand.accent else None


def signatures(brand: Brand, marks: dict[str, Image.Image], mark_height: int) -> dict[str, Image.Image]:
    """The lockups and wordmarks by day and at night (and the photography watermarks), with the mark `mark_height`
    pixels tall. The measures below are for the web size and scale with it."""
    unit = mark_height / WEB_MARK_HEIGHT
    files = {}
    for theme, suffix in (("day", ""), ("night", "-night")):
        # Trimmed to its visible ink (not the faint haze around it), so a lockup's clear space is even on every side.
        visible = marks[theme].getchannel("A").point(lambda alpha: 255 if alpha > 8 else 0).getbbox()
        mark = scaled(marks[theme].crop(visible), mark_height)
        block = name_block((brand.name,), brand.line, accent(brand, theme), theme, 100 * unit)
        files[f"lockup{suffix}.png"] = side_by_side(mark, block, gap=round(72 * unit), pad=round(40 * unit))
        block = name_block(brand.stacked, brand.line, accent(brand, theme), theme, 100 * unit, align="center")
        files[f"lockup-stacked{suffix}.png"] = stacked(mark, block, gap=round(64 * unit), pad=round(40 * unit))
        files[f"wordmark{suffix}.png"] = padded(name_block((brand.name,), None, None, theme, 160 * unit), round(40 * unit))
    if brand.slug == "frame-it-wright-photography":
        mask = name_block((brand.name,), None, None, "day", 120 * unit).getchannel("A")
        for name, colour in (("watermark-light", "#ffffff"), ("watermark-dark", INK["day"][0])):
            files[f"{name}.png"] = padded(ink_layer(mask, colour), round(20 * unit))
    return files


def card(brand: Brand, day_mark: Image.Image) -> Image.Image:
    """The sharing image: the mark where the site's own card has it, the name and line beside it."""
    image = ground(1200, 630)
    x, y, w, h = CARD_MARK_BOX
    mark = fit_within(day_mark, w, h)
    image.alpha_composite(mark, (x + (w - mark.width) // 2, y + (h - mark.height) // 2))
    block = fit_within(name_block(brand.stacked, brand.line, accent(brand, "day"), "day", 64), 1200 - (x + w + 70) - 70, 400)
    image.alpha_composite(block, (x + w + 70, (630 - block.height) // 2))
    return image.convert("RGB")


def email_header(brand: Brand, day_mark: Image.Image) -> Image.Image:
    block = fit_within(name_block((brand.name,), brand.line, accent(brand, "day"), "day", 46), 760, 190)
    return side_by_side(scaled(day_mark, 200), block, gap=44, ground=ground(1200, 300)).convert("RGB")


def banner(brand: Brand, day_mark: Image.Image, width: int, height: int) -> Image.Image:
    """A profile banner: the lockup to the right, clear of the profile photo that both platforms lay over the left."""
    image = ground(width, height)
    unit = height / 396  # measures for the LinkedIn banner, scaled to the others
    block = name_block((brand.name,), brand.line, accent(brand, "day"), "day", 52 * unit)
    lockup = side_by_side(scaled(day_mark, 0.6 * height), block, gap=round(32 * unit))
    lockup = fit_within(lockup, width * (1 - BANNER_CLEAR_LEFT) - 0.06 * width, 0.7 * height)
    image.alpha_composite(lockup, (round(width * 0.94) - lockup.width, (height - lockup.height) // 2))
    return image.convert("RGB")


def build_web(brand: Brand, marks: dict[str, Image.Image]) -> None:
    out = OUT / brand.slug
    out.mkdir(parents=True, exist_ok=True)
    for name, image in signatures(brand, marks, WEB_MARK_HEIGHT).items():
        image.save(out / name, optimize=True)
    card(brand, marks["day"]).save(out / "card.jpg", quality=90, optimize=True, progressive=True)
    email_header(brand, marks["day"]).save(out / "email-header.jpg", quality=88, optimize=True, progressive=True)
    if brand.banners:
        for name, (width, height) in BANNERS.items():
            banner(brand, marks["day"], width, height).save(out / name, quality=90, optimize=True, progressive=True)

    section = SECTIONS / brand.section
    alt = f"{brand.name}: {brand.line}"
    for stem in ("opengraph-image", "twitter-image"):
        shutil.copyfile(out / "card.jpg", section / f"{stem}.jpg")
        (section / f"{stem}.alt.txt").write_text(alt)


def write_ase(path: Path, swatches: list[tuple[str, str]]) -> None:
    """An Adobe swatch exchange file (Photoshop, Illustrator, InDesign) of named RGB colours."""
    blocks = []
    for name, hex_colour in swatches:
        rgb = [int(hex_colour[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        # The name's length counts UTF-16 code units, including the closing null.
        body = struct.pack(">H", len(name) + 1) + (name + "\0").encode("utf-16-be") + b"RGB "
        body += struct.pack(">fff", *rgb) + struct.pack(">H", 2)  # 2: a normal (not global or spot) colour
        blocks.append(struct.pack(">HI", 0x0001, len(body)) + body)
    path.write_bytes(b"ASEF" + struct.pack(">HHI", 1, 0, len(blocks)) + b"".join(blocks))


def write_palette(folder: Path) -> None:
    folder.mkdir(parents=True)
    (folder / "palette.json").write_text(json.dumps(
        [{"name": name, "day": day, "night": night, "use": use} for name, day, night, use in PALETTE], indent=2) + "\n")
    day = "\n".join(f"  --{name}: {value};" for name, value, _, _ in PALETTE)
    night = "\n".join(f"  --{name}: {value};" for name, _, value, _ in PALETTE)
    (folder / "palette.css").write_text(
        "/* The brand palette, as the design system's tokens have it. Day on :root; night under .night. */\n"
        f":root {{\n{day}\n}}\n\n.night {{\n{night}\n}}\n")
    write_ase(folder / "palette.ase",
              [(f"{name} (day)", d) for name, d, _, _ in PALETTE] + [(f"{name} (night)", n) for name, _, n, _ in PALETTE])


def copy_fonts(folder: Path) -> list[str]:
    """Copies the fonts the files are set in, with their licence, and returns the weights copied: none if the licence
    cannot be found, since the fonts may only travel with it."""
    licence = next((path for path in FONT_LICENCE if path.exists()), None)
    weights = [w for w in PACKAGE_FONTS if (FONT_DIR / f"CormorantGaramond-{w}.ttf").exists()]
    if licence is None or not weights:
        print("brand-package/fonts skipped: the fonts or their licence (OFL.txt) were not found")
        return []
    folder.mkdir(parents=True)
    shutil.copyfile(licence, folder / "OFL.txt")
    for weight in weights:
        shutil.copyfile(FONT_DIR / f"CormorantGaramond-{weight}.ttf", folder / f"CormorantGaramond-{weight}.ttf")
    return weights


def save_print(image: Image.Image, path: Path) -> None:
    """A transparent PNG tagged at the print resolution, so layout software places it at its print size."""
    image.save(path, optimize=True, dpi=(PRINT_PPI, PRINT_PPI))


def build_package(marks: dict[str, Image.Image], cup: Image.Image) -> None:
    if PACKAGE_TMP.exists():
        shutil.rmtree(PACKAGE_TMP)
    build = PACKAGE_TMP
    full = marks["day"].height  # the master's own resolution: nothing is enlarged
    print_sizes: list[tuple[str, Image.Image]] = []

    mark_dir = build / "mark"
    (mark_dir / "icons").mkdir(parents=True)
    for name, image in (("mark.png", marks["day"]), ("mark-night.png", marks["night"]), ("cup.png", cup),
                        ("mark-grayscale.png", marks["day"].convert("LA"))):
        save_print(image, mark_dir / name)
        print_sizes.append((f"mark/{name}", image))
    shutil.copyfile(MASTER_DRAWING, mark_dir / "master-drawing.png")
    for name, image in signatures(MASTER, marks, full).items():
        save_print(image, mark_dir / name)
    shutil.copyfile(OUT / "email-header.jpg", mark_dir / "email-header.jpg")
    shutil.copyfile(OUT / "avatar.jpg", mark_dir / "avatar.jpg")
    shutil.copyfile(OUT / "og-image.jpg", mark_dir / "card.jpg")
    shutil.copyfile(ROOT / "public" / "favicon.ico", mark_dir / "icons" / "favicon.ico")
    for icon in ("icon-32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"):
        shutil.copyfile(OUT / icon, mark_dir / "icons" / icon)

    for brand in BRANDS:
        folder = build / brand.title
        folder.mkdir()
        for name, image in signatures(brand, marks, full).items():
            save_print(image, folder / name)
            if not name.startswith("wordmark") and "night" not in name:
                print_sizes.append((f"{brand.title}/{name}", image))
        names = ["card.jpg", "email-header.jpg"] + (list(BANNERS) if brand.banners else [])
        for name in names:
            shutil.copyfile(OUT / brand.slug / name, folder / name)

    (build / "grounds").mkdir()
    for path in sorted(GROUNDS.glob("ground-*.png")):
        shutil.copyfile(path, build / "grounds" / path.name)
    write_palette(build / "colors")
    fonts = copy_fonts(build / "fonts")
    sizes = [(path, f"{image.width / PRINT_PPI:.1f} × {image.height / PRINT_PPI:.1f} in") for path, image in print_sizes]
    (build / "guide.html").write_text(guide_html(fonts, sizes))
    (build / "README.md").write_text(readme(fonts, sizes))

    if PACKAGE.exists():
        shutil.rmtree(PACKAGE)
    build.rename(PACKAGE)


def file_rows(brand: Brand) -> list[tuple[str, str]]:
    rows = [
        ("lockup.png, lockup-night.png", "The default signature: documents, slide title pages, a CV or bio header."),
        ("lockup-stacked.png, lockup-stacked-night.png", "Square or upright spaces: posters, a cover page."),
        ("wordmark.png, wordmark-night.png", "The name alone, where the mark already appears nearby."),
        ("card.jpg", f"The 1200×630 sharing image; every page under {SITE}/{brand.section} shares it."),
        ("email-header.jpg", f"1200×300, shown at 600×150 at the top of an email. Link it by its web address once "
                             f"the site is deployed: {SITE}/brand/{brand.slug}/email-header.jpg"),
    ]
    if brand.banners:
        rows.append(("banner-linkedin.jpg, banner-bluesky.jpg",
                     "Profile banners at each platform's size (1584×396 and 3000×1000). The left 40% stays clear for "
                     "the profile photo the platforms lay over it."))
    if brand.slug == "frame-it-wright-photography":
        rows.append(("watermark-light.png, watermark-dark.png",
                     "The name for signing photographs: light on darker photographs, dark on light ones. "
                     "In a corner, away from the subject."))
    return rows


RULES = [
    "The topographic coffee cup is the mark of every brand. A brand is that mark with its own name, a line beneath "
    "the name and one accent colour. No brand gets its own drawing.",
    "Never recolour, redraw, crop or tint the mark. Use the night files on dark grounds; they dim the cup and turn the "
    "corners and dot to light ink.",
    "An accent draws marks only: the short rule under a brand's name, and the post tags of Scope for Imagination and "
    "Venture. Never set text in an accent (gold is 2.0:1 on paper). Links, hovers, the current page and map markers "
    "keep the site's own colours in every brand.",
    "Keep at least one name-height clear around a lockup. On screen, below 48px, show the cup alone (mark/cup.png), "
    "never a lockup; in print, below about half an inch (13 mm).",
    "Names are set lowercase in the lockups, as in the site's navigation; in sentences, brands keep their own case "
    "(Scope for Imagination, Venture, Frame It Wright Photography).",
    "The home page, the creative mailing list and anything else that speaks for the whole practice use the master "
    "identity: \"aaron wright\" over \"cognitive scientist, photographer, artist\", with no accent rule (in mark/).",
]

PRINT_NOTE = (
    f"Every file is RGB, made for screens. The transparent PNGs are tagged at {PRINT_PPI} ppi, so layout software "
    "places them at the sizes below; scale them down freely, but not up. Ask the printer to print the ink (#1c1917) "
    "as black only (100% K) rather than a four-colour black, so the mark's fine lines stay sharp, and give them "
    "mark/mark-grayscale.png, a one-channel copy of the mark, wherever it prints on its own.")


def readme(fonts: list[str], sizes: list[tuple[str, str]]) -> str:
    brand_lines = "\n".join(f"| {b.title} | {b.name} | {b.line} | `{b.token}` {b.accent[0]} / {b.accent[1]} |" for b in BRANDS)
    folders = "\n".join(
        f"- `{b.title}/`: its lockups, wordmarks, sharing card and email header"
        + (", and its LinkedIn and Bluesky banners" if b.banners else "")
        + (", and the photograph watermarks" if b.slug == "frame-it-wright-photography" else "")
        for b in BRANDS)
    font_line = (f"- `fonts/`: Cormorant Garamond ({', '.join(fonts)}), the face every name and line is set in, with "
                 "its licence (SIL Open Font License)\n" if fonts else "")
    rules = "\n".join(f"- {rule}" for rule in RULES)
    size_rows = "\n".join(f"| `{path}` | {size} |" for path, size in sizes)
    return f"""# aaron wright: brand package

Open `guide.html` for the visual guide; it works offline.

| Brand | Name as set | Line | Accent (day / night) |
| --- | --- | --- | --- |
{brand_lines}

The home page and the creative mailing list use the master identity, "aaron wright" over "{MASTER.line}",
with no accent.

## What's here

{folders}
- `mark/`: the mark at full resolution (`mark.png`, `mark-night.png`, `mark-grayscale.png`), the cup alone (`cup.png`),
  the master drawing, the master identity's lockups, wordmarks and email header, the shared profile picture
  (`avatar.jpg`), the master sharing card (`card.jpg`) and the site and app icons
- `grounds/`: the contour backgrounds under the cards, headers and banners, at screen resolution
- `colors/`: the palette as CSS (`palette.css`), JSON (`palette.json`) and an Adobe swatch file (`palette.ase`)
{font_line}
Lockups, wordmarks and watermarks here are at the master drawing's full resolution; the web copies in the site's
`public/brand/` are smaller. Transparent files are PNG; cards, headers, banners and the profile picture are JPG.

## Rules

{rules}

## Print

{PRINT_NOTE}

| File | Largest print size at {PRINT_PPI} ppi |
| --- | --- |
{size_rows}

## Rebuilding

Everything here is generated. Run `python3 scripts/brand_assets.py` (when the master drawing changes), then
`python3 scripts/brand_package.py`, in the site repository. This folder is replaced whole on every run, so keep
nothing of your own in it. Each brand's name, line, accent and site section are in the `BRANDS` table at the top of
`scripts/brand_package.py`.
"""


def guide_html(fonts: list[str], sizes: list[tuple[str, str]]) -> str:
    e = html.escape

    def img(src: str, alt: str, ground: str = "day") -> str:
        return f'<figure class="tile {ground}"><img src="{e(src)}" alt="{e(alt)}" loading="lazy"><figcaption>{e(src)}</figcaption></figure>'

    def signature_tiles(folder: str, title: str) -> list[str]:
        return [img(f"{folder}/lockup.png", f"{title} lockup by day"),
                img(f"{folder}/lockup-night.png", f"{title} lockup at night", "night"),
                img(f"{folder}/lockup-stacked.png", f"{title} stacked lockup by day"),
                img(f"{folder}/lockup-stacked-night.png", f"{title} stacked lockup at night", "night"),
                img(f"{folder}/wordmark.png", f"{title} wordmark by day"),
                img(f"{folder}/wordmark-night.png", f"{title} wordmark at night", "night")]

    sections = []
    for b in BRANDS:
        folder = b.title
        rows = "".join(f"<tr><td><code>{'<br>'.join(e(name) for name in f.split(', '))}</code></td><td>{e(use)}</td></tr>"
                       for f, use in file_rows(b))
        tiles = signature_tiles(folder, b.title)
        if b.slug == "frame-it-wright-photography":
            tiles += [img(f"{folder}/watermark-light.png", "White watermark", "photo"),
                      img(f"{folder}/watermark-dark.png", "Dark watermark")]
        wide = [img(f"{folder}/card.jpg", f"{b.title} sharing card"), img(f"{folder}/email-header.jpg", f"{b.title} email header")]
        if b.banners:
            wide += [img(f"{folder}/{name}", f"{b.title} {name.split('-')[1].split('.')[0]} banner") for name in BANNERS]
        sections.append(f"""
<section id="{b.slug}">
  <h2>{e(b.title)}</h2>
  <p class="lede"><span class="rule" style="background:{b.accent[0]}"></span>{e(b.name)} · <em>{e(b.line)}</em></p>
  <dl class="facts">
    <dt>accent</dt><dd><span class="chip" style="background:{b.accent[0]}"></span>{b.accent[0]} by day <span class="chip" style="background:{b.accent[1]}"></span>{b.accent[1]} at night · <code>{b.token}</code></dd>
    <dt>on the site</dt><dd>{e(SITE)}/{e(b.section)}</dd>
  </dl>
  <div class="wide">{"".join(wide)}</div>
  <div class="grid">{"".join(tiles)}</div>
  <table><thead><tr><th>file</th><th>use</th></tr></thead><tbody>{rows}</tbody></table>
</section>""")

    swatches = "".join(
        f'<tr><td><code>{e(name)}</code></td><td><span class="chip" style="background:{day}"></span>{day}</td>'
        f'<td><span class="chip" style="background:{night}"></span>{night}</td><td>{e(use)}</td></tr>'
        for name, day, night, use in PALETTE)
    size_rows = "".join(f"<tr><td><code>{e(path)}</code></td><td>{e(size)}</td></tr>" for path, size in sizes)
    rules = "".join(f"<li>{e(rule)}</li>" for rule in RULES)
    font_faces = "".join(
        f'@font-face{{font-family:"Cormorant Garamond";src:url("fonts/CormorantGaramond-{w}.ttf");'
        f'font-weight:{PACKAGE_FONTS[w][0]};font-style:{PACKAGE_FONTS[w][1]}}}'
        for w in fonts)
    font_note = ", in <code>fonts/</code> with its licence" if fonts else ""
    toc = "".join(f'<a href="#{b.slug}">{e(b.title)}</a>' for b in BRANDS)

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>aaron wright brand package</title>
<style>
{font_faces}
:root {{ --paper:#ffffff; --ink:#1c1917; --secondary:#78716c; --rule:#d6d3d1; --olive:#6f8200; --night:#0c0a09; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--paper); color: var(--ink); font: 500 16px/1.6 "Cormorant Garamond", Baskerville, Georgia, serif; }}
main {{ max-width: 64rem; margin: 0 auto; padding: 48px max(16px, 4vw) 96px; }}
header {{ display: flex; gap: 24px; align-items: center; border-bottom: 1px solid var(--rule); padding-bottom: 24px; }}
header img {{ width: 96px; height: auto; flex: none; }}
h1 {{ margin: 0; font-size: 1.25rem; font-weight: 600; letter-spacing: 0.1em; text-transform: lowercase; }}
h2 {{ margin: 0 0 4px; font-size: 1.1rem; font-weight: 600; letter-spacing: 0.1em; text-transform: lowercase; }}
p, li {{ max-width: 42rem; }}
.sub {{ margin: 4px 0 0; color: var(--secondary); }}
nav {{ display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 20px 0 0; font-size: 0.95rem; }}
a {{ color: var(--olive); text-underline-offset: 0.2em; }}
section {{ border-bottom: 1px solid var(--rule); padding: 40px 0; }}
.lede {{ margin: 0 0 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; color: var(--secondary); }}
.lede em {{ font-style: italic; }}
.rule {{ display: inline-block; width: 28px; height: 2px; }}
.facts {{ display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 2px 16px; margin: 0 0 20px; font-size: 0.95rem; }}
.facts dt {{ color: var(--secondary); }}
.facts dd {{ margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; overflow-wrap: anywhere; }}
.chip {{ display: inline-block; width: 14px; height: 14px; border: 1px solid var(--rule); vertical-align: -2px; margin-right: 4px; }}
.wide {{ display: grid; gap: 16px; margin-bottom: 16px; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 16px; }}
.tile {{ margin: 0; border: 1px solid var(--rule); padding: 16px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }}
.tile img {{ display: block; max-width: 100%; max-height: 260px; width: auto; height: auto; margin: auto; object-fit: contain; }}
.wide .tile img {{ max-height: none; width: 100%; }}
.tile figcaption {{ font-size: 0.8rem; color: var(--secondary); overflow-wrap: anywhere; }}
.tile.night {{ background: var(--night); border-color: var(--night); }}
.tile.night figcaption {{ color: #a8a29e; }}
.tile.photo {{ background: linear-gradient(135deg, #3d4a3f, #6b5a4a); border-color: transparent; }}
.tile.photo figcaption {{ color: #e7e5e4; }}
.icons {{ display: flex; flex-wrap: wrap; align-items: flex-end; gap: 16px; }}
.icons img {{ border: 1px solid var(--rule); }}
table {{ width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.95rem; }}
th, td {{ text-align: left; vertical-align: top; padding: 6px 12px 6px 0; border-top: 1px solid var(--rule); overflow-wrap: anywhere; }}
th {{ font-weight: 600; color: var(--secondary); }}
code {{ font: 0.85em ui-monospace, SFMono-Regular, Menlo, monospace; }}
.type .name {{ font-size: 2.6rem; font-weight: 600; letter-spacing: 0.1em; line-height: 1.2; margin: 0; }}
.type .line {{ font-size: 1.2rem; color: var(--secondary); letter-spacing: 0.03em; margin: 0; }}
.scroll {{ overflow-x: auto; }}
</style>
</head>
<body>
<main>
<header>
  <img src="mark/mark.png" alt="The topographic coffee cup">
  <div>
    <h1>aaron wright · brand package</h1>
    <p class="sub">one mark, four names: the cognitive science brand, Scope for Imagination, Venture and Frame It Wright Photography</p>
  </div>
</header>
<nav aria-label="Sections">{toc}<a href="#master">master identity</a><a href="#mark">mark</a><a href="#colors">colors</a><a href="#type">type</a><a href="#print">print</a><a href="#rules">rules</a></nav>
{"".join(sections)}
<section id="master">
  <h2>master identity</h2>
  <p class="lede">{e(MASTER.name)} · <em>{e(MASTER.line)}</em></p>
  <p>For the home page, the creative mailing list and anything that speaks for the whole practice. No accent rule. The files are in <code>mark/</code>.</p>
  <div class="wide">{img("mark/card.jpg", "The master sharing card")}{img("mark/email-header.jpg", "The master email header")}</div>
  <div class="grid">{"".join(signature_tiles("mark", "Master identity"))}</div>
</section>
<section id="mark">
  <h2>mark</h2>
  <p>The topographic coffee cup, hand-inked in black: a cup seen from above, its surface a contour map that folds like a brain, inside fine viewfinder corners with one dot. <code>mark/master-drawing.png</code> is the original drawing; <code>mark/cup.png</code> is the cup alone, for small sizes.</p>
  <div class="grid">{img("mark/mark.png", "The mark by day")}{img("mark/mark-night.png", "The mark at night", "night")}{img("mark/cup.png", "The cup alone")}{img("mark/avatar.jpg", "Profile picture")}</div>
  <p>Icons, for browser tabs and home screens:</p>
  <div class="icons"><img src="mark/icons/icon-32.png" width="32" height="32" alt="32px icon"><img src="mark/icons/apple-touch-icon.png" width="90" height="90" alt="Apple touch icon"><img src="mark/icons/icon-192.png" width="96" height="96" alt="192px icon"><img src="mark/icons/icon-512.png" width="128" height="128" alt="512px icon"></div>
</section>
<section id="colors">
  <h2>colors</h2>
  <p>In <code>colors/</code> as CSS, JSON and an Adobe swatch file (<code>palette.ase</code>).</p>
  <div class="scroll"><table><thead><tr><th>token</th><th>day</th><th>night</th><th>use</th></tr></thead><tbody>{swatches}</tbody></table></div>
</section>
<section id="type" class="type">
  <h2>type</h2>
  <p>Every name and line is set in Cormorant Garamond{font_note}. Names: SemiBold, lowercase, letter-spaced 0.1em, in ink. Lines: Medium at 0.46 of the name's size, letter-spaced 0.03em, in the secondary grey.</p>
  <p class="name">scope for imagination</p>
  <p class="line">a digital journal by aaron wright</p>
</section>
<section id="print">
  <h2>print</h2>
  <p>{e(PRINT_NOTE)}</p>
  <div class="scroll"><table><thead><tr><th>file</th><th>largest print size at {PRINT_PPI} ppi</th></tr></thead><tbody>{size_rows}</tbody></table></div>
</section>
<section id="rules">
  <h2>rules</h2>
  <ul>{rules}</ul>
  <p>Everything here is generated by <code>scripts/brand_package.py</code> in the site repository and replaced whole on every run.</p>
</section>
</main>
</body>
</html>
"""


def main() -> None:
    day, night, day_drawing, cup_shape, cup_mask = read_master()
    marks = {"day": day, "night": night}
    for brand in BRANDS:
        build_web(brand, marks)

    # One profile picture for every brand: the mark, at under 0.7 of the side, keeps its corners inside a circle.
    avatar = ground(1080, 1080)
    mark = fit_within(day, 1080 * 0.6, 1080 * 0.6)
    avatar.alpha_composite(mark, ((1080 - mark.width) // 2, (1080 - mark.height) // 2))
    avatar.convert("RGB").save(OUT / "avatar.jpg", quality=92, optimize=True, progressive=True)
    email_header(MASTER, day).save(OUT / "email-header.jpg", quality=88, optimize=True, progressive=True)

    build_package(marks, cup_alone(day_drawing, cup_shape, cup_mask))
    print(f"wrote public/brand/<{', '.join(b.slug for b in BRANDS)}>/, public/brand/avatar.jpg and email-header.jpg, "
          f"each section's sharing card and {PACKAGE.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
