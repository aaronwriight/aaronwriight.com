"""Plot handoff checks use synthetic PNGs and disposable Git repositories only."""
import importlib.util
import json
from pathlib import Path
import struct
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import zlib

spec = importlib.util.spec_from_file_location("tidytuesday", Path(__file__).with_name("tidytuesday.py"))
plots = importlib.util.module_from_spec(spec)
spec.loader.exec_module(plots)


def chunk(kind, body):
    return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body) & 0xffffffff)


def png():
    return (plots.PNG_SIGNATURE + chunk(b"IHDR", struct.pack(">IIBBBBB", 2, 1, 8, 2, 0, 0, 0))
            + chunk(b"tEXt", b"Comment\x00local-only metadata")
            + chunk(b"IDAT", zlib.compress(b"\x00\xff\x00\x00\x00\xff\x00")) + chunk(b"IEND", b""))


class PlotHandoffTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.site = self.base / "site"
        self.source = self.base / "source"
        self.source.mkdir()
        self.catalog = self.site / "content/tidy-tuesday/plots.json"
        self.catalog.parent.mkdir(parents=True)
        self.catalog.write_text("[]\n")
        (self.source / "analysis.qmd").write_text("# Synthetic fixture\n")
        self.original = png()
        (self.source / "plot.png").write_bytes(self.original)
        self.git("init", "-q")
        self.git("remote", "add", "origin", plots.REPOSITORY)
        self.git("add", "analysis.qmd")
        self.git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "commit.gpgsign=false", "commit", "-qm", "Fixture")
        self.manifest = self.base / "plot.json"
        self.data = {"slug": "synthetic-plot", "title": "Synthetic <plot>", "date": "2026-10-06",
                     "description": "A test only.", "caption": "Synthetic chart.", "alt": "Red and green squares.",
                     "image": "plot.png", "source": "analysis.qmd", "datasetUrl": "https://example.org/dataset"}
        self.write_manifest()

    def git(self, *args):
        subprocess.run(["git", "-C", str(self.source), *args], check=True, capture_output=True)

    def write_manifest(self):
        self.manifest.write_text(json.dumps(self.data))

    def review(self):
        return plots.review(self.manifest, self.source, self.site)

    def publish(self, reviewed, **kwargs):
        return plots.publish(self.manifest, self.source, reviewed, root=self.site, **kwargs)

    def test_review_is_private_escaped_and_preserves_source(self):
        reviewed = self.review()
        self.assertEqual(self.catalog.read_text(), "[]\n")
        self.assertFalse((self.site / "public").exists())
        self.assertEqual((self.source / "plot.png").read_bytes(), self.original)
        self.assertNotIn(b"local-only metadata", (reviewed / "plot.png").read_bytes())
        self.assertIn("Synthetic &lt;plot&gt;", (reviewed / "index.html").read_text())
        record = json.loads((reviewed / "record.json").read_text())
        self.assertEqual((record["width"], record["height"]), (2, 1))
        self.assertEqual(record["provenance"]["originalImageSha256"], plots.digest(self.original))

    def test_dry_run_and_explicit_publish(self):
        reviewed = self.review()
        self.publish(reviewed, dry_run=True)
        self.assertFalse((self.site / "public").exists())
        with self.assertRaisesRegex(plots.PlotError, "--yes"):
            self.publish(reviewed)
        self.publish(reviewed, yes=True)
        record = json.loads(self.catalog.read_text())[0]
        self.assertEqual((self.site / "public" / record["image"].lstrip("/")).read_bytes(), (reviewed / "plot.png").read_bytes())
        self.assertIn("/blob/", record["sourceUrl"])
        with self.assertRaisesRegex(plots.PlotError, "already exists"):
            self.publish(reviewed, yes=True)

    def test_changed_manifest_requires_new_review(self):
        reviewed = self.review()
        self.data["caption"] = "Updated caption"
        self.write_manifest()
        with self.assertRaisesRegex(plots.PlotError, "changed"):
            self.publish(reviewed, yes=True)

    def test_changed_image_requires_new_review(self):
        reviewed = self.review()
        image = self.original.replace(chunk(b"tEXt", b"Comment\x00local-only metadata"), b"")
        (self.source / "plot.png").write_bytes(image)
        with self.assertRaisesRegex(plots.PlotError, "changed"):
            self.publish(reviewed, yes=True)

    def test_uncommitted_source_is_blocked(self):
        (self.source / "analysis.qmd").write_text("Revised code\n")
        with self.assertRaisesRegex(plots.PlotError, "Commit"):
            self.review()

    def test_source_traversal_and_symlink_escape_are_blocked(self):
        outside = self.base / "outside.qmd"
        outside.write_text("not a plot")
        (self.source / "escape.qmd").symlink_to(outside)
        for value in ("../outside.qmd", str(outside), "escape.qmd", ".git/config"):
            with self.subTest(value=value):
                self.data["source"] = value
                self.write_manifest()
                with self.assertRaises(plots.PlotError):
                    self.review()

    def test_destination_symlink_is_blocked(self):
        reviewed = self.review()
        (self.site / "public").symlink_to(self.source, target_is_directory=True)
        with self.assertRaisesRegex(plots.PlotError, "symlinks"):
            self.publish(reviewed, yes=True)

    def test_review_tampering_is_blocked(self):
        reviewed = self.review()
        (reviewed / "plot.png").write_bytes(b"changed")
        with self.assertRaisesRegex(plots.PlotError, "changed"):
            self.publish(reviewed, yes=True)

    def test_failed_catalog_promotion_rolls_back_new_asset(self):
        reviewed = self.review()
        with patch.object(plots.os, "replace", side_effect=OSError("fixture failure")):
            with self.assertRaises(OSError):
                self.publish(reviewed, yes=True)
        self.assertFalse((self.site / "public/images/tidy-tuesday/synthetic-plot").exists())
        self.assertEqual(self.catalog.read_text(), "[]\n")

    def test_invalid_png_and_unsupported_format_are_blocked(self):
        for data in (b"<svg></svg>", self.original[:-1], self.original + b"extra", self.original.replace(b"IDAT", b"JUNK")):
            with self.subTest(data=data[:20]):
                with self.assertRaises(plots.PlotError):
                    plots.clean_png(data)
        self.data["image"] = "plot.svg"
        (self.source / "plot.svg").write_text("<svg/>")
        self.write_manifest()
        with self.assertRaisesRegex(plots.PlotError, "must be .png"):
            self.review()

    def test_metadata_and_urls_are_validated(self):
        for key, value in (("slug", "../oops"), ("date", "2026-02-30"), ("alt", ""),
                           ("datasetUrl", "javascript:alert(1)"), ("datasetUrl", "https://user:secret@example.org"),
                           ("datasetUrl", "https://example.org?token=secret")):
            with self.subTest(key=key, value=value):
                original = self.data[key]
                self.data[key] = value
                self.write_manifest()
                with self.assertRaises(plots.PlotError):
                    self.review()
                self.data[key] = original

    def test_png_palette_and_transparency_reject_malformed_published_assets(self):
        header = plots.PNG_SIGNATURE + chunk(b"IHDR", struct.pack(">IIBBBBB", 2, 1, 8, 3, 0, 0, 0))
        palette = chunk(b"PLTE", b"\xff\x00\x00\x00\xff\x00")
        transparency = chunk(b"tRNS", b"\x00\xff")
        pixels = chunk(b"IDAT", zlib.compress(b"\x00\x00\x01"))
        end = chunk(b"IEND", b"")
        valid = header + palette + transparency + pixels + end
        self.assertEqual(plots.clean_png(valid), (valid, 2, 1))
        malformed = (
            chunk(b"PLTE", b"") + pixels,
            chunk(b"PLTE", b"\x00\x00") + pixels,
            chunk(b"PLTE", b"\x00" * 771) + pixels,
            palette + palette + pixels,
            pixels + palette,
            transparency + palette + pixels,
            palette + chunk(b"tRNS", b"\xff" * 3) + pixels,
            palette + transparency + transparency + pixels,
            palette + pixels + transparency,
        )
        for chunks in malformed:
            with self.subTest(chunks=chunks[:24]):
                with self.assertRaises(plots.PlotError):
                    plots.clean_png(header + chunks + end)

    def test_png_transparency_and_palette_match_the_declared_color_type(self):
        for color, channels, invalid_chunk in (
            (0, 1, chunk(b"PLTE", b"\x00\x00\x00")),
            (2, 3, chunk(b"tRNS", b"\x00")),
            (4, 2, chunk(b"tRNS", b"\x00\x00")),
            (6, 4, chunk(b"tRNS", b"\x00" * 6)),
        ):
            with self.subTest(color=color):
                data = (plots.PNG_SIGNATURE + chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, color, 0, 0, 0))
                        + invalid_chunk + chunk(b"IDAT", zlib.compress(b"\x00" * (channels + 1)))
                        + chunk(b"IEND", b""))
                with self.assertRaises(plots.PlotError):
                    plots.clean_png(data)

    def test_new_reviews_do_not_replace_previous_reviews(self):
        first, second = self.review(), self.review()
        self.assertNotEqual(first, second)
        self.assertTrue((first / "index.html").is_file())


if __name__ == "__main__":
    unittest.main()
