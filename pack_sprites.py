import os
import json
import math
from PIL import Image

# CONFIG
INPUT_DIR = "public/emojis"   # Where your hex PNGs are
OUTPUT_IMG = "public/emoji-sheet.png"
OUTPUT_MAP = "src/data/emoji-map.json"
SPRITE_SIZE = 10 # Native size of SerenityOS icons

def pack_images():
    files = [f for f in os.listdir(INPUT_DIR) if f.endswith('.png')]
    files.sort() # Ensure deterministic order
    
    total = len(files)
    if total == 0:
        print("No images found!")
        return

    # Calculate Grid Size (Square)
    rows = math.ceil(math.sqrt(total))
    cols = rows
    
    sheet_width = cols * SPRITE_SIZE
    sheet_height = rows * SPRITE_SIZE
    
    print(f"Packing {total} images into {sheet_width}x{sheet_height} sheet...")
    
    sheet = Image.new("RGBA", (sheet_width, sheet_height))
    mapping = {}
    
    for index, filename in enumerate(files):
        # Calculate Position
        col = index % cols
        row = index // cols
        x = col * SPRITE_SIZE
        y = row * SPRITE_SIZE
        
        # Paste Image
        with Image.open(os.path.join(INPUT_DIR, filename)) as icon:
            sheet.paste(icon, (x, y))
            
        # Save Mapping (Filename w/o extension -> Coordinates)
        hex_code = filename.replace(".png", "")
        mapping[hex_code] = {"x": x, "y": y}
        
    # Save Output
    sheet.save(OUTPUT_IMG)
    with open(OUTPUT_MAP, "w") as f:
        json.dump({
            "cols": cols,
            "rows": rows,
            "spriteSize": SPRITE_SIZE,
            "map": mapping
        }, f)
        
    print("Done!")

if __name__ == "__main__":
    pack_images()