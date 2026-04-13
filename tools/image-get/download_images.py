#!/usr/bin/env python3
"""
Downloads all images from emmayashinsky.com using Selenium.
Images are saved into subfolders named after each page so you know exactly
which images belong on which Astro page.

Setup (one time):
    pip3 install selenium

Run:
    python3 download_images.py
"""

import os
import re
import time
import urllib.request
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Each entry: (page URL, subfolder name, matching Astro page file)
PAGES = [
    (
        "https://www.emmayashinsky.com/",
        "home",
        "src/pages/index.astro",
    ),
    (
        "https://www.emmayashinsky.com/about-me",
        "about",
        "src/pages/about.astro",
    ),
    (
        "https://www.emmayashinsky.com/projects",
        "projects",
        "src/pages/projects.astro",
    ),
    (
        "https://www.emmayashinsky.com/science-history-institute",
        "science-history-institute",
        "src/pages/science-history-institute.astro",
    ),
    (
        "https://www.emmayashinsky.com/project-details-relache",
        "relache",
        "src/pages/project-details-relache.astro",
    ),
    (
        "https://www.emmayashinsky.com/project-details-anni-albers-poster",
        "anni-albers",
        "src/pages/project-details-anni-albers-poster.astro",
    ),
    (
        "https://www.emmayashinsky.com/project-details-fringe-festival-posters",
        "fringe-festival",
        "src/pages/project-details-fringe-festival-posters.astro",
    ),
    (
        "https://www.emmayashinsky.com/project-details-diamond-chair-poster",
        "diamond-chair",
        "src/pages/project-details-diamond-chair-poster.astro",
    ),
    (
        "https://www.emmayashinsky.com/project-details-climate-change-booklet-copy",
        "phenomenon-magazine",
        "src/pages/project-details-climate-change-booklet-copy.astro",
    ),
    (
        "https://www.emmayashinsky.com/project-details-climate-change-booklet",
        "climate-change-booklet",
        "src/pages/project-details-climate-change-booklet.astro",
    ),
    (
        "https://www.emmayashinsky.com/the-triangle",
        "the-triangle",
        "src/pages/the-triangle.astro",
    ),
]

SKIP_PATTERNS = ["Logos-07", "favicon", "1x1", "placeholder"]
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif")
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")


def safe_filename(url):
    path = urllib.parse.urlparse(url).path
    name = os.path.basename(path).split("?")[0]
    name = re.sub(r"[^\w.\-]", "_", name)
    return name or "image"


def should_skip(url):
    return any(p.lower() in url.lower() for p in SKIP_PATTERNS)


def looks_like_image(url):
    path = urllib.parse.urlparse(url).path.lower().split("?")[0]
    return any(path.endswith(ext) for ext in IMAGE_EXTENSIONS)


def download(url, dest_folder, seen):
    key = url.split("?")[0]
    if key in seen or should_skip(url) or not looks_like_image(url):
        return
    seen.add(key)

    filename = safe_filename(url)
    dest = os.path.join(dest_folder, filename)
    if os.path.exists(dest):
        print(f"    already exists: {filename}")
        return

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            data = r.read()
        with open(dest, "wb") as f:
            f.write(data)
        print(f"    ✓ {filename} ({len(data)//1024} KB)")
    except Exception as e:
        print(f"    ✗ {filename} — {e}")


def collect_image_urls(driver):
    urls = set()
    for el in driver.find_elements(By.TAG_NAME, "img"):
        for attr in ("src", "data-src", "data-lazy-src"):
            val = el.get_attribute(attr)
            if val:
                urls.add(val)
        srcset = el.get_attribute("srcset") or ""
        for part in srcset.split(","):
            u = part.strip().split(" ")[0]
            if u:
                urls.add(u)

    bg_urls = driver.execute_script("""
        const urls = [];
        document.querySelectorAll('*').forEach(el => {
            const bg = window.getComputedStyle(el).backgroundImage;
            if (bg && bg !== 'none') {
                const match = bg.match(/url\\(["']?([^"')]+)["']?\\)/);
                if (match) urls.push(match[1]);
            }
        });
        return urls;
    """)
    for u in (bg_urls or []):
        urls.add(u)

    return urls


def scroll_to_load(driver):
    total_height = driver.execute_script("return document.body.scrollHeight")
    for y in range(0, total_height, 400):
        driver.execute_script(f"window.scrollTo(0, {y});")
        time.sleep(0.15)
    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(0.5)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Saving to: {OUT_DIR}\n")
    print("Each subfolder = one page. Copy images to public/images/<subfolder>/ in your Astro project.\n")

    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1400,900")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=opts)
    seen = set()
    summary = []

    try:
        for page_url, subfolder, astro_file in PAGES:
            folder = os.path.join(OUT_DIR, subfolder)
            os.makedirs(folder, exist_ok=True)

            print(f"━━━ {subfolder} ━━━")
            print(f"  Page:       {page_url}")
            print(f"  Astro file: {astro_file}")
            print(f"  Saving to:  images/{subfolder}/")

            driver.get(page_url)
            time.sleep(2)
            scroll_to_load(driver)
            time.sleep(1)

            urls = collect_image_urls(driver)
            before = len(seen)
            for url in urls:
                url = urllib.parse.urljoin(page_url, url)
                download(url, folder, seen)

            downloaded = len(seen) - before
            summary.append((subfolder, astro_file, downloaded))
            print()

    finally:
        driver.quit()

    # Print a summary map at the end
    print("\n" + "="*60)
    print("SUMMARY — images by page")
    print("="*60)
    for subfolder, astro_file, count in summary:
        print(f"  images/{subfolder}/  →  {astro_file}  ({count} images)")

    print(f"\n✅  Done! All images saved to: {OUT_DIR}")
    print("\nNext steps:")
    print("  1. Copy the entire 'images/' folder into your Astro project's 'public/' folder")
    print("  2. In each .astro file, reference images as /images/<subfolder>/filename.jpg")


if __name__ == "__main__":
    main()
