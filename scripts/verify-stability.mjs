import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Testing normal real-user boot sequence on http://localhost:5173...');

  // Track bounding box and layout shifts of #heroName
  const layoutShifts = [];
  await page.exposeFunction('onLayoutShift', (entry) => {
    layoutShifts.push(entry);
  });

  await page.addInitScript(() => {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.onLayoutShift({ value: entry.value });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  const startTime = Date.now();
  await page.goto('http://localhost:5173');

  // Monitor bounding rect across 5 seconds of load
  const rects = [];
  for (let i = 0; i < 50; i++) {
    const box = await page.locator('#heroName').boundingBox();
    const bootCount = await page.locator('#boot').count();
    const bootGone = bootCount > 0 ? await page.locator('#boot').evaluate(el => el.classList.contains('gone')) : true;
    rects.push({
      time: Date.now() - startTime,
      box,
      bootCount,
      bootGone
    });
    await page.waitForTimeout(100);
  }

  // Take screenshot when hero is fully visible
  await page.screenshot({
    path: '/Users/aleksejsbuss/.gemini/antigravity-ide/brain/b6644e0e-c9a3-4b5b-90af-c1ca2bb860a0/hero-real-boot-stable.png'
  });

  await browser.close();

  // Analyze heights and positions after boot begins to fade out
  const visibleRects = rects.filter(r => r.bootGone);
  const heights = [...new Set(visibleRects.map(r => Math.round(r.box?.height || 0)))];
  const widths = [...new Set(visibleRects.map(r => Math.round(r.box?.width || 0)))];
  const xPositions = [...new Set(visibleRects.map(r => Math.round(r.box?.x || 0)))];

  console.log('=== STABILITY MEASUREMENT REPORT ===');
  console.log('Unique Heights after boot fade:', heights);
  console.log('Unique Widths after boot fade:', widths);
  console.log('Unique X positions after boot fade:', xPositions);
  console.log('Total recorded layout shift events:', layoutShifts.length);
  const totalCLS = layoutShifts.reduce((acc, s) => acc + s.value, 0);
  console.log('Cumulative Layout Shift (CLS):', totalCLS.toFixed(4));
}

run().catch(console.error);
