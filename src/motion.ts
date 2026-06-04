/**
 * Combined motion module: cursor + parallax blobs + 3D tilt.
 * Single rAF loop, lazy tilt init, prefers-reduced-motion + coarse-pointer aware,
 * pauses when document.hidden.
 */
import { $, $$, isCoarsePointer, isReducedMotion, onceVisible } from './utils';

interface MotionState {
  // raw mouse
  mx: number;
  my: number;
  // smoothed (ring follows dot)
  rx: number;
  ry: number;
  // normalized [-1, 1]
  pmx: number;
  pmy: number;
}

const state: MotionState = {
  mx: 0, my: 0, rx: 0, ry: 0, pmx: 0, pmy: 0,
};

let cdot: HTMLElement | null = null;
let cring: HTMLElement | null = null;
let blobs: HTMLElement[] = [];
let gridBg: HTMLElement | null = null;
let running = false;

export function initMotion(): void {
  const reduced = isReducedMotion();
  const coarse = isCoarsePointer();

  cdot = $('#cdot');
  cring = $('#cring');
  blobs = ['#blob1', '#blob2', '#blob3'].map(s => $(s)).filter((b): b is HTMLElement => !!b);
  gridBg = $('#gridBg');

  if (!coarse && cdot && cring) {
    state.mx = window.innerWidth / 2;
    state.my = window.innerHeight / 2;
    state.rx = state.mx;
    state.ry = state.my;
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    bindHoverHints();
  } else if (cdot && cring) {
    cdot.style.display = 'none';
    cring.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  if (!reduced && !coarse) {
    initTilt();
  }

  startLoop();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
    else if (!running) startLoop();
  });
}

function onMouseMove(e: MouseEvent): void {
  state.mx = e.clientX;
  state.my = e.clientY;
  state.pmx = (e.clientX / window.innerWidth - 0.5) * 2;
  state.pmy = (e.clientY / window.innerHeight - 0.5) * 2;
}

function startLoop(): void {
  running = true;
  const reduced = isReducedMotion();
  const coarse = isCoarsePointer();

  const frame = () => {
    if (!running) return;
    // cursor smoothing
    if (cdot && cring && !coarse) {
      state.rx += (state.mx - state.rx) * 0.18;
      state.ry += (state.my - state.ry) * 0.18;
      cdot.style.transform = `translate3d(${state.mx}px, ${state.my}px, 0) translate(-50%, -50%)`;
      cring.style.transform = `translate3d(${state.rx}px, ${state.ry}px, 0) translate(-50%, -50%)`;
    }
    // parallax blobs (skip for reduced motion)
    if (!reduced && !coarse) {
      if (blobs[0]) blobs[0].style.transform = `translate3d(${state.pmx * 40}px, ${state.pmy * 30}px, 0)`;
      if (blobs[1]) blobs[1].style.transform = `translate3d(${state.pmx * -30}px, ${state.pmy * -40}px, 0)`;
      if (blobs[2]) blobs[2].style.transform = `translate3d(${state.pmx * 25}px, ${state.pmy * -20}px, 0)`;
      if (gridBg) gridBg.style.transform = `translate3d(${state.pmx * 12}px, ${state.pmy * 12}px, 0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function bindHoverHints(): void {
  // Use event delegation rather than per-element listeners — saves dozens of bindings.
  const SELECTOR = 'a, button, .stack-pill, .tag, .metric, .value, .proj, .tl-row, .cmd-sug';
  document.addEventListener('mouseover', e => {
    const t = (e.target as HTMLElement).closest(SELECTOR);
    if (t) document.body.classList.add('hov');
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    const t = (e.target as HTMLElement).closest(SELECTOR);
    if (t) document.body.classList.remove('hov');
  }, { passive: true });
}

/* ─── 3D TILT (lazy: registered only when card scrolls in) ─── */
function initTilt(): void {
  registerTiltLazy('.proj-thumb', 16, 1.04);
  registerTiltLazy('.value', 4, 1.005);
  registerTiltLazy('.metric', 4, 1.005);
}

function registerTiltLazy(sel: string, mag: number, scale: number): void {
  $$(sel).forEach(el => {
    el.style.willChange = 'transform';
    onceVisible(el, () => attachTilt(el, mag, scale), 0.15);
  });
}

function attachTilt(el: HTMLElement, mag: number, scale: number): void {
  el.style.transformStyle = 'preserve-3d';
  let raf = 0;
  let cx = 0, cy = 0;
  const handler = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    cx = (e.clientX - r.left) / r.width;
    cy = (e.clientY - r.top) / r.height;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const rxv = (cy - 0.5) * -mag;
      const ryv = (cx - 0.5) * mag;
      el.style.transform = `perspective(1200px) rotateX(${rxv}deg) rotateY(${ryv}deg) scale(${scale})`;
    });
  };
  const reset = () => {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    el.style.transform = '';
  };
  el.addEventListener('mousemove', handler, { passive: true });
  el.addEventListener('mouseleave', reset, { passive: true });
}

/* ─── progress bar (top scroll line) ─── */
export function initProgressBar(): void {
  const progress = $('#progress');
  if (!progress) return;
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      progress.style.width = p + '%';
    });
  }, { passive: true });
}
