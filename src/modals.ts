/** Case-study modals for projects. View-Transitions-API enhanced if supported. */
import { $, $$ } from './utils';

interface CaseStudy {
  num: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  architecture: string;
  highlights: string[];
  stack: string[];
  link?: { href: string; label: string };
}

const STUDIES: Record<string, CaseStudy> = {
  '01': {
    num: '01',
    title: 'AI Dictaphone v7.0',
    tagline: 'Edge voice pipeline · Whisper → LLM · sub-second latency.',
    problem: 'Voice notes inside Telegram are hard to triage at scale — re-listening is slow, transcripts and summaries live in different tools, and any voice-to-text product the user touches has to feel native to Telegram.',
    solution: 'A serverless pipeline runs entirely on Cloudflare edge: voice note → Groq Whisper transcription → LLaMA 3.3 70B summary → rich Mini-App UI. Zero cold-start, no secrets reach the client, every webhook is HMAC-verified.',
    architecture: 'Telegram Mini-App → Cloudflare Workers → Groq Whisper → LLaMA 3.3 70B → Mini-App response.',
    highlights: [
      '0 ms cold-start (Workers global)',
      'HMAC-SHA256 webhook auth on every request',
      'Streaming summaries — partial results visible while LLM still thinks',
      'No persistent storage of voice content (privacy by design)',
    ],
    stack: ['Cloudflare Workers', 'Groq Whisper-large-v3', 'LLaMA 3.3 70B', 'JS ESM', 'Telegram Mini-Apps'],
  },
  '02': {
    num: '02',
    title: 'AI Moderation Bot',
    tagline: 'n8n workflow · dual-AI failover · auto-escalation.',
    problem: 'Telegram chat moderation with regex/keyword bots produces both false positives (banned for innocent words) and false negatives (cleverly worded scams pass through). Big communities need contextual AI, but a single LLM provider is a single point of failure.',
    solution: '15+ node n8n pipeline classifies every message with structured JSON outputs, routes to action, escalates sanctions across three tiers. Dual-provider failover (Nemotron primary, GPT-4.1 fallback) keeps moderation alive when any single LLM API is down.',
    architecture: 'Telegram message → Filter → Nemotron classifier → fallback GPT-4.1 → Router → action (warn/mute/ban) → Telegram.',
    highlights: [
      '15+ n8n nodes, fully visualised pipeline',
      'Structured JSON outputs only — zero parsing of free-form text',
      '3-tier sanction system: warn → mute → ban',
      'Dual-AI failover: switches in <2s when primary fails',
    ],
    stack: ['n8n', 'OpenRouter', 'GPT-4.1-mini', 'Nemotron', 'Telegram Bot API'],
  },
  '03': {
    num: '03',
    title: 'AI Psychology Bot — Mystic Mini-App',
    tagline: 'Full SaaS · payments · conversational agent.',
    problem: 'A monetized AI product needs all the moving pieces: auth, payments, retention loops, AI failover, real-user error handling. Most solo builders get stuck wiring auth + payments + AI together cleanly.',
    solution: 'End-to-end SaaS solo: HMAC-SHA256 auth → distributed Apps Script backend → Firebase Realtime DB → Gemini 2.5 + TTS pipeline. Telegram Stars for in-app payments, atomic credit operations, referral program, multiple personas (Numerology, Dream Interpreter, Runes).',
    architecture: 'Telegram Mini-App → HMAC-SHA256 → Google Apps Script → Firebase RTDB → Gemini 2.5 + TTS.',
    highlights: [
      'Telegram Stars payments — first-class native checkout',
      'Atomic credit operations (no double-spend under concurrency)',
      'Multi-persona system with topic-restricted system prompts',
      'Real revenue, no team, no funding',
    ],
    stack: ['Gemini 2.5', 'Telegram Stars', 'Firebase RTDB', 'Apps Script', 'HMAC-SHA256'],
  },
  '04': {
    num: '04',
    title: 'Bushmark — Secure Clipboard',
    tagline: 'Self-hosted · cookie auth · one-click install.',
    problem: 'Transferring text between servers and devices means USB sticks, third-party pastebins, or copy/paste hops through chat apps. None are private, none are simple.',
    solution: 'Self-hosted clipboard at bushmark.cc: three persistent slots, 24h history, auto-rotation, Tailwind UI. Install with one bash line on any Ubuntu VPS — script handles Nginx + FastAPI + systemd setup automatically.',
    architecture: 'Browser client → Nginx reverse proxy → FastAPI (systemd-managed) → disk + 30-day log rotation.',
    highlights: [
      'One-line bash install (`curl … | bash`)',
      'Cookie-based auth (no third-party identity)',
      '3 persistent slots + 24h rolling history',
      'Auto log rotation, systemd auto-restart',
    ],
    stack: ['FastAPI', 'Nginx', 'systemd', 'Tailwind', 'Ubuntu 24.04'],
    link: { href: 'https://bushmark.cc', label: 'Visit bushmark.cc →' },
  },
  '05': {
    num: '05',
    title: 'CyberDed Ultra + ComfyUI',
    tagline: 'Local AI infra · one-click installer · Android + Linux.',
    problem: 'Local AI means dependency hell — CUDA versions, Python venvs, Docker compose files, ComfyUI custom nodes, NVIDIA Container Toolkit setup. Most "easy" installers skip half of it and break two weeks later.',
    solution: 'Bash installer that lays the entire stack: Ollama for LLM inference, ComfyUI for image generation, NVIDIA Container Toolkit auto-config, Flask backend with Server-Sent Events streaming chat, real-time system monitoring. Works on both Linux and Android (Termux).',
    architecture: 'Bash installer → Ollama + ComfyUI Docker → Flask SSE backend → NVIDIA Container Toolkit.',
    highlights: [
      'SSE streaming chat (real-time tokens, no polling)',
      'GPU auto-detection (NVIDIA / AMD / CPU fallback)',
      'Real-time system monitoring (CPU / GPU / RAM)',
      'Two OS targets: Ubuntu Linux + Termux Android',
    ],
    stack: ['Docker', 'Ollama', 'Flask', 'ComfyUI', 'NVIDIA Container Toolkit'],
  },
  '06': {
    num: '06',
    title: 'Termux AI Dictaphone',
    tagline: 'Android as offline AI server · zero cloud cost.',
    problem: 'Cloud LLM calls cost money, leak data, and stop working without signal. Most "local AI" projects need a beefy GPU desktop. What if your phone could be the entire stack?',
    solution: 'Complete offline AI on any modern Android: Whisper transcription via faster-whisper / whisper.cpp, LLaMA / Gemma inference via Ollama, all running on-device through Termux. Zero cloud cost, full privacy. Published OSS.',
    architecture: 'Termux (Android) → faster-whisper / whisper.cpp → Ollama (LLaMA 3.2 / Gemma 2).',
    highlights: [
      '100% offline (airplane-mode capable)',
      '$0 API cost (no provider keys)',
      'Dual-mode: live mic OR uploaded audio',
      'On-device privacy — voice never leaves the phone',
    ],
    stack: ['Termux', 'faster-whisper', 'whisper.cpp', 'Ollama', 'Python'],
    link: { href: 'https://github.com/aleksbuss/Termux-SelfHosted-STT---TTS', label: 'View on GitHub →' },
  },
};

