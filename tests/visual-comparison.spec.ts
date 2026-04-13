import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const screenshotDir = path.join(__dirname, 'screenshots');

const pages = [
  { local: '/', live: 'https://www.emmayashinsky.com/', name: 'home' },
  { local: '/about', live: 'https://www.emmayashinsky.com/about-me', name: 'about' },
  { local: '/projects', live: 'https://www.emmayashinsky.com/projects', name: 'projects' },
  { local: '/projects/science-history-institute', live: 'https://www.emmayashinsky.com/science-history-institute', name: 'project-shi' },
  { local: '/the-triangle', live: 'https://www.emmayashinsky.com/the-triangle', name: 'the-triangle' },
];

test.beforeAll(async () => {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
});

for (const p of pages) {
  test(`Visual comparison: ${p.name}`, async ({ page }) => {
    // Screenshot local version
    await page.goto(p.local);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(screenshotDir, `${p.name}-local.png`),
      fullPage: true,
    });

    // Screenshot live version
    await page.goto(p.live);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(screenshotDir, `${p.name}-live.png`),
      fullPage: true,
    });
  });
}

test.afterAll(async () => {
  // Generate comparison report
  const files = fs.readdirSync(screenshotDir).filter((f) => f.endsWith('-local.png'));
  const names = files.map((f) => f.replace('-local.png', ''));

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Visual Comparison Report</title>
  <style>
    body { font-family: system-ui; max-width: 1400px; margin: 0 auto; padding: 20px; }
    h1 { text-align: center; }
    .comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
    .comparison img { width: 100%; border: 1px solid #ddd; }
    .label { font-weight: bold; text-align: center; margin-bottom: 8px; }
  </style>
</head>
<body>
  <h1>Visual Comparison: Local vs Live</h1>
  ${names
    .map(
      (name) => `
  <h2>${name}</h2>
  <div class="comparison">
    <div>
      <div class="label">Local (Astro)</div>
      <img src="${name}-local.png" />
    </div>
    <div>
      <div class="label">Live (Webflow)</div>
      <img src="${name}-live.png" />
    </div>
  </div>`
    )
    .join('\n')}
</body>
</html>`;

  fs.writeFileSync(path.join(screenshotDir, 'comparison-report.html'), html);
});
