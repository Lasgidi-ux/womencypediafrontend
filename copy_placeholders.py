import shutil
import os
import re
from pathlib import Path

brain_dir = Path(r'C:\Users\LENONO\.gemini\antigravity\brain\2976450b-9a23-40d4-9a80-f28b078909d9')
dest_dir = Path(r'c:\Users\LENONO\Downloads\about womencypedia\about womencypedia\womencypedia-frontend\images\placeholders')

dest_dir.mkdir(parents=True, exist_ok=True)

for img_path in brain_dir.glob('hyper_realistic_*.png'):
    new_name = re.sub(r'_[0-9]+\.png$', '.png', img_path.name)
    shutil.copy(img_path, dest_dir / new_name)
    print(f'Copied {img_path.name} to {new_name}')
