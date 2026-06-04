/** Pure helpers shared across modules. Easy to unit-test. */

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ESCAPE_MAP[c] || c);
}
const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function isReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

export function $<T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(sel);
}
export function $$<T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(sel));
}

/** rAF-throttle: collapses bursts of calls into one per animation frame. */
export function rafThrottle<A extends unknown[]>(fn: (...args: A) => void): (...args: A) => void {
  let queued = false;
  let lastArgs: A | null = null;
  return (...args: A) => {
    lastArgs = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (lastArgs) fn(...lastArgs);
    });
  };
}

/** Run callback when element first scrolls into view (default 12% threshold). */
export function onceVisible(el: Element, cb: () => void, threshold = 0.12): IntersectionObserver {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        cb();
        io.disconnect();
        return;
      }
    }
  }, { threshold });
  io.observe(el);
  return io;
}
