import { test, expect, type Page } from '@playwright/test';

/**
 * Stub api.github.com so tests do not depend on the unauthenticated
 * 60-req/h rate limit. The site lazily fetches repo metadata for
 * `data-gh-repo` projects; without this stub a busy CI machine produces
 * "403 Failed to load resource" console noise that breaks the smoke test.
 */
test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      stargazers_count: 12,
      pushed_at: '2026-04-20T12:00:00Z',
      language: 'JavaScript',
    }),
  }));
});

/** Skip the 4-second boot animation by removing the overlay early. */
async function skipBoot(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.setItem('skip_boot', '1');
  });
  await page.goto('/');
  await page.evaluate(() => {
    document.getElementById('boot')?.remove();
    document.body.style.overflow = '';
  });
}

test.describe('portfolio · smoke', () => {
  test('homepage loads with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/');
    await expect(page).toHaveTitle(/Aleksejs Buss/);
    // wait for boot to finish
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 8000 });
    // benign Vite HMR pings + browser-prefetched icon variants we don't ship
    const real = errors.filter(e => !/vite|HMR|favicon|apple-touch-icon|robots\.txt/i.test(e));
    expect(real, JSON.stringify(real, null, 2)).toEqual([]);
  });

  test('all critical sections render', async ({ page }) => {
    await skipBoot(page);
    for (const id of ['hero', 'index', 'story', 'values', 'projects', 'stack', 'contact']) {
      await expect(page.locator('#' + id), `section #${id}`).toBeVisible();
    }
    // Sections that should be present in DOM (not necessarily in viewport on first paint)
    await expect(page.locator('.sysbar')).toBeVisible();
    await expect(page.locator('.cmd-dock')).toBeVisible();
  });

  test('hero headline typing produces expected text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#heroName .first .typed-name')).toHaveText('Autonomous AI systems,', { timeout: 12000 });
    await expect(page.locator('#heroName .last .typed-name')).toHaveText('engineered for production.', { timeout: 12000 });
  });

  test('email links use mailto, no Cloudflare obfuscation', async ({ page }) => {
    await skipBoot(page);
    const hrefs = await page.locator('a[href^="mailto:"]').evaluateAll(els => els.map(e => (e as HTMLAnchorElement).href));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const h of hrefs) expect(h).toContain('aleksbuss@gmail.com');
    expect(await page.locator('a[href*="cdn-cgi/l/email-protection"]').count()).toBe(0);
  });
});

test.describe('portfolio · cmd-dock (Ask the Agent)', () => {
  test.beforeEach(async ({ page }) => {
    // Stub the worker so we don't depend on a deployed CF Worker in CI.
    await page.route('**/chat', async route => {
      const sse = [
        'data: {"choices":[{"delta":{"content":"Aleksejs ships five production systems "}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"solo."}}]}\n\n',
        'data: [DONE]\n\n',
      ].join('');
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
        body: sse,
      });
    });
    await skipBoot(page);
  });

  test('opens with click and ⌘K, closes with × and Esc', async ({ page }) => {
    const dock = page.locator('#cmdDock');
    await expect(dock).toBeVisible();

    await dock.click();
    await expect(dock).toHaveClass(/open/);

    await page.locator('#cmdClose').click();
    await expect(dock).not.toHaveClass(/open/);

    // ⌘K (Meta+K on macOS — page.keyboard supports it cross-platform)
    await page.keyboard.press('Meta+K');
    await expect(dock).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(dock).not.toHaveClass(/open/);
  });

  test('closes when clicking outside', async ({ page }) => {
    await page.locator('#cmdDock').click();
    await expect(page.locator('#cmdDock')).toHaveClass(/open/);
    await page.locator('h1#heroName').click({ force: true });
    await expect(page.locator('#cmdDock')).not.toHaveClass(/open/);
  });

  test('sending a message renders user + agent bubbles', async ({ page }) => {
    await page.locator('#cmdDock').click();
    await page.locator('#cmdInput').fill('what is your stack?');
    await page.locator('#cmdSend').click();
    await expect(page.locator('.cmd-msg.user .body')).toHaveText('what is your stack?');
    await expect(page.locator('.cmd-msg.agent .body')).toContainText('Aleksejs ships', { timeout: 5000 });
  });

  test('persists conversation history in localStorage', async ({ page }) => {
    await page.locator('#cmdDock').click();
    await page.locator('#cmdInput').fill('hello');
    await page.locator('#cmdSend').click();
    await expect(page.locator('.cmd-msg.agent .body')).toContainText('Aleksejs', { timeout: 5000 });

    const stored = await page.evaluate(() => localStorage.getItem('agent_history_v1'));
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(2);
    expect(parsed[0].role).toBe('user');
    expect(parsed[0].content).toBe('hello');

    // Reload — history should be restored
    await page.reload();
    await page.evaluate(() => document.getElementById('boot')?.remove());
    await expect(page.locator('.cmd-msg.user .body').first()).toHaveText('hello', { timeout: 5000 });
  });

  test('suggestions trigger a send', async ({ page }) => {
    await page.locator('#cmdDock').click();
    await page.locator('.cmd-sug', { hasText: 'Show projects' }).click();
    await expect(page.locator('.cmd-msg.user .body').first()).toHaveText('Show projects');
  });
});

test.describe('portfolio · theme + i18n', () => {
  test.beforeEach(async ({ page }) => { await skipBoot(page); });

  test('theme toggle flips data-theme and persists', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await page.evaluate(() => document.getElementById('boot')?.remove());
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('lang toggle flips text and lang attribute', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.locator('#langBtn').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('.contact-eye')).toContainText('Kontakt');
  });
});

test.describe('portfolio · case-study modals', () => {
  test('clicking "Read case study" on flagship project opens modal', async ({ page }) => {
    await skipBoot(page);
    const cta = page.locator('.proj').first().locator('.proj-cta');
    await cta.click();
    await expect(page.locator('#caseModal')).toBeVisible();
    await expect(page.locator('.case-title')).toContainText('Orchestra');
    await page.locator('#caseModalClose').click();
    await expect(page.locator('#caseModal')).not.toBeVisible();
  });
});

test.describe('portfolio · accessibility & SEO', () => {
  test('has Person JSON-LD', async ({ page }) => {
    await page.goto('/');
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(ld).toBeTruthy();
    const json = JSON.parse(ld!);
    expect(json['@type']).toBe('Person');
    expect(json.name).toBe('Aleksejs Buss');
    expect(json.email).toContain('aleksbuss@gmail.com');
  });

  test('has Open Graph + Twitter meta', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Aleksejs Buss/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('robots.txt and sitemap.xml are served', async ({ page }) => {
    const robots = await page.request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');
    const sitemap = await page.request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('<urlset');
  });
});
