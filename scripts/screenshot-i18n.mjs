#!/usr/bin/env node
/** Side-by-side EN/DE screenshots of the sections that the user flagged as
 * partially translated. Verifies bio paragraphs + timeline + values + projects
 * + stack + contact all flip language. */
import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:5193/';
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => sessionStorage.setItem('skip_boot', '1'));
  for (const lang of ['en', 'de']) {
    await page.addInitScript((l) => localStorage.setItem('lang', l), lang);
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('boot')?.remove());
    await page.waitForTimeout(700);
    for (const sel of ['#hero', '#story', '#values', '#projects', '#stack', '#contact', 'footer']) {
      const out = `/tmp/i18n-${lang}-${sel.replace(/[^\w]/g, '')}.png`;
      const loc = page.locator(sel);
      if (await loc.count()) {
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        await loc.screenshot({ path: out });
      }
    }
    console.log(`✓ ${lang} captured`);
  }
} finally {
  await browser.close();
}
