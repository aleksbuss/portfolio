import { webkit } from 'playwright';
import fs from 'fs';

(async () => {
  console.log('🚀 Launching Safari (WebKit)...');
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🌐 1. Scraping Live Website (https://aleksejs-portfolio.pages.dev/)');
  await page.goto('https://aleksejs-portfolio.pages.dev/');
  await page.waitForLoadState('networkidle');
  const websiteText = await page.evaluate(() => document.body.innerText);
  
  const siteDumpPath = '/Users/aleksejsbuss/.gemini/antigravity-ide/brain/c506cb33-8d67-45f2-9d29-26b6a6ddbe44/scratch/live-website-dump.txt';
  fs.writeFileSync(siteDumpPath, websiteText);
  console.log(`✅ Website text dumped to ${siteDumpPath}`);

  console.log('\n🔵 2. Opening LinkedIn...');
  await page.goto('https://www.linkedin.com/in/aleksejs-buss/');
  
  console.log('\n======================================================');
  console.log('⏳ PAUSED FOR LOGIN!');
  console.log('Please log into LinkedIn in the opened browser window.');
  console.log('Once you are on your profile page, click the "Resume" (▶) button');
  console.log('in the Playwright Inspector window to continue scraping!');
  console.log('======================================================\n');
  
  await page.pause();

  console.log('📥 Resumed! Extracting LinkedIn profile data...');
  
  // Wait for the profile to load completely
  try {
    await page.waitForSelector('h1', { timeout: 10000 });
  } catch (e) {
    console.log('Could not find h1, continuing anyway...');
  }

  // Extract everything visible as a raw dump to be safe
  const linkedinText = await page.evaluate(async () => {
    // Scroll a bit to lazy load experience sections
    window.scrollTo(0, document.body.scrollHeight / 2);
    await new Promise(r => setTimeout(r, 2000));
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 2000));
    window.scrollTo(0, 0);
    return document.body.innerText;
  });

  const linkedinDumpPath = '/Users/aleksejsbuss/.gemini/antigravity-ide/brain/c506cb33-8d67-45f2-9d29-26b6a6ddbe44/scratch/live-linkedin-dump.txt';
  fs.writeFileSync(linkedinDumpPath, linkedinText);
  console.log(`✅ LinkedIn text dumped to ${linkedinDumpPath}`);

  await browser.close();
  console.log('🏁 Audit script finished successfully.');
})();
