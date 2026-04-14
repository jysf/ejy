# Emma Yashinsky Portfolio — Task Runner

# Default: list available commands
default:
    @just --list

# ─── Development ───────────────────────────────────────────

# Start dev server
dev:
    npm run dev

# Build the site
build:
    npm run build

# Preview the built site
preview:
    npm run preview

# Clean Astro cache and rebuild (fixes stale content)
clean:
    rm -rf .astro node_modules/.astro dist
    npm run build

# Clean cache and start dev server
fresh:
    rm -rf .astro node_modules/.astro
    npm run dev

# ─── Testing ───────────────────────────────────────────────

# Run all tests
test:
    npm test

# Run smoke tests only
test-smoke:
    npx playwright test tests/smoke.spec.ts

# Run link tests only
test-links:
    npx playwright test tests/links.spec.ts

# Run visual comparison tests
test-visual:
    npx playwright test tests/visual-comparison.spec.ts

# ─── Content ───────────────────────────────────────────────

# Create a new project: just new-project "my-project" "My Project Title"
new-project slug title:
    #!/usr/bin/env bash
    set -euo pipefail

    # Find the highest order number
    max_order=$(grep -h 'order:' src/content/projects/*.md | grep -o '[0-9]*' | sort -n | tail -1)
    next_order=$((max_order + 1))

    # Create image directory
    mkdir -p "public/images/{{slug}}"

    # Create markdown file
    cat > "src/content/projects/{{slug}}.md" << 'FRONTMATTER'
    ---
    title: "{{title}}"
    date: ""
    tags: []
    featured: false
    order: ORDER_PLACEHOLDER
    description: ""
    images: []
    ---
    FRONTMATTER

    # Fix indentation and insert order
    sed -i '' 's/^    //' "src/content/projects/{{slug}}.md"
    sed -i '' "s/ORDER_PLACEHOLDER/${next_order}/" "src/content/projects/{{slug}}.md"

    echo "Created:"
    echo "  src/content/projects/{{slug}}.md (order: ${next_order})"
    echo "  public/images/{{slug}}/"
    echo ""
    echo "Next steps:"
    echo "  1. Add images to public/images/{{slug}}/"
    echo "  2. Edit src/content/projects/{{slug}}.md"
    echo "     - Set date, tags, description"
    echo "     - Add image paths to images list"
    echo "     - Set featured: true if needed"

# Add images to a project from a source directory
add-images slug source:
    #!/usr/bin/env bash
    set -euo pipefail
    mkdir -p "public/images/{{slug}}"
    cp "{{source}}"/* "public/images/{{slug}}/" 2>/dev/null || cp "{{source}}" "public/images/{{slug}}/"
    echo "Copied images to public/images/{{slug}}/"
    echo ""
    echo "Files:"
    ls -1 "public/images/{{slug}}/"
    echo ""
    echo "Add these to src/content/projects/{{slug}}.md:"
    for f in public/images/{{slug}}/*; do
        echo "  - /images/{{slug}}/$(basename "$f")"
    done

# List all projects with their order and featured status
list-projects:
    #!/usr/bin/env bash
    echo "# | Featured | Title"
    echo "--|----------|------"
    for f in src/content/projects/*.md; do
        order=$(grep 'order:' "$f" | grep -o '[0-9]*')
        featured=$(grep 'featured:' "$f" | grep -o 'true\|false')
        title=$(grep '^title:' "$f" | head -1 | sed 's/^title: *//' | sed 's/^"//' | sed 's/"$//')
        echo "${order} | ${featured} | ${title}"
    done | sort -n

# Show which projects have missing images
check-images:
    #!/usr/bin/env bash
    echo "Checking project images..."
    echo ""
    has_issues=false
    for f in src/content/projects/*.md; do
        slug=$(basename "$f" .md)
        images=$(grep -c '^ *- /images/' "$f" 2>/dev/null || true)
        images=${images:-0}
        if [ "$images" -eq 0 ]; then
            echo "⚠  ${slug}: no images"
            has_issues=true
        else
            # Check if first image file exists
            first_img=$(grep '^ *- /images/' "$f" | head -1 | sed 's/^ *- //')
            if [ ! -f "public${first_img}" ]; then
                echo "⚠  ${slug}: first image missing (public${first_img})"
                has_issues=true
            else
                echo "✓  ${slug}: ${images} images"
            fi
        fi
    done
    if [ "$has_issues" = true ]; then
        echo ""
        echo "Some projects need images. Save from live site and run:"
        echo "  just add-images <slug> <path-to-images>"
    fi

# ─── Deploy ────────────────────────────────────────────────

# Build and verify before pushing
preflight:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Building..."
    npm run build
    echo ""
    echo "Build output:"
    ls -1 dist/
    echo ""
    page_count=$(find dist -name 'index.html' | wc -l | tr -d ' ')
    echo "Pages built: ${page_count}"
    echo ""
    echo "Checking for broken image references..."
    broken=0
    for img in $(grep -roh 'src="/ejy/images/[^"]*"' dist/ | sed 's/src="\/ejy//' | sed 's/"//' | sort -u); do
        if [ ! -f "public${img}" ]; then
            echo "  Missing: ${img}"
            broken=$((broken + 1))
        fi
    done
    if [ "$broken" -eq 0 ]; then
        echo "  All image references valid"
    fi
    echo ""
    echo "Ready to push: git add -A && git commit -m 'your message' && git push"

# Git add, commit with message, and push
ship message:
    git add -A
    git commit -m "{{message}}"
    git push

# ─── Utilities ─────────────────────────────────────────────

# Show site status
status:
    #!/usr/bin/env bash
    echo "Site: https://jysf.github.io/ejy/"
    echo "Repo: https://github.com/jysf/ejy"
    echo ""
    echo "Projects: $(ls src/content/projects/*.md | wc -l | tr -d ' ')"
    echo "Featured: $(grep -l 'featured: true' src/content/projects/*.md | wc -l | tr -d ' ')"
    echo ""
    echo "Git status:"
    git status --short
    echo ""
    echo "Last commit:"
    git log --oneline -1

# Optimize images in a directory (requires imagemagick)
optimize-images dir:
    #!/usr/bin/env bash
    if ! command -v convert &> /dev/null; then
        echo "ImageMagick not installed. Run: brew install imagemagick"
        exit 1
    fi
    echo "Optimizing images in {{dir}}..."
    for f in "{{dir}}"/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
        [ -f "$f" ] || continue
        size_before=$(stat -f%z "$f")
        convert "$f" -strip -quality 85 -resize '2000x2000>' "$f"
        size_after=$(stat -f%z "$f")
        saved=$(( (size_before - size_after) / 1024 ))
        echo "  $(basename "$f"): saved ${saved}KB"
    done
