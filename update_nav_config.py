"""
Script to update all Womencypedia HTML pages with consistent navigation
Based on project structure from DOC-2.pdf
"""

import os
import re

base_path = r'c:\Users\LENONO\Downloads\about womencypedia\about womencypedia\womencypedia-frontend'

# Standard navigation for desktop (5 main items)
nav_links = [
    ('Home', 'index.html'),
    ('Browse', 'browse.html'),
    ('Featured', 'featured.html'),
    ('About', 'about.html'),
    ('Resources', 'resources.html'),
]

# Pages that need updating with their active link
pages_to_update = {
    'publications.html': None,
    'contributors.html': None,
    'contact.html': None,
    'featured.html': 'featured.html',
    'browse.html': 'browse.html',
    'about.html': 'about.html',
    'biography.html': 'browse.html',
    'collections.html': None,
    'nominate.html': None,
    'share-story.html': None,
    'donate.html': None,
    'research.html': None,
    'founders.html': 'about.html',
}

def generate_nav_links(active_page=None):
    """Generate the desktop navigation links HTML"""
    links = []
    for name, href in nav_links:
        if href == active_page:
            links.append(f'                        <a class="text-primary text-sm font-medium uppercase tracking-wider border-b-2 border-primary" href="{href}">{name}</a>')
        else:
            links.append(f'                        <a class="text-text-main text-sm font-medium hover:text-primary uppercase tracking-wider" href="{href}">{name}</a>')
    return '\n'.join(links)

def generate_header(active_page=None):
    """Generate consistent header HTML"""
    nav_html = generate_nav_links(active_page)
    return f'''    <header class="w-full border-b border-divider bg-background-cream sticky top-0 z-50">
        <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
            <div class="flex items-center justify-between h-16 lg:h-20">
                <div class="flex items-center gap-8 lg:gap-12">
                    <a class="flex items-center gap-2 lg:gap-3 group" href="index.html">
                        <div class="flex items-center justify-center size-9 lg:size-10 rounded-full bg-primary/20 text-text-main group-hover:bg-primary/40 transition-colors">
                            <span class="material-symbols-outlined text-[20px] lg:text-[24px]">history_edu</span>
                        </div>
                        <h2 class="text-text-main text-xl lg:text-2xl font-bold font-serif tracking-tight">Womencypedia</h2>
                    </a>
                    <nav class="hidden lg:flex items-center gap-8">
{nav_html}
                    </nav>
                </div>
                <div class="flex items-center gap-3 lg:gap-6">
                    <div class="hidden md:flex items-center bg-white/50 border border-divider/30 rounded-full px-4 h-10 w-64 focus-within:border-accent-teal focus-within:ring-1 focus-within:ring-accent-teal transition-all">
                        <span class="material-symbols-outlined text-accent-teal text-[20px]">search</span>
                        <input class="bg-transparent border-none focus:ring-0 text-sm w-full text-text-main placeholder-text-main/50 ml-2" placeholder="Search the archive..." type="search" />
                    </div>
                    <div class="hidden sm:flex items-center gap-4">
                        <a class="text-sm font-bold text-text-main hover:text-primary uppercase tracking-wide" href="donate.html">Donate</a>
                        <button class="flex items-center justify-center h-10 px-6 rounded-full bg-text-main text-background-cream text-sm font-bold tracking-wide hover:bg-opacity-90 transition-opacity">Sign In</button>
                    </div>
                    <button class="lg:hidden size-11 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors" aria-label="Menu">
                        <span class="material-symbols-outlined text-text-main">menu</span>
                    </button>
                </div>
            </div>
        </div>
    </header>'''

footer_html = '''    <footer class="bg-text-main text-white py-12 lg:py-16 border-t-4 border-primary">
        <div class="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                <div class="md:col-span-1">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="material-symbols-outlined text-primary text-2xl">history_edu</span>
                        <span class="font-serif text-lg font-bold">Womencypedia</span>
                    </div>
                    <p class="text-gray-400 text-sm leading-relaxed">The world's first interpretive encyclopedia of women. A global institution preserving women's stories for future generations.</p>
                </div>
                <div>
                    <h4 class="font-bold text-sm uppercase tracking-wider mb-4">Explore</h4>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="collections.html">Collections</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="browse.html">Browse Encyclopedia</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="featured.html">Featured Entries</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="resources.html">Resources</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="publications.html">Publications</a>
                </div>
                <div>
                    <h4 class="font-bold text-sm uppercase tracking-wider mb-4">Organization</h4>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="about.html">About Us</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="founders.html">Founders</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="contributors.html">Contributors</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="research.html">Methodology</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="contact.html">Contact</a>
                </div>
                <div>
                    <h4 class="font-bold text-sm uppercase tracking-wider mb-4">Support</h4>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="donate.html">Donate</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="nominate.html">Nominate a Woman</a>
                    <a class="block text-gray-400 hover:text-primary transition-colors text-sm py-1" href="share-story.html">Share Your Story</a>
                    <a href="donate.html" class="inline-flex items-center justify-center w-full mt-4 px-4 py-3 bg-primary/20 text-primary hover:bg-primary hover:text-text-main border border-primary rounded-lg font-bold text-sm transition-colors">Support Our Mission</a>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-xs text-gray-500">© 2026 Womencypedia Foundation. All rights reserved.</p>
                <div class="flex items-center gap-4">
                    <a href="#" class="text-gray-500 hover:text-primary text-xs">Privacy Policy</a>
                    <a href="#" class="text-gray-500 hover:text-primary text-xs">Terms of Use</a>
                    <a href="#" class="text-gray-500 hover:text-primary text-xs">Accessibility</a>
                </div>
            </div>
        </div>
    </footer>'''

print("Navigation Configuration:")
print("=" * 50)
print("Desktop Navigation Links:")
for name, href in nav_links:
    print(f"  - {name} -> {href}")
print("\nFooter Sections:")
print("  - Explore: Collections, Browse, Featured, Resources, Publications")
print("  - Organization: About, Founders, Contributors, Methodology, Contact")
print("  - Support: Donate, Nominate a Woman, Share Your Story")
print("\nPages to update:", list(pages_to_update.keys()))
