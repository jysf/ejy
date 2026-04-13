# Developer Guide — Emma Yashinsky Portfolio

## Prerequisites

- Node.js 22+
- npm
- Git

## Getting Started

```bash
git clone https://github.com/jysf/ejy.git
cd ejy
npm install
npm run dev
```

The site runs at `http://localhost:4321/ejy/` (note the `/ejy/` base path).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview the built site |
| `npm test` | Run all Playwright tests |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:links` | Run link integrity tests |
| `npm run test:visual` | Run visual comparison tests |

## Architecture

### Framework
Astro v6 with static output. No server-side rendering — everything is pre-built to HTML at build time.

### Content System
Uses Astro Content Collections with the `glob()` loader (Astro v6 pattern). Schema is defined in `src/content.config.ts`.

Three collections:
- **projects** — `src/content/projects/*.md` — portfolio projects with frontmatter
- **about** — `src/content/about/index.md` — singleton, about page content
- **site** — `src/content/site/index.md` — singleton, global settings (tagline, social links)

### Base Path
The site is hosted at `jysf.github.io/ejy/` which requires a `/ejy` base path. This is configured in `astro.config.mjs` as `base: '/ejy'`.

All hardcoded paths in `.astro` files **must** use the `asset()` helper from `src/utils.ts`:

```astro
---
import { asset } from '../utils';
---
<a href={asset('/projects')}>Projects</a>
<img src={asset('/images/logo.png')} alt="Logo" />
```

The `asset()` function reads `import.meta.env.BASE_URL` and prepends it. When switching to a custom domain, just remove `base` from `astro.config.mjs` — the helper automatically returns plain paths.

**Do not** use bare paths like `href="/projects"` — they will break on GitHub Pages.

### Routing
- `/` — home page (`src/pages/index.astro`)
- `/about` — about page (`src/pages/about.astro`)
- `/projects` — project grid (`src/pages/projects/index.astro`)
- `/projects/[slug]` — project detail (`src/pages/projects/[slug].astro`)
- `/the-triangle` — special standalone page (`src/pages/the-triangle.astro`)
- `/admin/` — Sveltia CMS (static HTML in `public/admin/`)

### Components

| Component | Purpose |
|---|---|
| `BaseLayout.astro` | HTML shell, head tags, Google Fonts, ClientRouter, scroll reveal script |
| `Nav.astro` | Fixed header with logo, nav links, hamburger menu, scroll hide/show |
| `Footer.astro` | Landscape background image, contact links, branded social icons |
| `ProjectCard.astro` | Reusable card with `full`/`half` size variants |
| `HeroName.astro` | "Emma" / "Yashinsky" display with scroll parallax animation |

### Styling
- Global styles in `src/styles/global.css` — CSS custom properties, reset, typography, utilities
- Component styles use Astro's scoped `<style>` blocks
- No CSS framework — all custom CSS
- Responsive breakpoint: 767px

### Design Tokens

```css
--deep-charcoal: #1e1e24    /* body text, nav links */
--cloud-white: #faf9f8      /* backgrounds */
--burnt-orange: #d54823     /* hero name, hover states, accents */
--midnight-blue: #14213d    /* footer text, contact headings */
--cloth-blue: #50679a       /* social icon hover */
--terracotta: #ad6245       /* resume links */
```

Fonts:
- Headings: `DM Serif Display`, serif
- Body: `Open Sans`, sans-serif

### Animations
- **View Transitions**: `ClientRouter` from `astro:transitions` for smooth page navigation
- **Scroll reveal**: IntersectionObserver adds `.visible` class to `.reveal` elements (fade-up)
- **Nav hide/show**: Scroll direction detection, CSS transform
- **Hero name**: Scroll-based parallax via IntersectionObserver

## Deployment

### GitHub Pages (primary)
Push to `main` triggers `.github/workflows/deploy.yml`:
1. Checkout → Node 22 → `npm ci` → `npm run build`
2. Upload `dist/` as Pages artifact
3. Deploy via `actions/deploy-pages@v4`

GitHub Pages must be configured to deploy from **GitHub Actions** (not "Deploy from branch") in repo Settings > Pages.

### Netlify (secondary)
Site exists at `ejy0.netlify.app`. Originally intended as OAuth proxy for CMS. Can be removed or kept dormant.

## Content Cache Issue

After changing markdown files in `src/content/`, the dev server may serve stale data. Fix:

```bash
# Stop dev server, then:
rm -rf .astro
npm run dev
```

## Astro v6 Specifics

These differ from Astro v5 and earlier:

| Feature | Astro v6 | Astro v5 |
|---|---|---|
| Content config | `src/content.config.ts` | `src/content/config.ts` |
| Collection loader | `glob({ pattern, base })` | Automatic by folder |
| Entry identifier | `.id` | `.slug` |
| View transitions | `ClientRouter` | `ViewTransitions` |
| Render content | `import { render } from 'astro:content'` | `entry.render()` |
| Node.js | 22+ required | 20+ |

## CMS (Sveltia CMS)

Admin UI is at `/admin/`. Configuration is in `public/admin/config.yml`. Currently **not functional** — OAuth login doesn't work.

### Options to fix
1. **GitHub Personal Access Token** — user pastes a fine-grained PAT at login. Simplest for 1-2 users
2. **Cloudflare Workers** — deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) as a free OAuth proxy
3. **Fix Netlify OAuth** — get Netlify Identity working with GitHub as external provider

### Local CMS development
```bash
npx @sveltia/cms-proxy-server
# In another terminal:
npm run dev
# Visit http://localhost:4321/ejy/admin/
```

## Testing

Playwright tests are in `tests/`:
- `smoke.spec.ts` — page loads, elements present, no 404s
- `links.spec.ts` — internal/external link integrity
- `visual-comparison.spec.ts` — screenshots vs live site

Tests may need updating after recent layout changes. Not currently run in CI.

## Switching to Custom Domain

When `emmayashinsky.com` is ready:

1. In `astro.config.mjs`:
   - Remove `base: '/ejy'`
   - Change `site` to `'https://emmayashinsky.com'`
2. In `public/admin/config.yml`:
   - Update `site_url` to `https://emmayashinsky.com`
3. In GitHub repo Settings > Pages:
   - Add custom domain `emmayashinsky.com`
   - Enable "Enforce HTTPS"
4. Configure DNS:
   - Add CNAME record pointing to `jysf.github.io`

The `asset()` helper will automatically stop prefixing paths since `BASE_URL` becomes `/`.
