import { $ } from './utils';

export const HEADLINE_STRINGS = {
  en: {
    first: 'Autonomous AI systems,',
    last: 'engineered for production.',
  },
  de: {
    first: 'Autonome KI-Systeme,',
    last: 'für die Produktion entwickelt.',
  },
};

export function updateHeroHeadlineLang(lang: 'en' | 'de'): void {
  const heroNameEl = $('#heroName');
  if (!heroNameEl) return;
  const first = heroNameEl.querySelector<HTMLElement>('.first .typed-name');
  const last = heroNameEl.querySelector<HTMLElement>('.last .typed-name');
  if (!first || !last) return;

  const target = HEADLINE_STRINGS[lang] ?? HEADLINE_STRINGS.en;
  first.dataset.type = target.first;
  last.dataset.type = target.last;

  first.textContent = target.first;
  last.textContent = target.last;
}

export function startHeroSequence(): void {
  const heroNameEl = $('#heroName');
  if (!heroNameEl) return;

  const first = heroNameEl.querySelector<HTMLElement>('.first .typed-name');
  const last = heroNameEl.querySelector<HTMLElement>('.last .typed-name');
  if (first && first.dataset.type && !first.textContent) {
    first.textContent = first.dataset.type;
  }
  if (last && last.dataset.type && !last.textContent) {
    last.textContent = last.dataset.type;
  }

  heroNameEl.classList.add('done');
}

