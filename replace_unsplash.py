import re
import random
from pathlib import Path

dir_path = Path(r'c:\Users\LENONO\Downloads\about womencypedia\about womencypedia\womencypedia-frontend')
placeholders_dir = 'images/placeholders'

# Different categories for logic
bg_images = [f'{placeholders_dir}/hyper_realistic_vision_bg.png']
portrait_images = [
    f'{placeholders_dir}/hyper_realistic_portrait_1.png',
    f'{placeholders_dir}/hyper_realistic_portrait_2.png',
    f'{placeholders_dir}/hyper_realistic_portrait_3.png',
    f'{placeholders_dir}/hyper_realistic_portrait_4.png'
]
historical_cultural = [
    f'{placeholders_dir}/hyper_realistic_historical.png',
    f'{placeholders_dir}/hyper_realistic_landscape.png',
    f'{placeholders_dir}/hyper_realistic_cultural_1.png',
    f'{placeholders_dir}/hyper_realistic_cultural_2.png',
    f'{placeholders_dir}/hyper_realistic_cultural_3.png'
]

def get_replacement(index, html_filename):
    if html_filename == 'about.html':
        if index == 0:
            return bg_images[0] # The vision banner
        if index == 4:
            return historical_cultural[0] # 887: general large image
        # The 3 portraits
        return portrait_images[(index-1) % 4]
        
    if html_filename == 'browse.html':
        if index <= 7:
            return historical_cultural[index % len(historical_cultural)]
        else:
            return portrait_images[index % len(portrait_images)]
            
    return portrait_images[0]

for filename in ['about.html', 'browse.html']:
    filepath = dir_path / filename
    if not filepath.exists(): continue
    
    content = filepath.read_text(encoding='utf-8')
    def replace_url(m):
        url = m.group(1)
        # Using a closure index counter hack isn't needed if we keep state
        pass
        
    new_content = ""
    last_idx = 0
    match_idx = 0
    # Match the explicit unsplash URL pattern
    for m in re.finditer(r'https://images\.unsplash\.com/[^\'\"]+', content):
        start, end = m.span()
        new_content += content[last_idx:start]
        new_content += get_replacement(match_idx, filename)
        last_idx = end
        match_idx += 1
        
    new_content += content[last_idx:]
    
    if match_idx > 0:
        filepath.write_text(new_content, encoding='utf-8')
        print(f'Replaced {match_idx} images in {filename}')
