/** Wrap in-page anchor navigation in View Transitions for smooth section changes. */
export function initViewTransitions(): void {
  if (!('startViewTransition' in document)) return;
  document.addEventListener('click', e => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    document.startViewTransition!(() => {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  });
}
