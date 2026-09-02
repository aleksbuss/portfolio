import { describe, it, expect } from 'vitest';
import { isAllowedOrigin } from '../../src/edit-mode';

describe('edit-mode.isAllowedOrigin', () => {
  it('allows matching window origin', () => {
    expect(isAllowedOrigin(window.location.origin)).toBe(true);
  });

  it('allows localhost and 127.0.0.1 on various ports', () => {
    expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://127.0.0.1:4173')).toBe(true);
    expect(isAllowedOrigin('https://localhost:8080')).toBe(true);
  });

  it('allows production domains and subdomains', () => {
    expect(isAllowedOrigin('https://aleksbuss.dev')).toBe(true);
    expect(isAllowedOrigin('https://preview.aleksbuss.dev')).toBe(true);
    expect(isAllowedOrigin('https://aleksbuss.de')).toBe(true);
    expect(isAllowedOrigin('https://aleksejsbuss.com')).toBe(true);
  });

  it('rejects untrusted third-party origins', () => {
    expect(isAllowedOrigin('https://evil-site.com')).toBe(false);
    expect(isAllowedOrigin('http://malicious-aleksbuss.dev.attacker.com')).toBe(false);
    expect(isAllowedOrigin('null')).toBe(false);
    expect(isAllowedOrigin('')).toBe(false);
  });
});
