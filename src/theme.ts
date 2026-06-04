/** Dark/light theme toggle. Persists choice in localStorage. */
import { $ } from './utils';

const KEY = 'theme';
type Theme = 'dark' | 'light';

export function initTheme(): void {
  const saved = (localStorage.getItem(KEY) as Theme | null) ?? 'dark';
  apply(saved);
  const btn = $<HTMLButtonElement>('#themeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const next: Theme = (document.documentElement.dataset.theme === 'light') ? 'dark' : 'light';
      apply(next);
      localStorage.setItem(KEY, next);
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !isTyping(e)) {
      const next: Theme = (document.documentElement.dataset.theme === 'light') ? 'dark' : 'light';
      apply(next);
      localStorage.setItem(KEY, next);
    }
  });
}

function apply(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  const btn = $('#themeBtn');
  if (btn) {
    const label = btn.querySelector('.lbl');
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
}

function isTyping(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement;
  return ['INPUT', 'TEXTAREA'].includes(t.tagName) || t.isContentEditable;
}
