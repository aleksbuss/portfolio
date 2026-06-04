#!/usr/bin/env node
/**
 * Render public/og-image.svg → public/og-image.png at 1200×630 (OG/Twitter spec).
 *
 * Why a separate raster: Open Graph and Twitter Cards do not reliably render SVG
 * across crawlers (LinkedIn, Slack, iMessage, Discord, Telegram). PNG is the
 * lowest-common-denominator format every social card scraper handles.
 *
 * Implementation: load the SVG inside a minimal HTML host, wait for the Google
 * Fonts (Fraunces / JetBrains Mono) referenced by the SVG to finish loading,
 * then screenshot the viewport. Headless Chromium gives us pixel-identical
 * rendering to what social previews show in real browsers.
 *
 * Usage: `npm run og:build`
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SVG_PATH = join(ROOT, 'public/og-image.svg');
const PNG_PATH = join(ROOT, 'public/og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;

const svg = readFileSync(SVG_PATH, 'utf8');

// Strip the outer <?xml?> / DOCTYPE if present, then drop the SVG into a host
// document that loads the same Google Fonts the live site uses. We force the
// SVG to fill the viewport — the SVG's own viewBox handles aspect ratio.
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>og</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;1,300&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; background: #05060a; }
  body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  svg { display: block; width: ${WIDTH}px; height: ${HEIGHT}px; }
</style>
</head>
<body>
${svg}
</body>
</html>`;

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  // Belt-and-braces: wait for document.fonts.ready so Fraunces / JetBrains Mono
  // are guaranteed loaded before we snap. Fall back to a small delay if the
  // FontFaceSet API isn't available.
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 150));
  });

  await page.screenshot({
    path: PNG_PATH,
    type: 'png',
    fullPage: false,
    omitBackground: false,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });
} finally {
  await browser.close();
}

const bytes = statSync(PNG_PATH).size;
console.log(`✓ og-image.png  ${WIDTH}×${HEIGHT}  ${(bytes / 1024).toFixed(1)} KB  →  ${PNG_PATH}`);
