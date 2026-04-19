# -*- coding: utf-8 -*-
import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from PIL import Image
import os

img = Image.open("images/logo.png")
img = img.convert('RGBA')

# Kac piksel seffaf?
pixels = list(img.getdata())
transparent = sum(1 for p in pixels if p[3] < 128)
total = len(pixels)
white_ish = sum(1 for p in pixels if p[0] > 240 and p[1] > 240 and p[2] > 240 and p[3] > 128)

print(f"Toplam piksel: {total}")
print(f"Seffaf piksel: {transparent} ({transparent*100//total}%)")
print(f"Beyaz piksel: {white_ish} ({white_ish*100//total}%)")

if white_ish > total * 0.1:
    print("\nLogo beyaz arka plana sahip. Beyaz pikseller seffaf yapiliyor...")
    
    new_data = []
    for p in pixels:
        # Beyaz ve beyaza yakin pikselleri seffaf yap
        if p[0] > 230 and p[1] > 230 and p[2] > 230:
            new_data.append((p[0], p[1], p[2], 0))
        else:
            new_data.append(p)
    
    img.putdata(new_data)
    
    # PNG olarak kaydet (seffaf)
    img.save("images/logo.png", 'PNG')
    # WebP olarak kaydet (seffaf)
    img.save("images/logo.webp", 'WebP', quality=90, method=6)
    
    print(f"PNG: {os.path.getsize('images/logo.png')//1024} KB")
    print(f"WebP: {os.path.getsize('images/logo.webp')//1024} KB")
    print("Logo beyaz arka plan kaldirildi!")
else:
    print("\nLogo zaten seffaf arka plana sahip.")
