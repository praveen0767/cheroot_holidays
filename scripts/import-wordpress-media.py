#!/usr/bin/env python3
"""
Import original WordPress Media Library photos into the Cheroot Holidays Next.js
project, optimize them as WebP, and generate a JSON inventory + visual contact sheets.

Usage (from the repository root):
  py -m pip install Pillow
  py scripts/import-wordpress-media.py --source "C:\CherootRecovery\public_html\wp-content\uploads"

This DOES NOT invent tour package names, prices, or itineraries. Those are normally
stored in the WordPress database, which was not present in the supplied ZIP.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps
except ImportError:
    print("Missing dependency: Pillow. Install once with: py -m pip install Pillow", file=sys.stderr)
    raise SystemExit(2)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
WP_RESIZE_SUFFIX = re.compile(r"-\d{2,5}x\d{2,5}$", re.IGNORECASE)
SAFE_SLUG = re.compile(r"[^a-z0-9]+")
MAX_EDGE = 1400
WEBP_QUALITY = 80
THUMB_SIZE = (210, 135)
PER_SHEET = 48


def slugify(value: str) -> str:
    value = Path(value).stem
    value = SAFE_SLUG.sub("-", value.lower()).strip("-")
    return value or "travel-image"


def nice_title(filename: str) -> str:
    stem = Path(filename).stem
    stem = re.sub(r"-\d{2,5}x\d{2,5}$", "", stem, flags=re.IGNORECASE)
    stem = stem.replace("_", " ").replace("-", " ")
    stem = re.sub(r"\s+", " ", stem).strip()
    return stem[:1].upper() + stem[1:] if stem else "Imported travel photo"


def is_date_folder_image(path: Path, root: Path) -> bool:
    """Prefer real WordPress Media Library items in uploads/YYYY/MM, not plugin assets."""
    try:
        relative = path.relative_to(root)
    except ValueError:
        return False
    parts = relative.parts
    return (
        len(parts) >= 3
        and re.fullmatch(r"\d{4}", parts[0]) is not None
        and re.fullmatch(r"\d{2}", parts[1]) is not None
    )


def load_font(size: int):
    try:
        return ImageFont.truetype("arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, help="Extracted WordPress uploads directory")
    parser.add_argument("--project", default=".", help="Cheroot Next.js project root (default: current directory)")
    parser.add_argument("--preview-dir", default=r"C:\CherootRecovery\contact-sheets", help="Where contact-sheet JPGs are written")
    args = parser.parse_args()

    source = Path(args.source).expanduser().resolve()
    project = Path(args.project).expanduser().resolve()
    preview_dir = Path(args.preview_dir).expanduser().resolve()

    if not source.is_dir():
        print(f"Source folder does not exist: {source}", file=sys.stderr)
        return 2
    if not (project / "package.json").is_file() or not (project / "app").is_dir():
        print(f"Project root must contain package.json and app/: {project}", file=sys.stderr)
        print('Run from your repo root, or pass --project "C:\\path\\to\\cheroot_holidays".', file=sys.stderr)
        return 2

    candidates = [
        p for p in source.rglob("*")
        if p.is_file()
        and p.suffix.lower() in IMAGE_EXTENSIONS
        and is_date_folder_image(p, source)
        and not WP_RESIZE_SUFFIX.search(p.stem)
    ]
    candidates.sort(key=lambda p: str(p.relative_to(source)).lower())

    if not candidates:
        print("No original images found in uploads/YYYY/MM. Check the --source path.", file=sys.stderr)
        return 1

    dest_dir = project / "public" / "packages" / "imported"
    data_dir = project / "data"
    dest_dir.mkdir(parents=True, exist_ok=True)
    data_dir.mkdir(parents=True, exist_ok=True)
    preview_dir.mkdir(parents=True, exist_ok=True)

    records: list[dict] = []
    used_slugs: dict[str, int] = {}
    sheet_items: list[tuple[dict, Image.Image]] = []
    failed: list[dict] = []

    for number, original in enumerate(candidates, start=1):
        rel = original.relative_to(source)
        base = slugify(original.name)
        used_slugs[base] = used_slugs.get(base, 0) + 1
        slug = base if used_slugs[base] == 1 else f"{base}-{used_slugs[base]}"
        target = dest_dir / f"{slug}.webp"
        try:
            with Image.open(original) as opened:
                image = ImageOps.exif_transpose(opened)
                image.load()
                if image.mode not in ("RGB", "RGBA"):
                    image = image.convert("RGBA" if "transparency" in image.info else "RGB")
                image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
                image.save(target, "WEBP", quality=WEBP_QUALITY, method=6)
                preview = image.copy()
                preview.thumbnail(THUMB_SIZE, Image.Resampling.LANCZOS)

            record = {
                "id": f"IMG-{len(records) + 1:04d}",
                "suggestedTitle": nice_title(original.name),
                "originalFile": rel.as_posix(),
                "image": f"/packages/imported/{target.name}",
                "originalBytes": original.stat().st_size,
                "optimizedBytes": target.stat().st_size,
                "status": "needs_package_match",
                "packageDetails": {
                    "destination": None,
                    "category": None,
                    "nights": None,
                    "days": None,
                    "priceINR": None,
                    "highlights": []
                }
            }
            records.append(record)
            sheet_items.append((record, preview))
        except Exception as exc:
            failed.append({"file": rel.as_posix(), "error": str(exc)})

    manifest = {
        "source": "WordPress Media Library uploads",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "note": "This is an image inventory, not verified tour package data. Fill packageDetails only from a trustworthy source.",
        "count": len(records),
        "images": records,
        "failed": failed
    }
    manifest_path = data_dir / "legacy-image-index.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    font = load_font(13)
    cols, cell_w, cell_h = 4, 250, 185
    for start in range(0, len(sheet_items), PER_SHEET):
        group = sheet_items[start:start + PER_SHEET]
        rows = (len(group) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "#f4f7fb")
        draw = ImageDraw.Draw(sheet)
        for idx, (record, thumb) in enumerate(group):
            x = (idx % cols) * cell_w
            y = (idx // cols) * cell_h
            thumb = thumb.convert("RGB")
            px = x + (cell_w - thumb.width) // 2
            sheet.paste(thumb, (px, y + 5))
            label = f"{record['id']}  {record['suggestedTitle']}"
            draw.text((x + 8, y + 146), label[:34], fill="#10233f", font=font)
            draw.text((x + 8, y + 163), record["originalFile"][-34:], fill="#52627a", font=font)
        sheet_path = preview_dir / f"contact-sheet-{start // PER_SHEET + 1:02d}.jpg"
        sheet.save(sheet_path, "JPEG", quality=86, optimize=True)

    print(f"Imported and optimized {len(records)} images.")
    print(f"Image directory: {dest_dir}")
    print(f"JSON image index: {manifest_path}")
    print(f"Contact sheets: {preview_dir}")
    print(f"Images that failed: {len(failed)}")
    print("Next: review the contact sheets, then map photos to verified package details. Package prices/itineraries were not fabricated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
