import { describe, it, expect } from 'vitest';
import { getBootLines } from '../../src/boot';

describe('boot.BOOT_LINES integrity', () => {
  const lines = getBootLines();

  it('has at least 10 lines (enough for plausible boot timing)', () => {
    expect(lines.length).toBeGreaterThanOrEqual(10);
  });

  it('every line includes a [hh:mm.ms] timestamp span', () => {
    for (const ln of lines) {
      expect(ln).toMatch(/<span class="ts">\[\d{2}:\d{2}\.\d{3}\]<\/span>/);
    }
  });

  it('timestamps are monotonically increasing', () => {
    let prev = -1;
    for (const ln of lines) {
      const m = ln.match(/\[(\d{2}):(\d{2})\.(\d{3})\]/);
      expect(m, `line missing ts: ${ln}`).toBeTruthy();
      const ms = (+m![1] * 60 + +m![2]) * 1000 + +m![3];
      expect(ms, `not increasing: ${ln}`).toBeGreaterThan(prev);
      prev = ms;
    }
  });

  it('every line is valid HTML (closing tags balanced)', () => {
    for (const ln of lines) {
      const opens = (ln.match(/<span/g) || []).length;
      const closes = (ln.match(/<\/span>/g) || []).length;
      expect(opens, `unbalanced: ${ln}`).toBe(closes);
    }
  });
});
