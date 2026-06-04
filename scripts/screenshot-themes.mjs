#!/usr/bin/env node
/**
 * Snap top-of-page screenshots in both themes against the running dev server.
 * Used as a one-off visual diff aid — not part of the test suite.
 */
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
    await page.waitForTimeout(400);
    const top = `/tmp/portfolio-${theme}-top.png`;
    await page.screenshot({ path: top, clip: { x: 0, y: 0, width: 1440, height: 280 } });
    // Scroll to projects to capture pills + cmd-dock at bottom
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const projects = `/tmp/portfolio-${theme}-projects.png`;
    await page.screenshot({ path: projects });
    console.log(`✓ ${theme} → ${top} + ${projects}`);
  }
} finally {
  await browser.close();
}
