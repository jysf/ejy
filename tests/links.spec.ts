import { test, expect } from '@playwright/test';

test('All internal nav links resolve (no 404s)', async ({ page }) => {
  await page.goto('/');

  const links = await page.locator('a[href^="/"]').evaluateAll((els) =>
    [...new Set(els.map((el) => el.getAttribute('href')).filter(Boolean))]
  );

  for (const href of links) {
    const response = await page.goto(href!);
    expect(response?.status(), `${href} should return 200`).toBe(200);
  }
});

test('All project card links on home page resolve', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('.project-card').evaluateAll((els) =>
    els.map((el) => el.getAttribute('href')).filter(Boolean)
  );

  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs) {
    const response = await page.goto(href!);
    expect(response?.status(), `${href} should return 200`).toBe(200);
  }
});

test('All project card links on projects page resolve', async ({ page }) => {
  await page.goto('/projects');
  const hrefs = await page.locator('.project-card, .triangle-card').evaluateAll((els) =>
    els.map((el) => el.getAttribute('href')).filter(Boolean)
  );

  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs) {
    const response = await page.goto(href!);
    expect(response?.status(), `${href} should return 200`).toBe(200);
  }
});

test('External links are properly formed', async ({ page }) => {
  await page.goto('/');

  // Check email mailto link exists
  const mailto = page.locator('a[href^="mailto:"]');
  await expect(mailto.first()).toBeVisible();

  // Check social links have proper URLs
  const socialLinks = page.locator('.social-link');
  const count = await socialLinks.count();
  expect(count).toBeGreaterThanOrEqual(2);

  for (let i = 0; i < count; i++) {
    const href = await socialLinks.nth(i).getAttribute('href');
    expect(href).toMatch(/^https:\/\//);
  }
});

test('Resume link points to a PDF', async ({ page }) => {
  await page.goto('/about');
  const resumeLink = page.locator('.resume-link').first();
  const href = await resumeLink.getAttribute('href');
  expect(href).toMatch(/\.pdf/);
});

test('Images on project detail pages have valid src attributes', async ({ page }) => {
  await page.goto('/projects/science-history-institute');
  const images = page.locator('.project-detail img');
  const count = await images.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const src = await images.nth(i).getAttribute('src');
    expect(src, `Image ${i} should have a src`).toBeTruthy();
    expect(src).toMatch(/^\/images\//);
  }
});
