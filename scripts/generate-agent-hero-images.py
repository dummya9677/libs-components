"""Generate placeholder transparent PNG hero artwork for intelligence agents."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
SIZE = (420, 520)


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def with_alpha(rgb: tuple[int, int, int], alpha: int = 255) -> tuple[int, int, int, int]:
    return (*rgb, alpha)


def draw_rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, int, int, int],
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def draw_glow(draw: ImageDraw.ImageDraw, center: tuple[int, int], radius: int, color: tuple[int, int, int]) -> None:
    for step in range(radius, 0, -8):
        alpha = max(8, int(42 * (step / radius)))
        draw.ellipse(
            (center[0] - step, center[1] - step, center[0] + step, center[1] + step),
            fill=with_alpha(color, alpha),
        )


def draw_label(draw: ImageDraw.ImageDraw, text: str, y: int, color: tuple[int, int, int]) -> None:
    try:
        font = ImageFont.truetype("arial.ttf", 22)
    except OSError:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    width = bbox[2] - bbox[0]
    draw.text(((SIZE[0] - width) / 2, y), text, fill=with_alpha(color, 210), font=font)


def new_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    return image, ImageDraw.Draw(image)


def save(name: str, image: Image.Image) -> None:
    path = ASSETS / name
    image.save(path, optimize=True)
    print(f"created {path.name} ({image.size[0]}x{image.size[1]})")


def ticket_analyzer() -> None:
    image, draw = new_canvas()
    primary = hex_to_rgb("#7C3AED")
    accent = hex_to_rgb("#A78BFA")
    draw_glow(draw, (210, 250), 150, accent)

    draw_rounded_rect(draw, (95, 70, 325, 390), 28, with_alpha((255, 255, 255), 235))
    draw_rounded_rect(draw, (120, 95, 300, 145), 14, with_alpha(primary, 220))
    for row in range(4):
        y = 170 + row * 48
        draw_rounded_rect(draw, (130, y, 290, y + 24), 10, with_alpha(accent, 90 + row * 20))
    draw.ellipse((285, 88, 315, 118), fill=with_alpha(hex_to_rgb("#EF4444"), 230))
    draw.text((294, 96), "!", fill=(255, 255, 255, 255))
    draw_label(draw, "Ticket", 410, primary)
    save("ticket-analyzer.png", image)


def data_issue_analyzer() -> None:
    image, draw = new_canvas()
    primary = hex_to_rgb("#8B5CF6")
    accent = hex_to_rgb("#C4B5FD")
    draw_glow(draw, (215, 255), 155, accent)

    for offset, alpha in ((0, 235), (18, 180), (36, 130)):
        draw.ellipse(
            (118 + offset, 95 + offset, 302 - offset, 175 - offset),
            fill=with_alpha((255, 255, 255), alpha),
        )
    draw.rectangle((145, 165, 275, 175), fill=with_alpha(primary, 220))
    draw.rectangle((145, 205, 275, 215), fill=with_alpha(primary, 180))
    draw.rectangle((145, 245, 275, 255), fill=with_alpha(primary, 140))
    draw.polygon(
        [(210, 300), (170, 360), (250, 360)],
        fill=with_alpha(hex_to_rgb("#F59E0B"), 220),
    )
    draw.ellipse((198, 286, 222, 310), fill=with_alpha(hex_to_rgb("#F59E0B"), 220))
    draw_label(draw, "Data", 410, primary)
    save("data-issue-analyzer.png", image)


def impact_analyzer() -> None:
    image, draw = new_canvas()
    primary = hex_to_rgb("#10B981")
    accent = hex_to_rgb("#6EE7B7")
    draw_glow(draw, (210, 250), 150, accent)

    nodes = [(210, 110), (120, 220), (300, 220), (160, 340), (260, 340)]
    for start, end in ((0, 1), (0, 2), (1, 3), (2, 4), (3, 4)):
        draw.line([nodes[start], nodes[end]], fill=with_alpha(primary, 180), width=6)
    for x, y in nodes:
        draw.ellipse((x - 24, y - 24, x + 24, y + 24), fill=with_alpha((255, 255, 255), 235))
        draw.ellipse((x - 14, y - 14, x + 14, y + 14), fill=with_alpha(primary, 230))
    draw_label(draw, "Impact", 410, primary)
    save("impact-analyzer.png", image)


def knowledge_assistant() -> None:
    image, draw = new_canvas()
    primary = hex_to_rgb("#F59E0B")
    accent = hex_to_rgb("#FCD34D")
    draw_glow(draw, (210, 250), 150, accent)

    draw_rounded_rect(draw, (115, 95, 255, 360), 18, with_alpha((255, 255, 255), 235))
    draw_rounded_rect(draw, (165, 75, 305, 340), 18, with_alpha((255, 255, 255), 210))
    for y in (130, 175, 220, 265):
        draw_rounded_rect(draw, (190, y, 285, y + 12), 6, with_alpha(primary, 120))
    draw.ellipse((250, 300, 320, 370), fill=with_alpha(primary, 220))
    draw.polygon([(285, 318), (305, 338), (265, 338)], fill=(255, 255, 255, 255))
    draw_label(draw, "Knowledge", 410, primary)
    save("knowledge-assistant.png", image)


def dq_intelligence() -> None:
    image, draw = new_canvas()
    primary = hex_to_rgb("#14B8A6")
    accent = hex_to_rgb("#5EEAD4")
    draw_glow(draw, (210, 250), 150, accent)

    draw_rounded_rect(draw, (95, 95, 325, 360), 28, with_alpha((255, 255, 255), 235))
    draw.arc((130, 140, 290, 300), start=200, end=-20, fill=with_alpha(primary, 230), width=18)
    draw.polygon(
        [(205, 188), (225, 228), (185, 228)],
        fill=with_alpha(primary, 230),
    )
    draw.ellipse((198, 180, 212, 194), fill=with_alpha(primary, 230))
    draw_rounded_rect(draw, (145, 305, 275, 335), 12, with_alpha(accent, 180))
    draw_label(draw, "Quality", 410, primary)
    save("dqintelligence.png", image)


def cost_intelligence() -> None:
    image, draw = new_canvas()
    primary = hex_to_rgb("#F43F5E")
    accent = hex_to_rgb("#FDA4AF")
    draw_glow(draw, (210, 250), 150, accent)

    draw.ellipse((145, 120, 275, 250), fill=with_alpha((255, 255, 255), 235))
    draw.ellipse((165, 140, 255, 230), fill=with_alpha(primary, 220))
    draw.text((198, 168), "$", fill=(255, 255, 255, 255))
    draw_rounded_rect(draw, (110, 270, 310, 360), 24, with_alpha((255, 255, 255), 220))
    for index, height in enumerate((70, 110, 90, 130)):
        x = 135 + index * 42
        draw_rounded_rect(
            draw,
            (x, 350 - height, x + 24, 350),
            8,
            fill=with_alpha(primary, 170 + index * 15),
        )
    draw_label(draw, "Cost", 410, primary)
    save("costintelligence.png", image)


def main() -> None:
    ticket_analyzer()
    data_issue_analyzer()
    impact_analyzer()
    knowledge_assistant()
    dq_intelligence()
    cost_intelligence()


if __name__ == "__main__":
    main()
