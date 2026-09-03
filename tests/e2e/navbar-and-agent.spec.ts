import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Visual & Functional Verification: New Navbar and AI Agent', () => {
  test('Capture screenshots and verify navbar and agent interaction', async ({ page }) => {
    // 1. Visit homepage and skip boot
    await page.addInitScript(() => {
      sessionStorage.setItem('skip_boot', '1');
    });
    await page.goto('/');
    await page.evaluate(() => {
      document.getElementById('boot')?.remove();
      document.body.style.overflow = '';
    });

    await page.route('**/api/**', route => route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      body: 'Алексей создал 5 систем: Orchestra, 4take, Dictaphone, Moderator и Psycho.',
    }));

    const artifactDir = '/Users/aleksejsbuss/.gemini/antigravity-ide/brain/b6644e0e-c9a3-4b5b-90af-c1ca2bb860a0';

    // 2. Verify desktop navbar exists, is visible and floating
    const sysbar = page.locator('#sysbar');
    await expect(sysbar).toBeVisible();
    await expect(page.locator('.brand-mono .name')).toHaveText('Aleksejs Buss');
    await expect(page.locator('#langBtn')).toBeVisible();
    await expect(page.locator('#themeBtn')).toBeVisible();

    // Screenshot of top hero & navbar
    await page.screenshot({ path: path.join(artifactDir, 'navbar-desktop.png') });

    // 3. Open Agent Panel via #cmdDock
    const cmdDock = page.locator('#cmdDock');
    await cmdDock.click();
    const cmdPanel = page.locator('#cmdPanel');
    await expect(cmdPanel).toBeVisible();
    await expect(cmdPanel).toHaveClass(/open/);

    // Type a question
    const input = page.locator('#cmdInput');
    await input.fill('Привет, какие проекты создал Алексей?');
    await page.locator('#cmdSend').click();

    // Verify user bubble appears
    await expect(page.locator('.cmd-msg.user .body')).toHaveText('Привет, какие проекты создал Алексей?');

    // Wait for agent bubble to have text (live stream or fallback)
    await expect(page.locator('.cmd-msg.agent:last-child .body')).not.toHaveClass(/cmd-thinking/, { timeout: 16000 });
    const agentMsg = await page.locator('.cmd-msg.agent:last-child .body').innerText();
    expect(agentMsg.length).toBeGreaterThan(15);

    // Screenshot of agent panel
    await page.screenshot({ path: path.join(artifactDir, 'agent-panel-response.png') });

    // Close agent panel
    await page.locator('#cmdClose').click();
    await expect(cmdPanel).not.toHaveClass(/open/);

    // 4. Test Mobile Viewport & Drawer
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    // Menu toggle should be visible on mobile
    const menuToggle = page.locator('#menuToggle');
    await expect(menuToggle).toBeVisible();

    // Click hamburger to open drawer
    await menuToggle.click();
    await expect(sysbar).toHaveClass(/menu-open/);
    const drawer = page.locator('#mobileDrawer');
    await expect(drawer).toBeVisible();

    // Screenshot of mobile drawer
    await page.screenshot({ path: path.join(artifactDir, 'navbar-mobile-drawer.png') });

    // Close drawer
    await menuToggle.click();
    await expect(sysbar).not.toHaveClass(/menu-open/);
  });
});
