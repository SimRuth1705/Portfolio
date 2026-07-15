import os
from PIL import Image

def optimize_image(src_path, dest_path, max_width=None, format="WEBP", quality=80):
    print(f"Optimizing {src_path} -> {dest_path}")
    if not os.path.exists(src_path):
        print(f"Error: {src_path} does not exist!")
        return False
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    img = Image.open(src_path)
    
    if max_width and img.width > max_width:
        aspect_ratio = img.height / img.width
        new_height = int(max_width * aspect_ratio)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        print(f"Resized to {max_width}x{new_height}")
        
    img.save(dest_path, format=format, quality=quality)
    print(f"Saved optimized image. Size: {os.path.getsize(dest_path)} bytes")
    return True

if __name__ == "__main__":
    # Base paths
    portfolio_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(portfolio_dir, "src", "assets")
    public_images_dir = os.path.join(portfolio_dir, "public", "images")
    
    # 1. Hero Image
    hero_src = os.path.join(assets_dir, "hero.webp")
    hero_dest = os.path.join(public_images_dir, "hero.webp")
    optimize_image(hero_src, hero_dest, max_width=1000, format="WEBP", quality=80)
    
    # 2. Logo Image
    logo_src = os.path.join(assets_dir, "logo-seal.webp")
    logo_dest = os.path.join(public_images_dir, "logo-seal.webp")
    optimize_image(logo_src, logo_dest, max_width=120, format="WEBP", quality=80)
