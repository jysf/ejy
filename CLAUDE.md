# Emma Yashinsky Portfolio — Astro Site

## Overview
This is Emma Yashinsky's graphic design portfolio, built with Astro v6 and hosted on GitHub Pages at `jysf.github.io/ejy`. Content is managed via markdown files with frontmatter.

## Tech Stack
- **Framework**: Astro v6 (static output)
- **Hosting**: GitHub Pages (deployed via GitHub Actions)
- **CMS**: Sveltia CMS at `/admin/` (not fully configured yet)
- **Fonts**: DM Serif Display (headings), Open Sans (body) via Google Fonts
- **Base path**: `/ejy` — all internal paths must use the `asset()` helper from `src/utils.ts`

## Key Directories
- `src/content/projects/` — project markdown files (one per project)
- `src/content/about/` — about page content (singleton)
- `src/content/site/` — site settings: tagline, email, social links (singleton)
- `public/images/` — all images, organized by project slug
- `src/pages/` — Astro page templates
- `src/components/` — reusable components (Nav, Footer, ProjectCard, HeroName)
- `src/styles/global.css` — design tokens and base styles

## Adding a New Project

### 1. Add images
Put project images in `public/images/<project-slug>/` (e.g., `public/images/my-new-project/`).

### 2. Create markdown file
Create `src/content/projects/<project-slug>.md` with this frontmatter:

```markdown
---
title: "Project Title"
date: "Season Year"
tags: ["Tag1", "Tag2"]
featured: false
order: 8
description: "A short description of the project."
images:
  - /images/project-slug/image1.jpg
  - /images/project-slug/image2.jpg
nextProject: other-project-slug
---

Optional body text.
```

### Frontmatter fields
- `title` (string) — project name
- `date` (string) — e.g., "Fall 2025", "Winter 2025"
- `tags` (string[]) — category labels shown on cards
- `featured` (boolean) — if `true`, shows on the home page (3 max)
- `order` (number) — sort position; lower numbers appear first
- `description` (string) — shown on the project detail page
- `images` (string[]) — first image is the card thumbnail; rest appear in the gallery
- `nextProject` (string, optional) — slug of the next project for navigation

### 3. Update project chain (optional)
If you want "View next project" navigation, update the `nextProject` field of the preceding project to point to the new one.

## Editing Existing Content

### About page
Edit `src/content/about/index.md` — change `heading`, `image`, `resumeUrl`, or the body text.

### Site settings
Edit `src/content/site/index.md` — change `tagline`, `email`, `instagram`, `linkedin`, or `resumeUrl`.

### Project content
Edit any file in `src/content/projects/` — update frontmatter fields or reorder images.

## Important Notes

### Base path
All hardcoded paths in `.astro` files MUST use the `asset()` helper from `src/utils.ts`:
```astro
import { asset } from '../utils';
// Use: href={asset('/projects')} and src={asset('/images/...')}
// NOT: href="/projects" or src="/images/..."
```

### Content cache
After changing markdown files, the Astro dev server may not pick up changes immediately. If content doesn't update:
1. Stop the dev server
2. Run `rm -rf .astro`
3. Restart with `npm run dev`

### Design tokens (in `src/styles/global.css`)
- `--deep-charcoal: #1e1e24`
- `--cloud-white: #faf9f8`
- `--burnt-orange: #d54823`
- `--midnight-blue: #14213d`
- `--cloth-blue: #50679a`
- `--terracotta: #ad6245`

## Commands
- `npm run dev` — start dev server at localhost:4321/ejy/
- `npm run build` — build static site to `dist/`
- `npm run preview` — preview built site
- `npm test` — run Playwright tests

## Deployment
Push to `main` branch. GitHub Actions builds and deploys to GitHub Pages automatically.

## Switching to Custom Domain
When ready to use `emmayashinsky.com`:
1. Remove `base: '/ejy'` from `astro.config.mjs`
2. Update `site` to `https://emmayashinsky.com`
3. The `asset()` helper will automatically return plain paths (no prefix)
4. Configure the domain in GitHub repo Settings > Pages > Custom domain
