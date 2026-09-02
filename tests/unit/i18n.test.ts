import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('i18n basic switching', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="langBtn"><span class="lbl">DE</span></button>
      <span class="hero-tagline">Agentic AI engineer for early-stage teams.<br>
      <em>Production AI systems</em>, built & operated.</span>
      <span class="contact-eye">§ VI — Connect &amp; Hire</span>
    `;
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  it('starts in English by default', async () => {
    const { initI18n } = await import('../../src/i18n');
    initI18n();
    expect(document.documentElement.lang).toBe('en');
  });

  it('persists language choice', async () => {
    const { initI18n } = await import('../../src/i18n');
    localStorage.setItem('lang', 'de');
    initI18n();
    expect(document.documentElement.lang).toBe('de');
  });

  it('switches to DE when button clicked', async () => {
    const { initI18n } = await import('../../src/i18n');
    initI18n();
    const btn = document.getElementById('langBtn') as HTMLButtonElement;
    btn.click();
    expect(document.documentElement.lang).toBe('de');
    expect(document.querySelector('.contact-eye')?.innerHTML).toContain('Kontakt');
  });

  it('translates full index.html body elements without errors', async () => {
    const htmlPath = path.resolve(__dirname, '../../index.html');
    const rawHtml = fs.readFileSync(htmlPath, 'utf-8');
    const sanitized = rawHtml.replace(/<script[\s\S]*?<\/script>/gi, '');
    const bodyMatch = sanitized.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    document.body.innerHTML = bodyMatch ? bodyMatch[1] : sanitized;

    const { initI18n } = await import('../../src/i18n');
    initI18n();

    const btn = document.getElementById('langBtn') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    btn.click();
    expect(document.documentElement.lang).toBe('de');

    btn.click();
    expect(document.documentElement.lang).toBe('en');
  });
});
