#!/usr/bin/env node
/** Tight crop of the hero viz frame — full-resolution, both themes. */
import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:5193/';
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => sessionStorage.setItem('skip_boot', '1'));
  for (const theme of ['dark', 'light']) {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('boot')?.remove());
    await page.waitForTimeout(2500);
    const out = `/tmp/viz-${theme}.png`;
    await page.locator('#heroViz').screenshot({ path: out });
    // Also dump diagnostic info
    const diag = await page.evaluate(() => {
      const root = document.getElementById('heroViz');
      const canvas = document.getElementById('heroVizCanvas');
      const ctx2 = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return {
        hasStaticClass: root?.classList.contains('viz-static'),
        canvasW: canvas.width,
        canvasH: canvas.height,
        rectW: canvas.getBoundingClientRect().width,
        rectH: canvas.getBoundingClientRect().height,
        webgl: !!ctx2,
      };
    });
    console.log(`✓ ${theme} → ${out}`, diag);
  }
} finally {
  await browser.close();
}
