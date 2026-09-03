import { $, isReducedMotion } from './utils';

const BOOT_LINES: string[] = [
  '<span class="ts">[00:00.012]</span> <span class="key">init</span> agent runtime · node v22.16 <span class="ok">✓</span>',
  '<span class="ts">[00:00.043]</span> <span class="key">load</span> manifest portfolio.toml <span class="ok">✓</span>',
  '<span class="ts">[00:00.082]</span> <span class="key">mount</span> cdn.cloudflare.com <span class="arrow">→</span> edge ready <span class="ok">✓</span>',
  '<span class="ts">[00:00.156]</span> <span class="key">init</span> whisper STT pipeline <span class="ok">✓</span>',
  '<span class="ts">[00:00.211]</span> <span class="key">init</span> gemini-2.5-pro · groq-llama-3.3-70b <span class="ok">✓</span>',
  '<span class="ts">[00:00.298]</span> <span class="key">verify</span> HMAC-SHA256 webhook auth <span class="ok">✓</span>',
  '<span class="ts">[00:00.342]</span> <span class="key">scan</span> discover production services...',
  '<span class="ts">[00:00.398]</span>   <span class="arrow">↳</span> orchestra-moa      <span class="arrow">→</span> <span class="ok">online (4,100+ tests)</span>',
  '<span class="ts">[00:00.451]</span>   <span class="arrow">↳</span> 4take-fastmcp      <span class="arrow">→</span> <span class="ok">online (FastMCP Council)</span>',
  '<span class="ts">[00:00.502]</span>   <span class="arrow">↳</span> ai-dictaphone-v7   <span class="arrow">→</span> <span class="ok">online (edge)</span>',
  '<span class="ts">[00:00.567]</span>   <span class="arrow">↳</span> ai-moderator-bot   <span class="arrow">→</span> <span class="ok">online (1,000+ tests)</span>',
  '<span class="ts">[00:00.621]</span>   <span class="arrow">↳</span> ai-psycho-bot      <span class="arrow">→</span> <span class="ok">online (Stars SaaS)</span>',
  '<span class="ts">[00:00.812]</span> <span class="key">auth</span> handshake aleksejs.buss <span class="ok">✓</span>',
];

export function getBootLines(): readonly string[] {
  return BOOT_LINES;
}

export function startBoot(onDone: () => void): void {
  const boot = $('#boot');
  const mid = $('#bootMid');
  const nameEl = $('#bootName');
  const pctEl = $('#bootPct');
  const barEl = $('#bootBar');
  if (!boot || !mid || !nameEl || !pctEl || !barEl) {
    onDone();
    return;
  }

  document.body.style.overflow = 'hidden';

  // Reduced-motion or test skip_boot flag: skip the whole sequence.
  let shouldSkip = isReducedMotion();
  try {
    if (sessionStorage.getItem('skip_boot') === '1') {
      shouldSkip = true;
    }
  } catch {}

  if (shouldSkip) {
    boot.remove();
    document.body.style.overflow = '';
    onDone();
    return;
  }

  let idx = 0;
  const stepDelay = () => 35 + Math.random() * 30;

  const append = (html: string) => {
    const line = document.createElement('div');
    line.className = 'boot-line';
    line.innerHTML = html;
    mid.appendChild(line);
  };

  const step = () => {
    if (idx >= BOOT_LINES.length) {
      typeBootName(nameEl, 'Aleksejs Buss', async () => {
        pctEl.textContent = '100';
        barEl.style.setProperty('--p', '100%');

        // Font gate: ensure webfonts (Geist) are loaded before lifting boot curtain
        if ('fonts' in document) {
          try {
            await Promise.race([
              document.fonts.ready,
              new Promise(res => setTimeout(res, 1200))
            ]);
          } catch {}
        }

        setTimeout(() => {
          boot.classList.add('gone');
          document.body.style.overflow = '';
          setTimeout(() => boot.remove(), 850);
          onDone();
        }, 300);
      });
      return;
    }
    append(BOOT_LINES[idx]);
    const p = Math.floor(((idx + 1) / BOOT_LINES.length) * 100);
    pctEl.textContent = String(p);
    barEl.style.setProperty('--p', p + '%');
    idx++;
    setTimeout(step, stepDelay());
  };
  setTimeout(step, 150);
}

function typeBootName(el: HTMLElement, target: string, done: () => void): void {
  let i = 0;
  const tick = () => {
    if (i > target.length) {
      done();
      return;
    }
    el.textContent = target.slice(0, i);
    i++;
    setTimeout(tick, 75);
  };
  tick();
}
