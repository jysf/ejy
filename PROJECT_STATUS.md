# Emma Yashinsky Portfolio — Project Status

## What Was Done

### Migration from Webflow to Astro
Migrated emmayashinsky.com from Webflow to a self-hosted Astro v6 static site.

### Infrastructure
- **Astro v6** with static output, content collections using `glob()` loader
- **GitHub Pages** hosting at `jysf.github.io/ejy` with `/ejy` base path
- **GitHub Actions** workflow (`.github/workflows/deploy.yml`) — auto-deploys on push to `main`
- **Sveltia CMS** admin UI at `/admin/` (partially configured — OAuth login not working yet)
- **Netlify** site at `ejy0.netlify.app` intended as OAuth proxy but not functional
- **Playwright tests** — 27 tests (smoke, links, visual comparison) configured but not run in CI
- **`asset()` helper** (`src/utils.ts`) — prefixes all paths with `/ejy` base path; remove `base` from `astro.config.mjs` when switching to custom domain

### Pages Built
1. **Home** (`src/pages/index.astro`) — hero image, "Emma Yashinsky" name in burnt orange with overlap, 3 featured projects in 3-column grid, tagline section
2. **About** (`src/pages/about.astro`) — gold (#c9a96e) background hero with B&W photo, bio, centered contact section with branded social icons, "Recent Works" with horizontal card layout (image left, info right)
3. **Projects** (`src/pages/projects/index.astro`) — alternating full/half grid layout, The Triangle special card at bottom
4. **Project Detail** (`src/pages/projects/[slug].astro`) — hero image, metadata, image gallery, "View next project" chain
5. **The Triangle** (`src/pages/the-triangle.astro`) — special 2-column layout with image pairs

### Components
- **Nav** (`src/components/Nav.astro`) — fixed header, logo left, links right, hamburger on mobile, scroll hide/show
- **Footer** (`src/components/Footer.astro`) — landscape photo background, left-aligned content, midnight blue text, branded filled Instagram/LinkedIn SVG icons
- **ProjectCard** (`src/components/ProjectCard.astro`) — reusable card with full/half size variants
- **HeroName** (`src/components/HeroName.astro`) — "Emma" / "Yashinsky" display in burnt orange with scroll parallax, -200px margin to overlap hero image

### Content Collections
- **Projects** (`src/content/projects/`) — 8 markdown files with frontmatter (title, date, tags, featured, order, description, images, nextProject)
- **About** (`src/content/about/index.md`) — heading, resumeUrl, image, body markdown
- **Site** (`src/content/site/index.md`) — tagline, email, resumeUrl, instagram, linkedin
- **Schema** defined in `src/content.config.ts`

### Design Tokens (`src/styles/global.css`)
- Fonts: DM Serif Display (headings), Open Sans (body)
- Colors: `--deep-charcoal: #1e1e24`, `--cloud-white: #faf9f8`, `--burnt-orange: #d54823`, `--midnight-blue: #14213d`, `--cloth-blue: #50679a`, `--terracotta: #ad6245`
- Animations: scroll reveal (fade-up via IntersectionObserver), nav hide/show, view transitions (ClientRouter)

### Project Order
1. Science History Institute (featured)
2. Relâche Logo Design (featured)
3. Anni Albers Poster (featured)
4. Diamond Chair Poster
5. Fringe Festival Posters
6. Phenomenon Magazine
7. Climate Change Booklet
8. The Triangle (special page, excluded from normal grid)

### About Page "Recent Works" (descending order)
- Climate Change Booklet
- Phenomenon Magazine
- Fringe Festival Posters

## What Still Needs Work

### Missing Images
These projects have empty `images: []` because Webflow served them as CSS backgrounds:
- **Fringe Festival Posters** — no images downloaded
- **Climate Change Booklet** — no images downloaded
- **Diamond Chair Poster** — has 1 image, may need more

To fix: save images from the live site, put in `public/images/<slug>/`, update the markdown frontmatter.

### CMS Login (Sveltia CMS)
OAuth login at `/admin/` is not working. Tried:
- Netlify Git Gateway — not supported by Sveltia CMS
- Netlify as OAuth proxy with `base_url` — Netlify Identity `/auth` endpoint returns 404
- GitHub OAuth App is created but the proxy isn't functional

**Options to fix:**
1. **GitHub Personal Access Token** — simplest, paste token at login (fine for 1-2 users)
2. **Cloudflare Workers OAuth proxy** — deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) as a free Cloudflare Worker
3. **Fix Netlify OAuth** — needs Identity properly enabled with GitHub as external provider

### Custom Domain
When ready to point `emmayashinsky.com`:
1. Remove `base: '/ejy'` from `astro.config.mjs`
2. Change `site` to `https://emmayashinsky.com`
3. Configure domain in GitHub repo Settings > Pages > Custom domain
4. Update `public/admin/config.yml` `site_url`

### Visual Refinement
- Footer layout could be tweaked to match live site more precisely (edit `src/components/Footer.astro`)
- Some spacing/padding differences from live site remain
- Email link color in footer may still show as charcoal instead of midnight blue (global CSS specificity issue)

### Tests
- Playwright tests exist (`tests/smoke.spec.ts`, `tests/links.spec.ts`, `tests/visual-comparison.spec.ts`)
- Not running in CI (removed from deploy workflow)
- May need updating after all the layout changes
- Run locally with `npm test`

### Netlify
- Site exists at `ejy0.netlify.app` with the Astro site deployed
- Currently consuming 15 credits per deploy on free tier
- Can be removed or kept as OAuth proxy only (disable auto-deploys to save credits)

## File Structure
```
ejy/
├── astro.config.mjs          # site: jysf.github.io, base: /ejy
├── src/
│   ├── content.config.ts      # collection schemas (glob loader)
│   ├── utils.ts               # asset() helper for base path
│   ├── styles/global.css      # design tokens, base styles
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   ├── HeroName.astro
│   │   └── ScrollReveal.astro
│   ├── content/
│   │   ├── projects/          # 8 .md files
│   │   ├── about/index.md
│   │   └── site/index.md
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── the-triangle.astro
│       └── projects/
│           ├── index.astro
│           └── [slug].astro
├── public/
│   ├── .nojekyll
│   ├── admin/
│   │   ├── index.html         # Sveltia CMS loader
│   │   └── config.yml         # CMS collection config
│   └── images/                # all project images
├── .github/workflows/deploy.yml
├── playwright.config.ts
├── tests/
├── CLAUDE.md                  # instructions for Claude Code
└── PROJECT_STATUS.md          # this file
```

## Astro v6 Gotchas (for reference)
- Content config must be at `src/content.config.ts` (not `src/content/config.ts`)
- Use `.id` not `.slug` for collection entries
- Use `ClientRouter` not `ViewTransitions`
- Use `render(entry)` imported from `astro:content`, not `entry.render()`
- Requires Node.js 22+
