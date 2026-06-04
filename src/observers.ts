/** Section reveal observer + metric counters. */
import { $$ } from './utils';

export function initReveal(): void {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .reveal-stagger, .lang, .metric').forEach(el => io.observe(el));
}

export function initMetricCounters(): void {
  const cIo = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.querySelectorAll<HTMLElement>('.n[data-target]').forEach(n => {
          countTo(n, parseInt(n.dataset.target || '0', 10));
        });
        cIo.unobserve(e.target);
      }
    }
  }, { threshold: 0.4 });
  $$('.metrics').forEach(m => cIo.observe(m));
}

function countTo(el: HTMLElement, target: number, dur = 1800): void {
  let s: number | null = null;
  const step = (ts: number) => {
    if (s === null) s = ts;
    const p = Math.min((ts - s) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.floor(e * target));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
