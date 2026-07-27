"""Trim empty padding from promo PNGs so they render larger in the UI."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
FILES = [
    "robot.png",
    "multi-agent-intelligence.png",
    "data-issue-analyzer.png",
    "impact-analyzer.png",
    "knowledge-assistant.png",
    "ticket-analyzer.png",
    "dqintelligence.png",
    "costintelligence.png",
]
PADDING = 0
BG_THRESHOLD = 28


def content_bbox(im: Image.Image) -> tuple[int, int, int, int] | None:
    rgba = im.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    found = False

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a < 12:
                continue
            if r <= BG_THRESHOLD and g <= BG_THRESHOLD and b <= BG_THRESHOLD:
                continue
            found = True
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

    if not found:
        return None

    return min_x, min_y, max_x + 1, max_y + 1


def trim_image(path: Path) -> None:
    im = Image.open(path)
    bbox = content_bbox(im)
    if not bbox:
        print(f"skip (no content): {path.name}")
        return

    left, top, right, bottom = bbox
    left = max(0, left - PADDING)
    top = max(0, top - PADDING)
    right = min(im.width, right + PADDING)
    bottom = min(im.height, bottom + PADDING)

    cropped = im.crop((left, top, right, bottom))
    cropped.save(path, optimize=True)
    print(f"trimmed {path.name}: {im.size} -> {cropped.size}")


def main() -> None:
    for name in FILES:
        trim_image(ASSETS / name)


if __name__ == "__main__":
    main()
