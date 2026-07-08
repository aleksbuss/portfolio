import { test, expect } from '@playwright/test';

test.describe('Rebranding Validation to Agentic AI Engineer', () => {
  test('Hero tagline displays correct title', async ({ page }) => {
    await page.goto('/');
    
    // Check initial English text
    const tagline = page.locator('.hero-tagline');
    await expect(tagline).toContainText('Agentic AI engineer');
    
    // Check German text
    await page.click('#langBtn');
    await expect(tagline).toContainText('Agentic AI Engineer');
  });

  test('CV headers and meta display correct title', async ({ page }) => {
    await page.goto('/CV-EN.html');
    await expect(page).toHaveTitle(/Agentic AI Engineer/);
    await expect(page.locator('.cv-role')).toContainText('Agentic AI Engineer');
    
    await page.goto('/CV.html');
    await expect(page).toHaveTitle(/Agentic AI Engineer/);
    await expect(page.locator('.cv-role')).toContainText('Agentic AI Engineer');
  });
});
