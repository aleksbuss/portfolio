import { $, isReducedMotion } from './utils';

const TOKEN_LINES = [
  '> initializing description...',
  '> agentic ai engineer · multi-agent orchestration',
  '> eight systems · designed & operated solo · production-grade',
  '> engineering AI systems end-to-end since 07/2025',
  '> available immediately · EU citizen · Hof / Saale, DE',
];

export function startHeroSequence(): void {
  const heroNameEl = $('#heroName');
  if (!heroNameEl) return;

  if (isReducedMotion()) {
    // No typing animation — just fill in immediately.
    heroNameEl.querySelectorAll<HTMLElement>('.typed-name').forEach(el => {
      el.textContent = el.dataset.type ?? '';
    });
    heroNameEl.classList.add('done');
    fillTokensInstant();
    return;
  }

  const first = heroNameEl.querySelector<HTMLElement>('.first .typed-name');
  const last = heroNameEl.querySelector<HTMLElement>('.last .typed-name');
  if (!first || !last) return;

  const firstTarget = first.dataset.type ?? '';
  const lastTarget = last.dataset.type ?? '';

  let i = 0;
  const typeFirst = () => {
    if (i > firstTarget.length) {
      i = 0;
      setTimeout(typeLast, 200);
      return;
    }
    first.textContent = firstTarget.slice(0, i);
    i++;
    setTimeout(typeFirst, 90);
  };
  const typeLast = () => {
    if (i > lastTarget.length) {
      heroNameEl.classList.add('done');
      setTimeout(streamTokens, 500);
      return;
    }
    last.textContent = lastTarget.slice(0, i);
    i++;
    setTimeout(typeLast, 95);
  };
  typeFirst();
}

function fillTokensInstant(): void {
  const tokens = $('#heroTokens');
  if (!tokens) return;
  tokens.innerHTML = TOKEN_LINES.join('<br>');
}

function streamTokens(): void {
  const tokens = $('#heroTokens');
  if (!tokens) return;

  let lineIdx = 0;
  let charIdx = 0;
  let buffer = '';
  let last = performance.now();
  const charDelay = () => 16 + Math.random() * 24;
  let nextDelay = charDelay();

  const tick = (now: number) => {
    if (lineIdx >= TOKEN_LINES.length) {
      tokens.innerHTML = buffer.replace(/\n/g, '<br>') + '<span class="stream-caret"></span>';
      return;
    }
    if (now - last >= nextDelay) {
      const cur = TOKEN_LINES[lineIdx];
      if (charIdx > cur.length) {
        buffer += cur + '\n';
        lineIdx++;
        charIdx = 0;
        nextDelay = 220;
      } else {
        const visible = buffer + cur.slice(0, charIdx);
        tokens.innerHTML = visible.replace(/\n/g, '<br>') + '<span class="stream-caret"></span>';
        charIdx++;
        nextDelay = charDelay();
      }
      last = now;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
