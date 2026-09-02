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

const STUDIES_EN: Record<string, CaseStudy> = {
  '01': {
    num: '01',
    title: 'Orchestra — Multi-Agent AI Workspace',
    tagline: 'Mixture-of-Agents pipeline · code-guaranteed Skeptic · live cost telemetry.',
    problem: 'Single-LLM assistants answer confidently even when wrong, and "self-hosted ChatGPT" wrappers inherit that: one model, one blind spot, no way to know what an answer cost. Prompt-level guardrails are unreliable — weak models silently drop instructions.',
    solution: 'A real Mixture-of-Agents pipeline: a Router generates 3–5 hyper-specialised expert personas per prompt and fans them out in parallel, with an adversarial Skeptic injected by code — not by prompt. Embedding-based disagreement detection makes the aggregator surface expert conflict instead of smoothing it away; an optional reflection critic + revisor pass improves the final answer. Every chat shows live token + USD cost. BYOK or fully local via Ollama.',
    architecture: 'Router (DPG) → 3–5 parallel proposers + code-guaranteed Skeptic → disagreement detector (embedding distance) → aggregator → reflection critic/revisor → answer + cost banner.',
    highlights: [
      'Skeptic guaranteed by code, not by prompt (PM #37)',
      'Disagreement detection: expert conflict is surfaced, never smoothed away',
      '4,100+ tests (Vitest + Playwright) · 70+ documented post-mortems · CI',
      'Live per-chat cost telemetry (tokens + USD) · BYOK or fully local',
    ],
    stack: ['TypeScript (strict)', 'Next.js 15', 'Vitest', 'Playwright', 'Docker', 'Ollama'],
    link: { href: 'https://github.com/aleksbuss/orchestra', label: 'View on GitHub →' },
  },
  '02': {
    num: '02',
    title: '4take — Multi-Model AI Code Review Council',
    tagline: 'FastMCP & CLI council · 4-model consensus protocol · adversarial synthesis.',
    problem: 'Single LLM code reviews suffer from high hallucination rates, bias toward specific patterns, and missed security vulnerabilities or logic regressions. Relying on one model creates a single point of failure in CI/CD quality gates.',
    solution: '4take queries 4 independent LLM providers in parallel (OpenAI, Anthropic, Gemini, Groq, Ollama) via an adversarial synthesizer protocol. It scores confidence, discovers points of consensus, and surfaces critical regressions with actionable diffs before code merges. Exposes both a high-speed CLI and a zero-dependency FastMCP server.',
    architecture: 'CLI / FastMCP → Discovery & Rate Limiter → Parallel Provider Pool (4 LLMs) → Tokenizer & Sanitizer → Synthesizer Engine → Multi-Axis Review Matrix.',
    highlights: [
      'Parallel multi-model council with zero-dependency FastMCP server',
      'Adversarial consensus synthesizer that isolates true bugs from stylistic noise',
      'Pytest automated test suite covering unit, integration, token-bucket & FastMCP suites',
      'Full local LLM fallback support (Ollama / vLLM / OpenRouter)',
    ],
    stack: ['Python 3.12+', 'FastMCP', 'Pydantic v2', 'HTTPX', 'Pytest', 'Click'],
    link: { href: 'https://github.com/aleksbuss/4take', label: 'View on GitHub →' },
  },
  '03': {
    num: '03',
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
    link: { href: 'https://github.com/aleksbuss/trascribatorV2', label: 'View on GitHub →' },
  },
  '04': {
    num: '04',
    title: 'AI Moderation Bot',
    tagline: 'n8n workflow · dual-AI failover · auto-escalation.',
    problem: 'Telegram chat moderation with regex/keyword bots produces both false positives (banned for innocent words) and false negatives (cleverly worded scams pass through). Big communities need contextual AI, but a single LLM provider is a single point of failure.',
    solution: '15+ node n8n pipeline classifies every message with structured JSON outputs, routes to action, escalates sanctions across three tiers. Dual-provider failover (Nemotron primary, GPT-4.1 fallback) keeps moderation alive when any single LLM API is down.',
    architecture: 'Telegram message → Filter → Nemotron classifier → fallback GPT-4.1 → Router → action (warn/mute/ban) → Telegram.',
    highlights: [
      '1,000+ tests across bot, API, and mini-app packages',
      '15+ n8n nodes, fully visualised pipeline',
      'Structured JSON outputs only — zero parsing of free-form text',
      'Dual-AI failover: switches in <2s when primary fails',
    ],
    stack: ['n8n', 'OpenRouter', 'GPT-4.1-mini', 'Nemotron', 'Telegram Bot API'],
  },
  '05': {
    num: '05',
    title: 'AI Psychology Bot — Mystic Mini-App',
    tagline: 'Full SaaS · payments · conversational agent.',
    problem: 'A monetized AI product needs all the moving pieces: auth, payments, retention loops, AI failover, real-user error handling. Most solo builders get stuck wiring auth + payments + AI together cleanly.',
    solution: 'End-to-end SaaS solo: HMAC-SHA256 auth → distributed Apps Script backend → Firebase Realtime DB → Gemini 2.5 + TTS pipeline. Telegram Stars for in-app payments, atomic credit operations, referral program, multiple personas (Numerology, Dream Interpreter, Runes).',
    architecture: 'Telegram Mini-App → HMAC-SHA256 → Google Apps Script → Firebase RTDB → Gemini 2.5 + TTS.',
    highlights: [
      'Telegram Stars payments — first-class native checkout',
      'Atomic credit operations (no double-spend under concurrency)',
      'Multi-persona system with topic-restricted system prompts',
      'Built solo end-to-end — no team, no funding',
    ],
    stack: ['Gemini 2.5', 'Telegram Stars', 'Firebase RTDB', 'Apps Script', 'HMAC-SHA256'],
    link: { href: 'https://github.com/aleksbuss/ai-psycho-bot', label: 'View on GitHub →' },
  },
};

