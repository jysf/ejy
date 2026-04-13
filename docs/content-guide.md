# Content Guide — Emma Yashinsky Portfolio

This guide explains how to update your portfolio content. All changes are made by editing files in the project and pushing to GitHub, which automatically rebuilds the site.

## Quick Reference

| What to change | File to edit |
|---|---|
| Add a new project | Create `src/content/projects/your-project.md` |
| Edit a project | Edit `src/content/projects/<project-name>.md` |
| Change your bio | Edit `src/content/about/index.md` |
| Update your resume link | Edit `src/content/about/index.md` |
| Change tagline | Edit `src/content/site/index.md` |
| Update email/social links | Edit `src/content/site/index.md` |

---

## Adding a New Project

### Step 1: Add your images

Put your project images in a new folder:
```
public/images/your-project-name/
```

Name the folder using lowercase with hyphens (e.g., `spring-campaign`, `logo-redesign`).

### Step 2: Create the project file

Create a new file at `src/content/projects/your-project-name.md` with this template:

```markdown
---
title: "Your Project Title"
date: "Season Year"
tags: ["Tag1", "Tag2"]
featured: false
order: 8
description: "A one or two sentence description of the project."
images:
  - /images/your-project-name/image1.jpg
  - /images/your-project-name/image2.jpg
  - /images/your-project-name/image3.jpg
nextProject: another-project-slug
---

Optional longer description that appears on the project page.
```

### What each field means

- **title** — The project name displayed on the site
- **date** — When the project was made (e.g., "Fall 2025", "Winter 2025")
- **tags** — Categories that appear under the title (e.g., "Branding", "Typography", "Publication")
- **featured** — Set to `true` to show on the home page (only 3 projects can be featured)
- **order** — Controls the display order. Lower numbers appear first. Current projects use 1-7
- **description** — Short summary shown on the project detail page
- **images** — List of image paths. The first image is used as the thumbnail on cards. The rest appear in the project gallery
- **nextProject** — The filename (without `.md`) of the next project, used for the "View next project" button. Leave this out if you don't want the button

### Step 3: Push your changes

```
git add -A
git commit -m "Add new project: Your Project Title"
git push
```

The site rebuilds automatically and your new project appears within a few minutes.

---

## Editing an Existing Project

Open the project file in `src/content/projects/` and change any fields. For example, to update the description of the Science History Institute project, edit `src/content/projects/science-history-institute.md`.

### Adding more images to a project

1. Put the new images in the project's folder under `public/images/`
2. Add the image paths to the `images` list in the markdown file
3. The first image in the list is always the thumbnail

### Reordering images

Change the order of paths in the `images` list. The first one becomes the thumbnail.

### Changing which projects are featured on the home page

Set `featured: true` on up to 3 projects and `featured: false` on the rest. The home page shows the 3 featured projects sorted by their `order` number.

---

## Updating Your Bio

Edit `src/content/about/index.md`:

```markdown
---
heading: "Hi, I'm Emma!"
resumeUrl: "https://link-to-your-resume.pdf"
image: /images/about/your-photo.jpg
---

Your bio text goes here. You can write multiple paragraphs.

This is a second paragraph. Regular markdown formatting works — **bold**, *italic*, [links](https://example.com).
```

To change your photo, put the new image in `public/images/about/` and update the `image` path.

---

## Updating Site Settings

Edit `src/content/site/index.md`:

```markdown
---
tagline: "Your tagline that appears on the home page"
email: emma.yashinsky@gmail.com
resumeUrl: "https://link-to-your-resume.pdf"
instagram: "https://www.instagram.com/emmayashinsky/"
linkedin: "https://www.linkedin.com/in/emma-yashinsky/"
---
```

---

## Current Projects

| # | Project | Featured | Slug (filename) |
|---|---|---|---|
| 1 | Science History Institute | Yes | `science-history-institute` |
| 2 | Relâche Logo Design | Yes | `relache-logo-design` |
| 3 | Anni Albers Poster | Yes | `anni-albers-poster` |
| 4 | Diamond Chair Poster | No | `diamond-chair-poster` |
| 5 | Fringe Festival Posters | No | `fringe-festival-posters` |
| 6 | Phenomenon Magazine | No | `phenomenon-magazine` |
| 7 | Climate Change Booklet | No | `climate-change-booklet` |
| 8 | The Triangle | Special | `the-triangle` |

The Triangle has its own dedicated page and doesn't appear in the normal project grid.

---

## Tips

- **Image size**: Use optimized/compressed images. Large images slow down the site. Aim for under 500KB per image
- **Image format**: JPG works best for photos. PNG for graphics with transparency
- **Naming**: Use lowercase filenames with hyphens, no spaces (e.g., `poster-mockup.jpg` not `Poster Mockup.jpg`)
- **Preview locally**: Before pushing, you can preview changes by running `npm run dev` in the terminal and visiting `http://localhost:4321/ejy/`
