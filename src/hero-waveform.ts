/**
 * Hero "live AI agent" visualization — premium Three.js waveform that
 * occupies the right side of the hero card.
 *
 * Concept: three parallel WebGL line strips that morph in real time, as
 * if an oscilloscope were monitoring a live audio stream. A slow camera
 * orbit gives parallax depth so it reads as 3D, not a flat sine wave.
 * Below the waveform a transcript line types itself character-by-character,
 * cycles through real-system snippets, and resets.
 *
 * Capability gating:
 *   - reduced-motion → hide canvas, show SVG fallback, freeze transcript
 *   - coarse pointer / narrow viewport → same fallback (no Three.js download)
 *   - no WebGL2 → same fallback
 *
 * Theme adaptation:
 *   - dark = neon CRT (signal-green primary line, plasma-blue side echoes,
 *     CSS drop-shadow glow on the canvas — bloom-equivalent without the
 *     postprocessing bundle cost).
 *   - light = blueprint (thin plasma-blue lines on cream, no glow, lower
 *     amplitude — reads as a technical drawing).
 *
 * Three.js core only (~150KB gzipped via dynamic import, code-split into
 * its own chunk). No EffectComposer / passes — drop-shadow + scanline
 * overlay carry the post-process feel for a fraction of the bundle.
 */
import { isReducedMotion, isCoarsePointer } from './utils';

interface Phrase {
  meta: string;
  text: string;
}

const PHRASES: Phrase[] = [
  { meta: '[system · pulse]',   text: '7 production systems · all green · last sync 12s ago' },
  { meta: '[edge · cf-fra]',    text: 'request → fra1 → cdg2 → lhr · 38ms p50' },
  { meta: '[ollama · local]',   text: 'llama3.2:8b loaded · context 8k · streaming' },
  { meta: '[n8n · flow]',       text: 'message → moderation_check → translate → reply ✓' },
  { meta: '[telegram · bot]',   text: 'webhook verified · HMAC-SHA256 · session opened' },
  { meta: '[deploy · cf]',      text: 'pushed to 12 PoPs · 8.4s · 0 cold-start' },
  { meta: '[agent · respond]',  text: 'founder-grade ownership · EU-based · open Q3 ’26' },
  { meta: '[github · sync]',    text: '3 commits ahead · main → live in 22s' },
];

const TYPE_SPEED_MS = 28;
const HOLD_MS = 2200;
const FADE_MS = 280;

let cleanup: (() => void) | null = null;

export async function initHeroWaveform(): Promise<void> {
  const root = document.getElementById('heroViz');
  const canvas = document.getElementById('heroVizCanvas') as HTMLCanvasElement | null;
  const transcript = document.getElementById('heroVizTranscript');
  if (!root || !canvas || !transcript) return;

  // Capability gate. Anything that fails → keep SVG fallback visible,
  // do NOT download Three.js. The fallback is already in the DOM.
  const gl = canCreateWebGL2(canvas);
  const reduced = isReducedMotion();
  const coarse = isCoarsePointer();
  const narrow = window.matchMedia('(max-width: 1023px)').matches;
  if (!gl || reduced || coarse || narrow) {
    root.classList.add('viz-static');
    startTranscript(transcript, reduced);
    return;
  }

  // Hand the heavy work off to a separate chunk.
  let three: typeof import('three');
  try {
    three = await import('three');
  } catch (err) {
    console.warn('three load failed, falling back to SVG', err);
    root.classList.add('viz-static');
    startTranscript(transcript, false);
    return;
  }

  const stop = mountScene(three, canvas, root);
  const stopTranscript = startTranscript(transcript, false);
  cleanup = () => { stop(); stopTranscript(); };
}

export function destroyHeroWaveform(): void {
  if (cleanup) cleanup();
  cleanup = null;
}

function canCreateWebGL2(_canvas: HTMLCanvasElement): boolean {
  // Probe on a throwaway canvas — calling getContext on the real canvas
  // would burn its single allowed context (subsequent Three.js getContext
  // would receive a lost context).
  try {
    const probe = document.createElement('canvas');
    const ctx = probe.getContext('webgl2');
    return !!ctx;
  } catch {
    return false;
  }
}

