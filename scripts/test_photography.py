"""Synthetic-only validation of public-photo publication boundaries."""
import json
from pathlib import Path
import tempfile
import unittest
from PIL import Image

import photography


class PhotographyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.draft = self.root / "draft"
        self.draft.mkdir()
        self.path = self.draft / "gallery.json"
        Image.new("RGB", (20, 30), "white").save(self.draft / "chosen.png")
        self.data = {"slug": "test-session", "category": "test", "title": "Synthetic test", "subtitle": "", "description": "Test only", "visibility": "public", "publicApproved": True, "picTimeUrl": "", "images": [{"source": "chosen.png", "alt": "Synthetic white rectangle", "caption": "", "shape": "portrait", "portfolio": True}]}
        self.save()

    def save(self):
        self.path.write_text(json.dumps(self.data))

    def test_publish_requires_current_review_and_explicit_consent(self):
        with self.assertRaises(photography.PhotographyError):
            photography.publish(self.path, self.root, confirm_public=True)
        photography.review(self.path, self.root)
        with self.assertRaises(photography.PhotographyError):
            photography.publish(self.path, self.root)
        self.data["publicApproved"] = False
        self.save()
        photography.review(self.path, self.root)
        with self.assertRaises(photography.PhotographyError):
            photography.publish(self.path, self.root, confirm_public=True)

    def test_dry_run_and_public_output_exclude_original_paths(self):
        photography.review(self.path, self.root)
        source_before = self.path.read_bytes()
        photography.publish(self.path, self.root, dry_run=True, confirm_public=True)
        self.assertFalse((self.root / "public").exists())
        self.assertFalse((self.root / "content").exists())
        record = photography.publish(self.path, self.root, confirm_public=True)
        self.assertNotIn("source", json.dumps(record))
        self.assertNotIn("publicApproved", record)
        self.assertEqual(source_before, self.path.read_bytes())
        self.assertEqual((self.root / "public" / record["images"][0]["src"].lstrip("/")).read_bytes(), (self.draft / "chosen.png").read_bytes())
        with self.assertRaises(photography.PhotographyError):
            photography.publish(self.path, self.root, confirm_public=True)

    def test_source_bytes_or_metadata_change_invalidates_review(self):
        photography.review(self.path, self.root)
        Image.new("RGB", (20, 30), "black").save(self.draft / "chosen.png")
        with self.assertRaises(photography.PhotographyError):
            photography.publish(self.path, self.root, confirm_public=True)
        photography.review(self.path, self.root)
        self.data["title"] = "Changed"
        self.save()
        with self.assertRaises(photography.PhotographyError):
            photography.publish(self.path, self.root, confirm_public=True)

    def test_private_galleries_and_secure_urls_are_rejected(self):
        for url in ("https://frameitwrightphotography.pic-time.com/professional", "https://frameitwrightphotography.pic-time.com/gallery?token=secret", "https://other.pic-time.com/gallery", "https://frameitwrightphotography.pic-time.com/invite/secret", "javascript:alert(1)"):
            with self.subTest(url=url):
                self.data["picTimeUrl"] = url
                self.save()
                with self.assertRaises(photography.PhotographyError):
                    photography.validate(self.path)
        self.data["picTimeUrl"] = ""
        self.data["visibility"] = "private"
        self.save()
        with self.assertRaises(photography.PhotographyError):
            photography.validate(self.path)

    def test_path_escape_symlinks_wrong_types_and_metadata(self):
        (self.draft / "linked.png").symlink_to(self.draft / "chosen.png")
        for source in ("../outside.png", "/tmp/chosen.png", "linked.png"):
            self.data["images"][0]["source"] = source
            self.save()
            with self.assertRaises(photography.PhotographyError):
                photography.validate(self.path)
        self.data["images"][0]["source"] = "chosen.png"
        self.save()
        (self.draft / "chosen.png").write_text("not an image")
        with self.assertRaises(photography.PhotographyError):
            photography.validate(self.path)
        from PIL.PngImagePlugin import PngInfo
        info = PngInfo()
        info.add_text("private-note", "must not publish")
        Image.new("RGB", (20, 30)).save(self.draft / "chosen.png", pnginfo=info)
        with self.assertRaises(photography.PhotographyError):
            photography.validate(self.path)

    def test_failed_catalog_write_rolls_back_only_created_assets(self):
        from unittest.mock import patch
        photography.review(self.path, self.root)
        with patch.object(photography, "atomic_json", side_effect=OSError("synthetic failure")):
            with self.assertRaises(OSError):
                photography.publish(self.path, self.root, confirm_public=True)
        self.assertEqual(list((self.root / "public").rglob("*.png")), [])
        self.assertTrue((self.draft / "chosen.png").exists())

    def test_decodes_jpeg_pixels_and_rejects_trailing_container_data(self):
        for extension, options in (("jpg", {}), ("jpg", {"progressive": True}), ("png", {}), ("webp", {})):
            with self.subTest(extension=extension, options=options):
                source = self.draft / f"boundary.{extension}"
                Image.new("RGB", (80, 80), "white").save(source, **options)
                self.data["images"][0]["source"] = source.name
                self.save()
                photography.validate(self.path)
                valid = source.read_bytes()
                source.write_bytes(valid + b"private trailing fixture")
                with self.assertRaises(photography.PhotographyError):
                    photography.validate(self.path)
                source.write_bytes(valid[:-20])
                with self.assertRaises(photography.PhotographyError):
                    photography.validate(self.path)

    def test_generated_destinations_reject_symlinked_directories(self):
        photography.review(self.path, self.root)
        with tempfile.TemporaryDirectory() as destination:
            (self.root / "public").symlink_to(destination, target_is_directory=True)
            with self.assertRaises(photography.PhotographyError):
                photography.publish(self.path, self.root, confirm_public=True)
            self.assertEqual(list(Path(destination).iterdir()), [])
            (self.root / "public").unlink()
            (self.root / "content").symlink_to(destination, target_is_directory=True)
            with self.assertRaises(photography.PhotographyError):
                photography.publish(self.path, self.root, confirm_public=True)
            self.assertEqual(list(Path(destination).iterdir()), [])

    def test_review_output_cannot_be_redirected_to_public(self):
        photography.review(self.path, self.root)
        preview = self.root / ".photography-workspace/reviews/test-session/index.html"
        public = self.root / "public"
        public.mkdir()
        preview.unlink()
        preview.symlink_to(public / "leaked.html")
        with self.assertRaises(photography.PhotographyError):
            photography.review(self.path, self.root)
        self.assertFalse((public / "leaked.html").exists())

    def test_slug_and_url_whitespace_are_not_silently_accepted(self):
        for key, value in (("slug", " test-session "), ("picTimeUrl", "https://frameitwrightphotography.pic-time.com/gal\nlery")):
            with self.subTest(key=key):
                original = self.data[key]
                self.data[key] = value
                self.save()
                with self.assertRaises(photography.PhotographyError):
                    photography.validate(self.path)
                self.data[key] = original


if __name__ == "__main__":
    unittest.main()
