# -*- coding: utf-8 -*-
import os, sys
from pathlib import Path

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    from PIL import Image
except ImportError:
    print("Pillow kutuphanesi gerekli! pip install Pillow")
    exit(1)

IMAGES_DIR = Path("images")
QUALITY = 80
MAX_WIDTH = 1200

def optimize_image(input_path, output_path):
    with Image.open(input_path) as img:
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_height = int(img.height * ratio)
            img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)
        
        img.save(output_path, 'WebP', quality=QUALITY, method=6)
        
        original_size = os.path.getsize(input_path)
        new_size = os.path.getsize(output_path)
        savings = ((original_size - new_size) / original_size) * 100
        
        print(f"  OK: {input_path.name}")
        print(f"     {original_size//1024} KB -> {new_size//1024} KB ({savings:.1f}% kuculdu)")
        print(f"     Boyut: {img.width}x{img.height}")
        return img.width, img.height

def main():
    print("Kaman UBYO - Resim Optimizasyonu Basliyor...")
    print("=" * 50)
    
    if not IMAGES_DIR.exists():
        print("HATA: images/ klasoru bulunamadi!")
        return
    
    extensions = {'.png', '.jpg', '.jpeg'}
    images = [f for f in IMAGES_DIR.iterdir() if f.suffix.lower() in extensions]
    
    if not images:
        print("HATA: Donusturulecek resim bulunamadi!")
        return
    
    print(f"{len(images)} adet resim bulundu.\n")
    
    total_original = 0
    total_new = 0
    
    for img_path in sorted(images):
        webp_path = img_path.with_suffix('.webp')
        try:
            original_size = os.path.getsize(img_path)
            total_original += original_size
            
            width, height = optimize_image(img_path, webp_path)
            
            new_size = os.path.getsize(webp_path)
            total_new += new_size
        except Exception as e:
            print(f"  HATA: {img_path.name}: {e}")
    
    print("\n" + "=" * 50)
    print(f"Toplam: {total_original/1024/1024:.1f} MB -> {total_new/1024/1024:.1f} MB")
    savings = ((total_original - total_new) / total_original) * 100 if total_original > 0 else 0
    print(f"Toplam Tasarruf: {savings:.1f}%")
    print("\nTamamlandi! WebP dosyalari images/ klasorunde olusturuldu.")

if __name__ == "__main__":
    main()
