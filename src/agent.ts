/**
 * Ask-the-agent command dock.
 * - Streams responses from the Cloudflare Worker proxy (OpenRouter SSE).
 * - Falls back to canned responses if the endpoint is unreachable / not yet deployed.
 * - Persists chat history in localStorage (last 30 messages).
 * - Closeable via × button, Esc, click-outside, ⌘K toggle.
 */
import { $, $$, escapeHtml } from './utils';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const HISTORY_KEY = 'agent_history_v1';
const ENDPOINT_KEY = 'agent_endpoint';
const MAX_HISTORY = 30;
const DEFAULT_ENDPOINT = 'https://aleksejs-agent-proxy.aleksbuss.workers.dev/chat';

const FALLBACK: Array<{ keys: string[]; text: string }> = [
  { keys: ['project', 'work', 'shipped', 'show me'],
    text: 'Eight systems built & deployed solo. Flagship: Orchestra — open-source Mixture-of-Agents platform (TypeScript/Next.js, 2,600+ tests, 70+ post-mortems). Plus: AI Dictaphone (Whisper → LLM on Cloudflare edge), AI moderation bot (n8n, dual-AI failover), AI Psychology Bot (Telegram Stars SaaS), bushmark.cc (FastAPI/Nginx), CyberDed Ultra (Ollama + ComfyUI), Termux Dictaphone (offline AI on Android). Scroll to §IV.' },
  { keys: ['stack', 'tech', 'tool', 'use'],
    text: 'AI: OpenAI · Gemini · Groq · Ollama. Edge: Cloudflare Workers · Apps Script. Backend: Python (FastAPI/Flask) · JS (ESM). Ops: Docker · systemd · Nginx · Ubuntu VPS. Auth: HMAC-SHA256 · Telegram Bot API. §V has the full toolkit.' },
  { keys: ['hire', 'why', 'recruit'],
    text: 'Founder-grade ownership: spec → architecture → code → deploy → monitor — solo. Eight systems shipped solo since mid-2025, zero hand-holding. Late-career switch (35+) means disciplined under pressure. Full-stack means one headcount stretches a seed runway further.' },
  { keys: ['process', 'role', 'looking', 'available', 'interview'],
    text: 'Looking for AI Engineer / Founding Engineer roles at Seed–Series C. Available immediately, Germany-based, EU citizen, remote or on-site. Drop a note: aleksbuss@gmail.com.' },
  { keys: ['who', 'about'],
    text: 'Aleksejs Buss · AI engineer in Hof, Germany. 14 years in logistics → Frontend at Tel-Ran Berlin (DEKRA, 960h) → solo production AI since mid-2025.' },
  { keys: ['contact', 'email', 'reach'],
    text: 'Email: aleksbuss@gmail.com. Phone: +49 176 73503486. GitHub: /aleksbuss. Or use the HIRE → button in the top status bar.' },
];
const FALLBACK_DEFAULT = 'Outside my response cache for this build (the live agent endpoint is unreachable). Direct line: aleksbuss@gmail.com.';

let dock: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let input: HTMLInputElement | null = null;
let msgsEl: HTMLElement | null = null;
let suggestions: HTMLElement | null = null;
let closeBtn: HTMLButtonElement | null = null;
let sendBtn: HTMLButtonElement | null = null;
let abortCtrl: AbortController | null = null;
let history: Msg[] = [];

export function initAgent(): void {
  dock = $('#cmdDock');
  panel = $('#cmdPanel');
  input = $<HTMLInputElement>('#cmdInput');
  msgsEl = $('#cmdMsgs');
  suggestions = $('#cmdSuggestions');
  closeBtn = $<HTMLButtonElement>('#cmdClose');
  sendBtn = $<HTMLButtonElement>('#cmdSend');
  if (!dock || !panel || !input || !msgsEl) return;

  history = loadHistory();
  renderHistory();

  dock.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if (target.closest('#cmdSend')) return;
    if (target.closest('#cmdClose')) return;
    if (!dock!.classList.contains('open')) open();
  });

  if (closeBtn) closeBtn.addEventListener('click', e => { e.stopPropagation(); close(); });
  if (sendBtn) sendBtn.addEventListener('click', e => { e.stopPropagation(); send(); });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      isOpen() ? close() : open();
      return;
    }
    if (e.key === 'Escape' && isOpen()) close();
  });

  // click-outside to close
  document.addEventListener('click', e => {
    if (!isOpen()) return;
    const t = e.target as HTMLElement;
    if (dock!.contains(t) || panel!.contains(t)) return;
    close();
  });

  if (suggestions) {
    $$('.cmd-sug', suggestions).forEach(b => {
      b.addEventListener('click', () => {
        if (!isOpen()) open();
        if (input) input.value = b.textContent ?? '';
        send();
      });
    });
  }
}

