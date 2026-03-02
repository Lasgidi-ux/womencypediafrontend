from bs4 import BeautifulSoup
from pathlib import Path

dir_path = Path(r'c:\Users\LENONO\Downloads\about womencypedia\about womencypedia\womencypedia-frontend')
index_html = (dir_path / 'index.html').read_text(encoding='utf-8')

soup_index = BeautifulSoup(index_html, 'html.parser')

header_block = soup_index.find('header')
footer_block = soup_index.find('footer')
nav_block = soup_index.find('nav', id='mobileMenu') or soup_index.find('nav', class_='mobile-menu')
search_sheet = soup_index.find('div', id='searchSheet')
menu_overlay = soup_index.find('div', id='menuOverlay')

target_files = ['cookies.html', 'community.html', 'privacy-policy.html', 'press.html']

for f in target_files:
    filepath = dir_path / f
    if not filepath.exists():
        print(f'{f} not found.')
        continue
        
    print(f'Processing {f}...')
    html = filepath.read_text(encoding='utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    changed = False
    
    # Replace header
    if header_block and soup.find('header'):
        soup.find('header').replace_with(BeautifulSoup(str(header_block), 'html.parser'))
        changed = True
        
    # Replace footer
    if footer_block and soup.find('footer'):
        soup.find('footer').replace_with(BeautifulSoup(str(footer_block), 'html.parser'))
        changed = True
        
    # Replace mobile nav
    old_nav = soup.find('nav', id='mobileMenu') or soup.find('nav', class_='mobile-menu')
    if nav_block and old_nav:
        old_nav.replace_with(BeautifulSoup(str(nav_block), 'html.parser'))
        changed = True
        
    # Replace searchSheet and menuOverlay if they exist
    old_search = soup.find('div', id='searchSheet')
    if search_sheet and old_search:
        old_search.replace_with(BeautifulSoup(str(search_sheet), 'html.parser'))
        changed = True
        
    old_overlay = soup.find('div', id='menuOverlay')
    if menu_overlay and old_overlay:
        old_overlay.replace_with(BeautifulSoup(str(menu_overlay), 'html.parser'))
        changed = True
        
    body_tag = soup.find('body')
    if body_tag:
        classes = body_tag.get('class', [])
        required = ['bg-background-cream', 'text-text-main', 'antialiased', 'min-h-screen']
        for req in required:
            if req not in classes:
                if req == 'bg-background-cream' and any('gradient' in c for c in classes):
                    continue
                classes.append(req)
        body_tag['class'] = classes
        changed = True
        
    if changed:
        # Workaround bs4 entity escaping issues for simple HTML string conversion
        new_html = str(soup)
        filepath.write_text(new_html, encoding='utf-8')
        print(f'Successfully updated {f}')
