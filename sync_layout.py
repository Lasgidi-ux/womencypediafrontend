import re
from pathlib import Path

dir_path = Path(r'c:\Users\LENONO\Downloads\about womencypedia\about womencypedia\womencypedia-frontend')
index_html = (dir_path / 'index.html').read_text(encoding='utf-8')

def extract_element(tag, html, id_name=None, class_name=None):
    if id_name:
        match_start = re.search(f'<{tag}[^>]*id=[\'\"]{id_name}[\'\"][^>]*>', html)
    elif class_name:
        match_start = re.search(f'<{tag}[^>]*class=[\'\"][^\'\"]*{class_name}[^\'\"]*[\'\"][^>]*>', html)
    else:
        match_start = re.search(f'<{tag}[^>]*>', html)
        
    if not match_start: return None
    
    start_idx = match_start.start()
    open_tags = 0
    i = start_idx
    
    while i < len(html):
        if html.startswith(f'<{tag}', i) and not html.startswith(f'</{tag}>', i):
            # To handle tags like <nav> nicely without being confused by text inside it,
            # this primitive logic finds exact cases of the open tag
            open_tags += 1
            i += 1
            continue
        if html.startswith(f'</{tag}>', i):
            open_tags -= 1
            if open_tags == 0:
                end_idx = i + len(f'</{tag}>')
                return html[start_idx:end_idx]
            # Advance past the closing tag
            i += len(f'</{tag}>')
            continue
        i += 1
    return None

def replace_element(tag, new_html, target_html, id_name=None, class_name=None):
    if id_name:
        match_start = re.search(f'<{tag}[^>]*id=[\'\"]{id_name}[\'\"][^>]*>', target_html)
    elif class_name:
        match_start = re.search(f'<{tag}[^>]*class=[\'\"][^\'\"]*{class_name}[^\'\"]*[\'\"][^>]*>', target_html)
    else:
        match_start = re.search(f'<{tag}[^>]*>', target_html)
        
    if not match_start: return target_html
    
    start_idx = match_start.start()
    open_tags = 0
    i = start_idx
    
    while i < len(target_html):
        if target_html.startswith(f'<{tag}', i) and not target_html.startswith(f'</{tag}>', i):
            open_tags += 1
            i += 1
            continue
        if target_html.startswith(f'</{tag}>', i):
            open_tags -= 1
            if open_tags == 0:
                end_idx = i + len(f'</{tag}>')
                return target_html[:start_idx] + new_html + target_html[end_idx:]
            i += len(f'</{tag}>')
            continue
        i += 1
    return target_html

header_block = extract_element('header', index_html)
footer_block = extract_element('footer', index_html)
nav_block = extract_element('nav', index_html, id_name='mobileMenu') or extract_element('nav', index_html, class_name='mobile-menu')
search_sheet = extract_element('div', index_html, id_name='searchSheet')
menu_overlay = extract_element('div', index_html, id_name='menuOverlay')

target_files = ['cookies.html', 'community.html', 'privacy-policy.html', 'press.html']

for f in target_files:
    path = dir_path / f
    if not path.exists():
        print(f'{f} not found')
        continue
        
    html = path.read_text(encoding='utf-8')
    orig_html = html
    
    if header_block:
        html = replace_element('header', header_block, html)
    if footer_block:
        html = replace_element('footer', footer_block, html)
    if nav_block:
        tmp_html = replace_element('nav', nav_block, html, id_name='mobileMenu')
        if tmp_html == html: # Didn't find by ID, try by class
            html = replace_element('nav', nav_block, html, class_name='mobile-menu')
        else:
            html = tmp_html
    if search_sheet:
        html = replace_element('div', search_sheet, html, id_name='searchSheet')
    if menu_overlay:
        html = replace_element('div', menu_overlay, html, id_name='menuOverlay')
    
    # Update body classes
    body_start = html.find('<body')
    if body_start != -1:
        body_end = html.find('>', body_start)
        if body_end != -1:
            body_tag = html[body_start:body_end+1]
            if 'class=' in body_tag:
                match = re.search(r'class=([\'\"])(.*?)\1', body_tag)
                if match:
                    classes = match.group(2).split()
                    required = ['bg-background-cream', 'text-text-main', 'antialiased', 'min-h-screen']
                    for r in required:
                        if r not in classes:
                            if r == 'bg-background-cream' and any('gradient' in c for c in classes):
                                continue
                            classes.append(r)
                    
                    new_class_str = ' '.join(classes)
                    new_body_tag = body_tag[:match.start(2)] + new_class_str + body_tag[match.end(2):]
                    html = html[:body_start] + new_body_tag + html[body_end+1:]
            else:
                # no class attr, add it
                new_body_tag = body_tag[:-1] + ' class="bg-background-cream text-text-main antialiased min-h-screen">'
                html = html[:body_start] + new_body_tag + html[body_end+1:]
    
    if html != orig_html:
        path.write_text(html, encoding='utf-8')
        print(f'Updated {f}')
    else:
        print(f'No changes needed for {f}')
