"""Generate 4 logo variations for Castellon Septic Services using GPT Image 1."""
import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration

OUTPUT_DIR = Path("/app/frontend/public/logos")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 4 variations of the same brand brief — vintage badge + truck silhouette
VARIATIONS = [
    {
        "name": "v1-classic-circle-badge",
        "prompt": (
            "Vintage circular badge logo for 'CASTELLON SEPTIC SERVICES'. "
            "Inside the circle: bold side-view silhouette of a vacuum tank truck with a cylindrical tank, "
            "drawn in clean retro illustration style. "
            "Around the outer ring: the text 'CASTELLON SEPTIC SERVICES' in bold uppercase serif/slab "
            "letters, with a small star, 'EST. SPOKANE WA', and crossed pipes/wrenches at the bottom. "
            "Two-tone color palette: deep forest green (#1F3A2E) and warm cream/off-white (#F5EDD8), "
            "with a small sky blue accent (#4A90C2). "
            "Flat vector style, crisp lines, no gradients, no photorealism. "
            "Centered on a pure white square background. "
            "Looks like an authentic blue-collar craftsman heritage badge — Carhartt × Patagonia × Stanley."
        ),
    },
    {
        "name": "v2-shield-emblem",
        "prompt": (
            "Vintage shield-shaped badge logo for 'CASTELLON SEPTIC SERVICES'. "
            "Inside the shield: front-three-quarter view of a vacuum tank truck silhouette with a clearly "
            "visible cylindrical tank, drawn in flat clean retro illustration style. "
            "Above the truck: a banner ribbon reading 'CASTELLON'. "
            "Below the truck: smaller text 'SEPTIC SERVICES' and 'SPOKANE · WA'. "
            "Two-tone deep forest green (#1F3A2E) and cream (#F5EDD8) with a sky blue accent (#4A90C2) "
            "on the truck cab. Lime green (#6BC95C) accent on the tank. "
            "Flat vector style, bold outlines, no gradients, heritage workwear aesthetic. "
            "Pure white background, centered. "
            "Feels like a vintage trade union or fire department crest."
        ),
    },
    {
        "name": "v3-hexagon-modern-vintage",
        "prompt": (
            "Hexagonal industrial badge logo for 'CASTELLON SEPTIC SERVICES'. "
            "Inside the hexagon: stylized side silhouette of a heavy-duty pumper truck with a large round "
            "tank, in clean flat retro line-art. Above the truck silhouette: '1800 GAL' subtle marker. "
            "Around the hexagon border: 'CASTELLON SEPTIC' on top arc, 'SERVICES · SPOKANE WA' bottom arc. "
            "Deep forest green (#1F3A2E) primary, cream background (#F5EDD8), sky-blue (#4A90C2) details. "
            "Flat vector, no gradients, no photorealism, thick clean strokes. "
            "Pure white square background. "
            "Vibe: modern industrial trademark meets vintage trucking heritage."
        ),
    },
    {
        "name": "v4-rectangular-stamp-style",
        "prompt": (
            "Vintage rectangular stamp-style badge logo for 'CASTELLON SEPTIC SERVICES'. "
            "Center: clean side silhouette of a vacuum septic truck (cab + cylindrical tank trailer) in "
            "flat illustrative style. Top of rectangle: 'CASTELLON' in big bold slab-serif uppercase. "
            "Bottom of rectangle: 'SEPTIC SERVICES — EST. SPOKANE, WA' in smaller font. "
            "Side decorations: small pine tree silhouettes and a tiny mountain range echoing the Pacific "
            "Northwest. Forest green (#1F3A2E) + cream (#F5EDD8) two-tone color. "
            "Flat vector style, hand-drawn retro feel, no gradients. "
            "Pure white background, centered, square frame. "
            "Looks like a vintage shipping crate stamp or letterhead emblem."
        ),
    },
]


async def generate_one(image_gen, variant):
    print(f"Generating {variant['name']}...")
    try:
        images = await image_gen.generate_images(
            prompt=variant["prompt"],
            model="gpt-image-1",
            number_of_images=1,
        )
        if images and len(images) > 0:
            out_path = OUTPUT_DIR / f"{variant['name']}.png"
            with open(out_path, "wb") as f:
                f.write(images[0])
            size_kb = out_path.stat().st_size / 1024
            print(f"  ✓ Saved {out_path.name} ({size_kb:.0f} KB)")
            return str(out_path)
        print(f"  ✗ No image returned for {variant['name']}")
        return None
    except Exception as e:
        print(f"  ✗ Error generating {variant['name']}: {e}")
        return None


async def main():
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        print("EMERGENT_LLM_KEY not set")
        sys.exit(1)
    image_gen = OpenAIImageGeneration(api_key=key)
    # Run sequentially to avoid rate limits and to get clearer logs
    results = []
    for v in VARIATIONS:
        results.append(await generate_one(image_gen, v))
    print("\n=== Summary ===")
    for r in results:
        print(f"  - {r}")


if __name__ == "__main__":
    asyncio.run(main())