function mountScene(
  T: typeof import('three'),
  canvas: HTMLCanvasElement,
  root: HTMLElement,
): () => void {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 5.4);

  // Three parallel oscilloscope channels. Each is a Line geometry of N
  // segments, deformed every frame by a sum of sines + per-channel phase.
  // Z-offset gives the depth that justifies WebGL over a 2D canvas.
  const SEG = 220;
  const CHANNELS = [
    { z: 0.0,  amp: 0.62, phase: 0.0,  weight: 1.00, freq: 1.0, name: 'primary' },
    { z: -0.4, amp: 0.42, phase: 1.7,  weight: 0.55, freq: 1.4, name: 'echo-1'  },
    { z: -0.8, amp: 0.28, phase: 3.1,  weight: 0.30, freq: 0.7, name: 'echo-2'  },
  ];

  const lines = CHANNELS.map(ch => {
    const positions = new Float32Array(SEG * 3);
    for (let i = 0; i < SEG; i++) {
      const x = (i / (SEG - 1)) * 8 - 4;
      positions[i * 3]     = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = ch.z;
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(positions, 3));
    const mat = new T.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: ch.weight,
    });
    const line = new T.Line(geo, mat);
    scene.add(line);
    return { line, mat, geo, ch, positions };
  });

  // Theme-driven palette — read CSS variables so we stay in sync with
  // dark vs light without re-mounting the scene. Colors update on every
  // theme toggle via a MutationObserver below.
  const applyTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    const isLight = document.documentElement.dataset.theme === 'light';
    const primary = isLight
      ? cssColor(cs.getPropertyValue('--plasma') || '#2a5cd9', T)
      : cssColor(cs.getPropertyValue('--signal') || '#6fe09f', T);
    const echo = isLight
      ? cssColor(cs.getPropertyValue('--ink-3')  || '#5a5547', T)
      : cssColor(cs.getPropertyValue('--plasma') || '#5b8cff', T);
    lines[0].mat.color = primary;
    lines[1].mat.color = echo;
    lines[2].mat.color = echo;
    // light mode: tighten amplitude — blueprint reads cleaner with subtle deflection
    const ampMul = isLight ? 0.55 : 1.0;
    lines.forEach((l, i) => { l.ch.amp = CHANNELS[i].amp * ampMul; });
  };
  applyTheme();
  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Observe the frame, not the root — the root also contains the
  // transcript, so its height includes that and the canvas would render
  // into a too-tall buffer with mismatched aspect.
  const frame = root.querySelector('.hero-viz-frame') as HTMLElement | null;
  const sizingHost = frame || root;
  const resize = () => {
    const r = sizingHost.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height || w * 0.5625));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(sizingHost);

  let raf = 0;
  let running = true;
  const t0 = performance.now();

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      tick();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  const tick = () => {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    for (const { ch, geo, positions } of lines) {
      for (let i = 0; i < SEG; i++) {
        const u = i / (SEG - 1);
        const x = u * 8 - 4;
        // Sum-of-sines is plausible-enough for an "audio waveform" and is
        // cheap. Envelope tapers ends to zero so lines feel anchored.
        const env = Math.sin(u * Math.PI);
        const wave =
          Math.sin(x * 1.6 * ch.freq + t * 1.7 + ch.phase) * 0.55 +
          Math.sin(x * 3.3 * ch.freq - t * 0.9 + ch.phase * 1.3) * 0.30 +
          Math.sin(x * 7.1 * ch.freq + t * 2.4) * 0.15;
        positions[i * 3 + 1] = wave * ch.amp * env;
      }
      geo.attributes.position.needsUpdate = true;
    }
    // Slow camera drift for parallax. Stays tight so it's not distracting.
    camera.position.x = Math.sin(t * 0.18) * 0.35;
    camera.position.y = Math.cos(t * 0.13) * 0.18;
    camera.lookAt(0, 0, -0.4);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVisibility);
    themeObserver.disconnect();
    ro.disconnect();
    lines.forEach(({ geo, mat }) => { geo.dispose(); mat.dispose(); });
    renderer.dispose();
  };
}

function cssColor(raw: string, T: typeof import('three')): import('three').Color {
  const c = new T.Color();
  try { c.set(raw.trim() || '#ffffff'); } catch { c.set('#ffffff'); }
  return c;
}

function startTranscript(host: HTMLElement, frozen: boolean): () => void {
  const metaEl = host.querySelector('.vt-meta') as HTMLElement | null;
  const textEl = host.querySelector('.vt-text') as HTMLElement | null;
  if (!metaEl || !textEl) return () => {};

  // Frozen mode (reduced-motion): show first phrase static, no typing/loop.
  if (frozen) {
    metaEl.textContent = PHRASES[0].meta;
    textEl.textContent = PHRASES[0].text;
    return () => {};
  }

  let idx = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let cancelled = false;
  const schedule = (ms: number, fn: () => void) => {
    if (cancelled) return;
    timer = setTimeout(fn, ms);
  };

  const playPhrase = () => {
    const p = PHRASES[idx % PHRASES.length];
    idx++;
    metaEl.textContent = p.meta;
    textEl.textContent = '';
    host.classList.remove('vt-fade');
    let i = 0;
    const typeStep = () => {
      if (cancelled) return;
      i += 1;
      textEl.textContent = p.text.slice(0, i);
      if (i < p.text.length) {
        schedule(TYPE_SPEED_MS, typeStep);
      } else {
        schedule(HOLD_MS, () => {
          host.classList.add('vt-fade');
          schedule(FADE_MS, playPhrase);
        });
      }
    };
    typeStep();
  };
  playPhrase();

  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}
