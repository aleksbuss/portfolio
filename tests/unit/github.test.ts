import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { __test } from '../../src/github';

describe('github.relativeAgo', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-04-27T12:00:00Z')); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns "pushed today" for same-day push', () => {
    expect(__test.relativeAgo('2026-04-27T03:00:00Z')).toBe('pushed today');
  });

  it('returns "pushed 1d ago" for one day prior', () => {
    expect(__test.relativeAgo('2026-04-26T12:00:00Z')).toBe('pushed 1d ago');
  });

  it('returns N-day form for under a month', () => {
    expect(__test.relativeAgo('2026-04-15T12:00:00Z')).toBe('pushed 12d ago');
  });

  it('returns months form for under a year', () => {
    expect(__test.relativeAgo('2026-01-01T12:00:00Z')).toBe('pushed 3mo ago');
  });

  it('returns years form for over a year', () => {
    expect(__test.relativeAgo('2024-01-01T12:00:00Z')).toBe('pushed 2y ago');
  });

  it('handles malformed input', () => {
    expect(__test.relativeAgo('')).toBe('pushed —');
    expect(__test.relativeAgo('not-a-date')).toBe('pushed —');
  });
});
