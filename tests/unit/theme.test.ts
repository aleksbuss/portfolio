import { describe, it, expect, beforeEach } from 'vitest';
import { initTheme } from '../../src/theme';

describe('theme toggle', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.innerHTML = `<button id="themeBtn"><span class="lbl">Light</span></button>`;
    localStorage.clear();
  });

  it('defaults to dark theme', () => {
    initTheme();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persists theme choice across reloads', () => {
    localStorage.setItem('theme', 'light');
    initTheme();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('toggles when button clicked', () => {
    initTheme();
    const btn = document.getElementById('themeBtn') as HTMLButtonElement;
    btn.click();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    btn.click();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('updates button label to show the OPPOSITE theme as click target', () => {
    initTheme();
    const lbl = document.querySelector('#themeBtn .lbl') as HTMLElement;
    expect(lbl.textContent).toBe('Light'); // currently dark → click would go to light
    (document.getElementById('themeBtn') as HTMLButtonElement).click();
    expect(lbl.textContent).toBe('Dark');
  });
});
