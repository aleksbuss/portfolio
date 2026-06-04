#!/usr/bin/env node
/** Mobile viewport: viz must use SVG fallback (no Three.js download). */
import { chromium, devices } from 'playwright';

const URL = process.env.URL || 'http://localhost:5193/';
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ ...devices['iPhone 14'] });
  const page = await ctx.newPage();
  await page.addInitScript(() => sessionStorage.setItem('skip_boot', '1'));
  for (const theme of ['dark', 'light']) {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('boot')?.remove());
    await page.waitForTimeout(1500);
    const out = `/tmp/viz-mobile-${theme}.png`;
    const viz = page.locator('#heroViz');
    if (await viz.count()) await viz.scrollIntoViewIfNeeded();
    await viz.screenshot({ path: out });
    const diag = await page.evaluate(() => {
      const root = document.getElementById('heroViz');
      return {
        hasStaticClass: root?.classList.contains('viz-static'),
        coarse: window.matchMedia('(pointer: coarse)').matches,
      };
    });
    console.log(`✓ ${theme} → ${out}`, diag);
  }
} finally {
  await browser.close();
}
