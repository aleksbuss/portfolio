import { describe, it, expect, vi } from 'vitest';
import { escapeHtml, rafThrottle } from '../../src/utils';

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml('<a href="x">&copy;</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;copy;&lt;/a&gt;');
  });

  it('escapes single quotes (XSS surface)', () => {
    expect(escapeHtml("don't")).toBe('don&#39;t');
  });

  it('returns plain strings unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
    expect(escapeHtml('')).toBe('');
  });

  it('handles a real-world adversarial payload', () => {
    const payload = `<img src=x onerror="alert('xss')">`;
    const out = escapeHtml(payload);
    expect(out).not.toContain('<img');
    expect(out).not.toContain('"');
    expect(out).not.toContain("'");
  });
});

describe('rafThrottle', () => {
  it('coalesces multiple calls within the same frame into one invocation', async () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled(1);
    throttled(2);
    throttled(3);
    await new Promise(r => requestAnimationFrame(() => r(null)));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it('runs again on the next frame after a settled call', async () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled('a');
    await new Promise(r => requestAnimationFrame(() => r(null)));
    throttled('b');
    await new Promise(r => requestAnimationFrame(() => r(null)));
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'a');
    expect(fn).toHaveBeenNthCalledWith(2, 'b');
  });
});