let modal: HTMLDialogElement | null = null;

export function initModals(): void {
  modal = $<HTMLDialogElement>('#caseModal');
  if (!modal) return;

  $$('.proj-cta').forEach(cta => {
    const proj = cta.closest('.proj') as HTMLElement | null;
    if (!proj) return;
    const num = proj.querySelector('.proj-meta .num')?.textContent?.trim();
    if (!num || !STUDIES[num]) return;
    cta.addEventListener('click', e => {
      // External links (bushmark, github) — let them through normally
      const href = (cta as HTMLAnchorElement).getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript')) return;
      e.preventDefault();
      open(STUDIES[num]);
    });
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) close();
  });
  modal.querySelector<HTMLButtonElement>('#caseModalClose')?.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.open) close();
  });
}

function open(study: CaseStudy): void {
  if (!modal) return;
  fillModal(study);
  const run = () => modal!.showModal();
  // View Transitions API for a smooth open
  if (document.startViewTransition) {
    document.startViewTransition(run);
  } else {
    run();
  }
}

function close(): void {
  if (!modal) return;
  const run = () => modal!.close();
  if (document.startViewTransition) {
    document.startViewTransition(run);
  } else {
    run();
  }
}

function fillModal(s: CaseStudy): void {
  if (!modal) return;
  const html = `
    <button id="caseModalClose" class="case-close" aria-label="Close case study">×</button>
    <header class="case-head">
      <span class="case-num">${s.num}</span>
      <h2 class="case-title">${s.title}</h2>
      <p class="case-tagline">${s.tagline}</p>
    </header>
    <section class="case-section">
      <span class="case-eyebrow">Problem</span>
      <p>${s.problem}</p>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">Solution</span>
      <p>${s.solution}</p>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">Architecture</span>
      <pre class="case-arch">${s.architecture}</pre>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">Highlights</span>
      <ul class="case-highlights">
        ${s.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">Stack</span>
      <div class="case-stack">
        ${s.stack.map(t => `<span class="tag p">${t}</span>`).join('')}
      </div>
    </section>
    ${s.link ? `<a class="case-cta" href="${s.link.href}" target="_blank" rel="noopener">${s.link.label}</a>` : ''}
  `;
  modal.innerHTML = html;
  // re-bind close (innerHTML wipes the previous handler)
  modal.querySelector<HTMLButtonElement>('#caseModalClose')?.addEventListener('click', close);
}