const STUDIES_DE: Record<string, CaseStudy> = {
  '01': {
    num: '01',
    title: 'Orchestra — Multi-Agenten-KI-Workspace',
    tagline: 'Mixture-of-Agents-Pipeline · code-garantierter Skeptiker · Live-Kosten-Telemetrie.',
    problem: 'Single-LLM-Assistenten antworten selbst bei Fehlern selbstsicher, und Wrapper erben diesen blinden Fleck. Prompt-basierte Leitplanken sind unzuverlässig — schwache Modelle verwerfen Instruktionen stillschweigend.',
    solution: 'Echte Mixture-of-Agents-Pipeline: Ein Router erzeugt 3–5 spezialisierte Experten-Personas parallel, mit einem per Code injizierten Skeptiker — nicht per Prompt. Embedding-basierte Konflikterkennung deckt Meinungsverschiedenheiten auf; ein Reflexions-Kritiker überarbeitet die finale Antwort. Volle Kosten-Telemetrie pro Chat. BYOK oder komplett lokal via Ollama.',
    architecture: 'Router (DPG) → 3–5 parallele Experten + code-garantierter Skeptiker → Disagreement-Detektor (Embedding-Distanz) → Aggregator → Reflexions-Kritiker/Revisor → Antwort + Kosten-Banner.',
    highlights: [
      'Skeptiker per Code garantiert, nicht per Prompt (PM #37)',
      'Konflikterkennung: Experten-Widersprüche werden offengelegt, nie geglättet',
      '4.100+ Tests (Vitest + Playwright) · 70+ dokumentierte Post-Mortems · CI',
      'Live-Kosten-Telemetrie (Tokens + USD) · BYOK oder komplett lokal via Ollama',
    ],
    stack: ['TypeScript (strict)', 'Next.js 15', 'Vitest', 'Playwright', 'Docker', 'Ollama'],
    link: { href: 'https://github.com/aleksbuss/orchestra', label: 'Auf GitHub ansehen →' },
  },
  '02': {
    num: '02',
    title: '4take — Multi-Modell-KI-Code-Review-Rat',
    tagline: 'FastMCP- & CLI-Rat · 4-Modell-Konsens-Protokoll · adversarielle Synthese.',
    problem: 'Single-LLM-Reviews leiden unter hohen Halluzinationsraten und übersehen Sicherheitslücken. Ein einzelnes Modell ist ein Single Point of Failure in CI/CD-Quality-Gates.',
    solution: '4take befragt 4 unabhängige LLM-Provider parallel (OpenAI, Anthropic, Gemini, Groq, Ollama) über ein Konsens-Synthese-Protokoll. Es bewertet Konfidenz, erkennt Konsenspunkte und deckt kritische Regressionen mit Diffs vor dem Merge auf. Schnelle CLI + FastMCP Server ohne externe Abhängigkeiten.',
    architecture: 'CLI / FastMCP → Discovery & Rate Limiter → Paralleler Provider-Pool (4 LLMs) → Tokenizer & Sanitizer → Synthese-Engine → Multi-Axis Review Matrix.',
    highlights: [
      'Paralleler Multi-Modell-Rat mit FastMCP-Server ohne externe Abhängigkeiten',
      'Adversarieller Konsens-Synthesizer trennt echte Bugs von Stilrauschen',
      'Pytest-Testsuite über Unit-, Integrations- und FastMCP-Suiten',
      'Volle lokale LLM-Fallback-Unterstützung (Ollama / vLLM / OpenRouter)',
    ],
    stack: ['Python 3.12+', 'FastMCP', 'Pydantic v2', 'HTTPX', 'Pytest', 'Click'],
    link: { href: 'https://github.com/aleksbuss/4take', label: 'Auf GitHub ansehen →' },
  },
  '03': {
    num: '03',
    title: 'AI Dictaphone v7.0',
    tagline: 'Edge-Voice-Pipeline · Whisper → LLM · Sub-Sekunden-Latenz.',
    problem: 'Sprachnachrichten in Telegram sind schwer zu durchsuchen und zusammenzufassen. Jedes Produkt muss sich nativ in Telegram anfühlen.',
    solution: 'Serverlose Pipeline vollständig auf der Cloudflare Edge: Sprachnachricht → Groq Whisper Transkription → LLaMA 3.3 70B Zusammenfassung → Mini-App-UI. Null Cold-Start, keine Secrets im Client, HMAC-verifizierte Webhooks.',
    architecture: 'Telegram Mini-App → Cloudflare Workers → Groq Whisper → LLaMA 3.3 70B → Mini-App-Antwort.',
    highlights: [
      '0 ms Cold-Start (Cloudflare Workers global)',
      'HMAC-SHA256 Webhook-Authentifizierung bei jedem Request',
      'Streaming-Zusammenfassungen für sofortige Vorschau',
      'Keine persistente Speicherung von Sprachdaten (Privacy by Design)',
    ],
    stack: ['Cloudflare Workers', 'Groq Whisper-large-v3', 'LLaMA 3.3 70B', 'JS ESM', 'Telegram Mini-Apps'],
    link: { href: 'https://github.com/aleksbuss/trascribatorV2', label: 'Auf GitHub ansehen →' },
  },
  '04': {
    num: '04',
    title: 'AI Moderations-Bot',
    tagline: 'n8n-Workflow · Dual-KI-Failover · Auto-Eskalation.',
    problem: 'Keyword-basierte Moderation erzeugt viele Fehlalarme. Große Communities benötigen kontextuelle KI, aber einzelne APIs fallen gelegentlich aus.',
    solution: 'n8n-Pipeline mit 15+ Knoten klassifiziert Nachrichten mit strukturiertem JSON, leitet Aktionen ein und eskaliert Sanktionen in drei Stufen. Dual-Provider-Failover (Nemotron primär, GPT-4.1 Fallback).',
    architecture: 'Telegram-Nachricht → Filter → Nemotron-Klassifikator → Fallback GPT-4.1 → Router → Aktion (Warnen/Muten/Bannen) → Telegram.',
    highlights: [
      '1.000+ Tests über Bot, API und Mini-App-Pakete',
      '15+ n8n-Knoten, vollständig visualisierte Pipeline',
      'Ausschließlich strukturierte JSON-Ausgaben',
      'Dual-KI-Failover: Umschaltung in <2s bei Ausfall des primären Anbieters',
    ],
    stack: ['n8n', 'OpenRouter', 'GPT-4.1-mini', 'Nemotron', 'Telegram Bot API'],
  },
  '05': {
    num: '05',
    title: 'AI Psychology Bot — Mystic Mini-App',
    tagline: 'Komplettes SaaS · Zahlungen · Konversations-Agent.',
    problem: 'Ein monetarisiertes KI-Produkt erfordert Authentifizierung, Zahlungen, Retention-Loops und Fehlerbehandlung. Solo-Entwickler scheitern oft an der sauberen Verknüpfung.',
    solution: 'End-to-End-SaaS solo gebaut: HMAC-SHA256 Auth → verteiltes Backend → Firebase Realtime DB → Gemini 2.5 + TTS-Pipeline. Telegram Stars für In-App-Käufe, atomare Credit-Operationen, Referral-Programm.',
    architecture: 'Telegram Mini-App → HMAC-SHA256 → Google Apps Script → Firebase RTDB → Gemini 2.5 + TTS.',
    highlights: [
      'Telegram Stars Zahlungen — erstklassiger nativer Checkout',
      'Atomare Credit-Operationen (kein Double-Spending bei Parallelität)',
      'Multi-Persona-System mit themenbezogenen System-Prompts',
      'Solo End-to-End gebaut — ohne Team, ohne externes Funding',
    ],
    stack: ['Gemini 2.5', 'Telegram Stars', 'Firebase RTDB', 'Apps Script', 'HMAC-SHA256'],
    link: { href: 'https://github.com/aleksbuss/ai-psycho-bot', label: 'Auf GitHub ansehen →' },
  },
};

