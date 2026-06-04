import { describe, it, expect, beforeEach } from 'vitest';

describe('i18n basic switching', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="langBtn"><span class="lbl">DE</span></button>
      <span class="hero-tagline">AI engineer for early-stage teams.<br>
      <em>Production systems</em>, shipped solo.</span>
      <span class="contact-eye">§ VI — Now hiring myself out</span>
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
    expect(document.querySelector('.contact-eye')?.innerHTML).toContain('Verfügbar');
  });
});
