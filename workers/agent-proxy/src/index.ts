/**
 * Cloudflare Worker proxy for the aleksbuss.dev portfolio AI agent.
 *
 * Endpoints:
 *   POST /chat  — body { messages: [{role, content}, ...] }, returns SSE stream
 *   GET  /health — { ok: true }
 *
 * Security:
 *   - OpenRouter API key held in `OPENROUTER_API_KEY` secret (never sent to browser).
 *   - CORS allow-list via ALLOWED_ORIGINS env var.
 *   - Per-IP rate limit via KV (RATE_LIMIT_PER_HOUR messages/hour).
 *   - System prompt enforced server-side; client cannot override.
 */
import { SYSTEM_PROMPT } from './system-prompt';

interface Env {
  OPENROUTER_API_KEY: string;
  RATELIMIT: KVNamespace;
  ALLOWED_ORIGINS: string;
  MODEL: string;
  RATE_LIMIT_PER_HOUR: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

const MAX_MESSAGES = 20;
const MAX_CONTENT_LEN = 2000;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === '/health') {
      return jsonResponse({ ok: true, model: env.MODEL }, cors);
    }

    if (url.pathname !== '/chat' || req.method !== 'POST') {
      return jsonResponse({ error: 'not_found' }, cors, 404);
    }

    if (!cors['Access-Control-Allow-Origin']) {
      return jsonResponse({ error: 'origin_not_allowed' }, cors, 403);
    }

    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    const rateOk = await checkRateLimit(env, ip);
    if (!rateOk) {
      return jsonResponse({ error: 'rate_limited' }, cors, 429);
    }

    let body: ChatRequest;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: 'invalid_json' }, cors, 400);
    }

    const valid = validateMessages(body?.messages);
    if (!valid.ok) {
      return jsonResponse({ error: valid.error }, cors, 400);
    }

    return streamFromOpenRouter(env, valid.messages, cors);
  },
};

function corsHeaders(origin: string, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else if (allowed.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*';
  }
  return headers;
}

function jsonResponse(body: unknown, headers: Record<string, string>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  const limit = parseInt(env.RATE_LIMIT_PER_HOUR || '30', 10);
  const hour = Math.floor(Date.now() / 3_600_000);
  const key = `rl:${ip}:${hour}`;
  const cur = parseInt((await env.RATELIMIT.get(key)) || '0', 10);
  if (cur >= limit) return false;
  await env.RATELIMIT.put(key, String(cur + 1), { expirationTtl: 4000 });
  return true;
}

type ValidationResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

function validateMessages(raw: unknown): ValidationResult {
  if (!Array.isArray(raw)) return { ok: false, error: 'messages_not_array' };
  if (raw.length === 0) return { ok: false, error: 'messages_empty' };
  if (raw.length > MAX_MESSAGES) return { ok: false, error: 'too_many_messages' };
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') return { ok: false, error: 'message_not_object' };
    const { role, content } = m as Record<string, unknown>;
    if (role !== 'user' && role !== 'assistant') return { ok: false, error: 'bad_role' };
    if (typeof content !== 'string') return { ok: false, error: 'bad_content' };
    const trimmed = content.trim();
    if (!trimmed) return { ok: false, error: 'empty_content' };
    if (trimmed.length > MAX_CONTENT_LEN) return { ok: false, error: 'content_too_long' };
    out.push({ role, content: trimmed });
  }
  if (out[out.length - 1].role !== 'user') return { ok: false, error: 'last_must_be_user' };
  return { ok: true, messages: out };
}

async function streamFromOpenRouter(
  env: Env,
  messages: ChatMessage[],
  cors: Record<string, string>
): Promise<Response> {
  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aleksbuss.dev',
      'X-Title': 'aleksbuss.dev portfolio agent',
    },
    body: JSON.stringify({
      model: env.MODEL,
      stream: true,
      max_tokens: 600,
      temperature: 0.5,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '');
    console.error(JSON.stringify({ event: 'upstream_error', status: upstream.status, body: errText.slice(0, 500) }));
    return jsonResponse(
      { error: 'upstream_failed', status: upstream.status },
      cors,
      502
    );
  }

  // Forward the SSE stream verbatim — the client parses OpenAI-style chunks.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      ...cors,
    },
  });
}
