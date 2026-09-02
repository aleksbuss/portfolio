import { describe, it, expect, beforeEach } from 'vitest';
import { __test } from '../../src/agent';

describe('agent.pickFallback', () => {
  it('matches "show me your projects" → projects entry', () => {
    const txt = __test.pickFallback('show me your projects please');
    expect(txt).toMatch(/Orchestra/); // flagship project — unique to the projects fallback
  });

  it('matches "what stack do you use" → stack entry', () => {
    const txt = __test.pickFallback('What stack do you use?');
    expect(txt).toMatch(/Cloudflare Workers/);
  });

  it('matches "why hire you" → hire entry', () => {
    const txt = __test.pickFallback('why hire you');
    expect(txt).toMatch(/Founder-grade ownership/);
  });

  it('matches contact intent', () => {
    const txt = __test.pickFallback('how do I reach you');
    expect(txt).toContain('aleksbuss@gmail.com');
  });

  it('matches Russian queries (e.g. проекты, стек)', () => {
    const proj = __test.pickFallback('покажи свои проекты');
    expect(proj).toMatch(/Orchestra/);
    const stack = __test.pickFallback('какой стек используешь?');
    expect(stack).toMatch(/Cloudflare Workers/);
  });

  it('matches German queries (e.g. projekte, werkzeuge)', () => {
    const proj = __test.pickFallback('zeige deine projekte');
    expect(proj).toMatch(/Orchestra/);
  });

  it('returns the safe default for unmatched queries', () => {
    const txt = __test.pickFallback('quantum cryptocurrency llm vibe coding');
    expect(txt).toContain('aleksbuss@gmail.com');
  });

  it('is case-insensitive', () => {
    const lower = __test.pickFallback('hire');
    const upper = __test.pickFallback('HIRE');
    expect(lower).toBe(upper);
  });
});

describe('agent.isValidMsg', () => {
  it('accepts well-formed user message', () => {
    expect(__test.isValidMsg({ role: 'user', content: 'hi' })).toBe(true);
  });
  it('accepts well-formed assistant message', () => {
    expect(__test.isValidMsg({ role: 'assistant', content: 'reply' })).toBe(true);
  });
  it('rejects unknown role', () => {
    expect(__test.isValidMsg({ role: 'system', content: 'x' })).toBe(false);
  });
  it('rejects non-string content', () => {
    expect(__test.isValidMsg({ role: 'user', content: 42 })).toBe(false);
  });
  it('rejects null / undefined / non-object', () => {
    expect(__test.isValidMsg(null)).toBe(false);
    expect(__test.isValidMsg(undefined)).toBe(false);
    expect(__test.isValidMsg('string')).toBe(false);
  });
});

describe('agent.history persistence', () => {
  beforeEach(() => {
    __test.resetHistory();
  });

  it('persists and reloads from localStorage', () => {
    const sample = [
      { role: 'user' as const, content: 'hello' },
      { role: 'assistant' as const, content: 'world' },
    ];
    __test.saveHistory(sample);
    const loaded = __test.loadHistory();
    expect(loaded).toEqual(sample);
  });

  it('returns empty array when storage is empty', () => {
    expect(__test.loadHistory()).toEqual([]);
  });

  it('returns empty array when storage has malformed JSON', () => {
    localStorage.setItem('agent_history_v1', 'not_json{');
    expect(__test.loadHistory()).toEqual([]);
  });

  it('drops invalid entries on load', () => {
    localStorage.setItem('agent_history_v1', JSON.stringify([
      { role: 'user', content: 'ok' },
      { role: 'system', content: 'bad' },        // invalid role
      { role: 'assistant', content: 42 },         // invalid content
      { role: 'assistant', content: 'also ok' },
    ]));
    const loaded = __test.loadHistory();
    expect(loaded).toEqual([
      { role: 'user', content: 'ok' },
      { role: 'assistant', content: 'also ok' },
    ]);
  });

  it('caps history at 30 messages', () => {
    const big = Array.from({ length: 50 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: 'msg ' + i,
    }));
    __test.saveHistory(big);
    const loaded = __test.loadHistory();
    expect(loaded.length).toBe(30);
    expect(loaded[0].content).toBe('msg 20');
    expect(loaded[29].content).toBe('msg 49');
  });
});

describe('agent.isAllowedEndpoint', () => {
  it('allows default production proxy endpoint', () => {
    expect(__test.isAllowedEndpoint('https://aleksejs-agent-proxy.aleksbuss.workers.dev/chat')).toBe(true);
  });

  it('allows aleksbuss workers.dev subdomains', () => {
    expect(__test.isAllowedEndpoint('https://staging-agent.aleksbuss.workers.dev/chat')).toBe(true);
  });

  it('allows aleksbuss.dev and aleksbuss.de domains', () => {
    expect(__test.isAllowedEndpoint('https://aleksbuss.dev/api/chat')).toBe(true);
    expect(__test.isAllowedEndpoint('https://api.aleksbuss.dev/chat')).toBe(true);
    expect(__test.isAllowedEndpoint('https://aleksbuss.de/chat')).toBe(true);
  });

  it('allows localhost and 127.0.0.1 for local dev', () => {
    expect(__test.isAllowedEndpoint('http://localhost:8787/chat')).toBe(true);
    expect(__test.isAllowedEndpoint('http://127.0.0.1:8787/chat')).toBe(true);
    expect(__test.isAllowedEndpoint('https://localhost:3000/chat')).toBe(true);
  });

  it('rejects arbitrary third-party endpoints', () => {
    expect(__test.isAllowedEndpoint('https://evil.com/chat')).toBe(false);
    expect(__test.isAllowedEndpoint('https://attacker.workers.dev/chat')).toBe(false);
    expect(__test.isAllowedEndpoint('http://aleksbuss.dev/chat')).toBe(false); // non-https remote
    expect(__test.isAllowedEndpoint('javascript:alert(1)')).toBe(false);
    expect(__test.isAllowedEndpoint('')).toBe(false);
  });
});