function isOpen(): boolean { return !!dock?.classList.contains('open'); }

function open(): void {
  dock!.classList.add('open');
  panel!.classList.add('open');
  setTimeout(() => input?.focus(), 50);
}
function close(): void {
  dock!.classList.remove('open');
  panel!.classList.remove('open');
  input?.blur();
  if (abortCtrl) { abortCtrl.abort(); abortCtrl = null; }
}

async function send(): Promise<void> {
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  history.push({ role: 'user', content: text });
  appendUserMsg(text);
  saveHistory();

  const assistantEl = appendAgentPlaceholder();

  try {
    const reply = await streamAgent(history, chunk => {
      assistantEl.classList.remove('cmd-thinking');
      assistantEl.textContent = chunk;
      scrollPanel();
    });
    if (!reply) throw new Error('empty');
    history.push({ role: 'assistant', content: reply });
    saveHistory();
  } catch (err) {
    // Network / endpoint failure → canned fallback so the user gets *something*.
    const fallback = pickFallback(text);
    assistantEl.classList.remove('cmd-thinking');
    streamLocalText(assistantEl, fallback);
    history.push({ role: 'assistant', content: fallback });
    saveHistory();
  }
}

/** Hits the worker, parses OpenAI-style SSE. Resolves with full text. Calls onChunk on every delta. */
async function streamAgent(messages: Msg[], onChunk: (acc: string) => void): Promise<string> {
  const endpoint = localStorage.getItem(ENDPOINT_KEY) || DEFAULT_ENDPOINT;
  abortCtrl = new AbortController();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: messages.slice(-12) }),
    signal: abortCtrl.signal,
  });
  if (!res.ok || !res.body) throw new Error(`status_${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let acc = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const events = buf.split('\n\n');
    buf = events.pop() ?? '';
    for (const ev of events) {
      const line = ev.split('\n').find(l => l.startsWith('data:'));
      if (!line) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return acc;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string') {
          acc += delta;
          onChunk(acc);
        }
      } catch {
        // ignore keep-alive comments / malformed lines
      }
    }
  }
  return acc;
}

function pickFallback(query: string): string {
  const q = query.toLowerCase();
  let best = null;
  let bestHits = 0;
  for (const r of FALLBACK) {
    const hits = r.keys.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0);
    if (hits > bestHits) { best = r; bestHits = hits; }
  }
  return best ? best.text : FALLBACK_DEFAULT;
}

/** UI helpers */
function appendUserMsg(text: string): void {
  if (!msgsEl) return;
  const u = document.createElement('div');
  u.className = 'cmd-msg user';
  u.innerHTML = `<div class="who"><span class="pulse"></span>YOU</div><div class="body">${escapeHtml(text)}</div>`;
  msgsEl.appendChild(u);
  scrollPanel();
}

function appendAgentPlaceholder(): HTMLElement {
  const t = document.createElement('div');
  t.className = 'cmd-msg agent';
  t.innerHTML = `<div class="who"><span class="pulse"></span>AGENT</div><div class="body cmd-thinking">thinking</div>`;
  msgsEl!.appendChild(t);
  scrollPanel();
  return t.querySelector('.body') as HTMLElement;
}

function streamLocalText(el: HTMLElement, text: string): void {
  let i = 0;
  const tick = () => {
    if (i > text.length) return;
    el.textContent = text.slice(0, i);
    scrollPanel();
    i += 2;
    setTimeout(tick, 8);
  };
  tick();
}

function scrollPanel(): void {
  if (panel) panel.scrollTop = panel.scrollHeight;
}

/** Persistence */
function loadHistory(): Msg[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMsg).slice(-MAX_HISTORY);
  } catch {
    return [];
  }
}

function saveHistory(): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
  } catch {
    /* quota / disabled — not fatal */
  }
}

function isValidMsg(x: unknown): x is Msg {
  return !!x && typeof x === 'object'
    && (((x as Msg).role === 'user') || ((x as Msg).role === 'assistant'))
    && typeof (x as Msg).content === 'string';
}

function renderHistory(): void {
  if (!msgsEl) return;
  msgsEl.innerHTML = '';
  for (const m of history) {
    if (m.role === 'user') appendUserMsg(m.content);
    else {
      const el = appendAgentPlaceholder();
      el.classList.remove('cmd-thinking');
      el.textContent = m.content;
    }
  }
}

/** Test seam */
export const __test = {
  pickFallback,
  isValidMsg,
  loadHistory,
  saveHistory: (msgs: Msg[]) => { history = msgs; saveHistory(); },
  resetHistory: () => { history = []; localStorage.removeItem(HISTORY_KEY); },
};
