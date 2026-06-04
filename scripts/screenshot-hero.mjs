#!/usr/bin/env node
/** Capture the full hero section in both themes — verify waveform visualization. */
import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:5193/';
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => sessionStorage.setItem('skip_boot', '1'));
  for (const theme of ['dark', 'light']) {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('boot')?.remove());
    await page.waitForTimeout(2200); // let waveform render + transcript type
    const out = `/tmp/portfolio-hero-${theme}.png`;
    await page.locator('#hero').screenshot({ path: out });
    console.log(`✓ ${theme} → ${out}`);
  }
} finally {
  await browser.close();
}
