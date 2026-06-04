#!/usr/bin/env node
/** Snap mobile-viewport screenshots to verify touch target floor + glass surfaces. */
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
    await page.waitForTimeout(400);
    const out = `/tmp/portfolio-mobile-${theme}.png`;
    await page.screenshot({ path: out, fullPage: false });
    // Measure sysbtn height
    const h = await page.locator('.sysbtn').first().evaluate(el => el.getBoundingClientRect().height);
    console.log(`✓ ${theme} → ${out}  ·  sysbtn height = ${h.toFixed(1)}px`);
  }
} finally {
  await browser.close();
}