const LABELS = {
  en: {
    problem: 'Problem',
    solution: 'Solution',
    architecture: 'Architecture',
    highlights: 'Highlights',
    stack: 'Stack',
    close: 'Close case study',
  },
  de: {
    problem: 'Problemstellung',
    solution: 'Lösung',
    architecture: 'Architektur',
    highlights: 'Kernpunkte',
    stack: 'Technologie-Stack',
    close: 'Fallstudie schließen',
  },
};

let modal: HTMLDialogElement | null = null;
let currentStudyNum: string | null = null;

export function initModals(): void {
  modal = $<HTMLDialogElement>('#caseModal');
  if (!modal) return;

  $$('.proj-cta').forEach(cta => {
    const proj = cta.closest('.proj') as HTMLElement | null;
    if (!proj) return;
    const num = proj.querySelector('.proj-meta .num')?.textContent?.trim();
    if (!num || (!STUDIES_EN[num] && !STUDIES_DE[num])) return;
    cta.addEventListener('click', e => {
      const href = (cta as HTMLAnchorElement).getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript')) return;
      e.preventDefault();
      currentStudyNum = num;
      open(num);
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

function getStudy(num: string, lang: 'en' | 'de'): CaseStudy {
  const dict = lang === 'de' ? STUDIES_DE : STUDIES_EN;
  return dict[num] ?? STUDIES_EN[num];
}

function open(num: string): void {
  if (!modal) return;
  const lang = (document.documentElement.lang as 'en' | 'de') || 'en';
  fillModal(getStudy(num, lang), lang);
  const run = () => modal!.showModal();
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

export function refreshOpenModalLang(lang: 'en' | 'de'): void {
  if (modal?.open && currentStudyNum) {
    fillModal(getStudy(currentStudyNum, lang), lang);
  }
}

function fillModal(s: CaseStudy, lang: 'en' | 'de'): void {
  if (!modal) return;
  const labels = LABELS[lang] ?? LABELS.en;
  const html = `
    <button id="caseModalClose" class="case-close" aria-label="${labels.close}">×</button>
    <header class="case-head">
      <span class="case-num">${s.num}</span>
      <h2 class="case-title">${s.title}</h2>
      <p class="case-tagline">${s.tagline}</p>
    </header>
    <section class="case-section">
      <span class="case-eyebrow">${labels.problem}</span>
      <p>${s.problem}</p>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">${labels.solution}</span>
      <p>${s.solution}</p>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">${labels.architecture}</span>
      <pre class="case-arch">${s.architecture}</pre>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">${labels.highlights}</span>
      <ul class="case-highlights">
        ${s.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </section>
    <section class="case-section">
      <span class="case-eyebrow">${labels.stack}</span>
      <div class="case-stack">
        ${s.stack.map(t => `<span class="tag p">${t}</span>`).join('')}
      </div>
    </section>
    ${s.link ? `<a class="case-cta" href="${s.link.href}" target="_blank" rel="noopener">${s.link.label}</a>` : ''}
  `;
  modal.innerHTML = html;
  modal.querySelector<HTMLButtonElement>('#caseModalClose')?.addEventListener('click', close);
}
