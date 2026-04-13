import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/projects', name: 'Projects' },
  { path: '/projects/science-history-institute', name: 'Science History Institute' },
  { path: '/projects/relache-logo-design', name: 'Relache Logo Design' },
  { path: '/projects/anni-albers-poster', name: 'Anni Albers Poster' },
  { path: '/projects/fringe-festival-posters', name: 'Fringe Festival Posters' },
  { path: '/projects/diamond-chair-poster', name: 'Diamond Chair Poster' },
  { path: '/projects/phenomenon-magazine', name: 'Phenomenon Magazine' },
  { path: '/projects/climate-change-booklet', name: 'Climate Change Booklet' },
  { path: '/the-triangle', name: 'The Triangle' },
];

for (const route of routes) {
  test(`${route.name} (${route.path}) returns 200 and has basic structure`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);

    // Every page has a title
    await expect(page).toHaveTitle(/.+/);

    // Every page has nav and footer
    await expect(page.locator('header.header')).toBeVisible();
    await expect(page.locator('footer.footer')).toBeVisible();

    // Nav has logo and links
    await expect(page.locator('.nav-logo')).toBeVisible();
    await expect(page.locator('.nav-link')).toHaveCount(2);
  });
}

test('Home page shows exactly 3 featured project cards', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.featured-grid .project-card');
  await expect(cards).toHaveCount(3);
});

test('Home page has tagline section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tagline')).toBeVisible();
});

test('Home page has hero name display', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.first-name')).toHaveText('Emma');
  await expect(page.locator('.last-name')).toHaveText('Yashinsky');
});

test('Projects page shows all 7 regular projects', async ({ page }) => {
  await page.goto('/projects');
  const cards = page.locator('.projects-grid .project-card');
  await expect(cards).toHaveCount(7);
});

test('Projects page has The Triangle section', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.triangle-card')).toBeVisible();
});

test('Project detail pages have title, date, tags', async ({ page }) => {
  await page.goto('/projects/science-history-institute');
  await expect(page.locator('.project-title')).toBeVisible();
  await expect(page.locator('.project-date')).toBeVisible();
  await expect(page.locator('.project-tags')).toBeVisible();
});

test('Project detail pages have "View next project" or "View More Work" button', async ({ page }) => {
  await page.goto('/projects/science-history-institute');
  await expect(page.locator('.project-nav .button')).toBeVisible();
});

test('The Triangle page has unique 2-column layout', async ({ page }) => {
  await page.goto('/the-triangle');
  await expect(page.locator('.triangle-hero-grid')).toBeVisible();
  // Should NOT have standard project metadata
  await expect(page.locator('.project-tags')).not.toBeVisible();
});

test('About page has bio and resume link', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('.about-heading')).toBeVisible();
  await expect(page.locator('.about-bio')).toBeVisible();
  await expect(page.locator('.resume-link').first()).toBeVisible();
});

test('Sveltia CMS admin page loads', async ({ page }) => {
  const response = await page.goto('/admin');
  expect(response?.status()).toBe(200);
});
