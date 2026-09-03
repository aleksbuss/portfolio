/**
 * Dala Signature Particle Constellation (Neural / Brain Particle Cloud)
 *
 * A dense, organic 3D constellation of thousands of multicolored triangular particles
 * forming an organic neural brain cloud against pure black velvet #000000.
 *
 * Tokens:
 *   Electric Iris:  #8052ff
 *   Saffron Spark:  #ffb829
 *   Deep Verdant:   #15846e
 *   Plasma Blue:    #4d88ff
 *   Magenta:        #eb54bc
 */
import { isReducedMotion, isCoarsePointer } from './utils';

let cleanup: (() => void) | null = null;
let isInitializing = false;

export async function initHeroWaveform(): Promise<void> {
  if (cleanup || isInitializing) return;
  isInitializing = true;

  try {
    const root = document.getElementById('heroViz');
    const canvas = document.getElementById('heroVizCanvas') as HTMLCanvasElement | null;
    if (!root || !canvas) return;

    const gl = canCreateWebGL2(canvas);
    const reduced = isReducedMotion();
    const coarse = isCoarsePointer();
    const isTest = typeof navigator !== 'undefined' && navigator.webdriver;
    if (!gl || reduced || coarse || isTest) {
      root.classList.add('viz-static');
      return;
    }

    let three: typeof import('three');
    try {
      three = await import('three');
    } catch (err) {
      console.warn('Three.js load failed, using fallback', err);
      root.classList.add('viz-static');
      return;
    }

    if (!isInitializing) return;

    const stop = mountConstellation(three, canvas, root);
    cleanup = stop;
  } finally {
    isInitializing = false;
  }
}

export function destroyHeroWaveform(): void {
  isInitializing = false;
  if (cleanup) cleanup();
  cleanup = null;
}

function canCreateWebGL2(_canvas: HTMLCanvasElement): boolean {
  try {
    const probe = document.createElement('canvas');
    const ctx = probe.getContext('webgl2');
    return !!ctx;
  } catch {
    return false;
  }
}

function mountConstellation(
  T: typeof import('three'),
  canvas: HTMLCanvasElement,
  root: HTMLElement
): () => void {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new T.Scene();

  const camera = new T.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  // Palette: Electric Iris, Saffron Spark, Deep Verdant, Plasma Blue, Electric Magenta
  const PALETTE = [
    new T.Color('#8052ff'), // Electric Iris
    new T.Color('#ffb829'), // Saffron Spark
    new T.Color('#15846e'), // Deep Verdant
    new T.Color('#4d88ff'), // Plasma Blue
    new T.Color('#eb54bc'), // Magenta
    new T.Color('#ffffff'), // Bone White
  ];

  const PARTICLE_COUNT = 3200;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const scales = new Float32Array(PARTICLE_COUNT);
  const basePos: { x: number; y: number; z: number; speed: number; phase: number; radius: number }[] = [];

  // Generate an organic two-lobed neural brain cloud shape
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const isLeftLobe = Math.random() > 0.5;
    const lobeOffsetX = isLeftLobe ? -0.85 : 0.85;

    // Spherical distribution with organic distortion
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * 1.65;

    // Ellipsoidal flattening & lobe contour
    const x = r * Math.sin(phi) * Math.cos(theta) * 1.1 + lobeOffsetX * 0.7;
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.95;
    const z = r * Math.cos(phi) * 1.05;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    basePos.push({
      x,
      y,
      z,
      speed: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      radius: Math.sqrt(x * x + y * y + z * z),
    });

    // Random chromatic color from Dala palette
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    scales[i] = Math.random() * 2.5 + 1.2;
  }

  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new T.BufferAttribute(colors, 3));

  // Custom triangular particle texture generator
  const createTriangleTexture = () => {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) return new T.Texture();

    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.15);
    ctx.lineTo(size * 0.85, size * 0.85);
    ctx.lineTo(size * 0.15, size * 0.85);
    ctx.closePath();
    ctx.stroke();

    return new T.CanvasTexture(c);
  };

  const pointTexture = createTriangleTexture();

  const material = new T.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    map: pointTexture,
    transparent: true,
    opacity: 0.9,
    blending: T.AdditiveBlending,
    depthWrite: false,
  });

  const particleSystem = new T.Points(geometry, material);
  scene.add(particleSystem);

  // Resize handling & cached bounds to eliminate layout thrashing
  const sizingHost = root.querySelector('.hero-viz-frame') as HTMLElement | null || root;
  let hostRect = sizingHost.getBoundingClientRect();
  const updateRect = () => {
    hostRect = sizingHost.getBoundingClientRect();
  };
  const resize = () => {
    updateRect();
    const w = Math.max(1, Math.round(hostRect.width));
    const h = Math.max(1, Math.round(hostRect.height || w * 0.7));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(sizingHost);
  window.addEventListener('scroll', updateRect, { passive: true });
  window.addEventListener('resize', updateRect, { passive: true });

  // Mouse interactivity (no layout reads in mousemove)
  let targetRotX = 0;
  let targetRotY = 0;
  const onMouseMove = (e: MouseEvent) => {
    if (!hostRect.width || !hostRect.height) return;
    const nx = ((e.clientX - hostRect.left) / hostRect.width) * 2 - 1;
    const ny = -(((e.clientY - hostRect.top) / hostRect.height) * 2 - 1);
    targetRotY = nx * 0.45;
    targetRotX = -ny * 0.35;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  let raf = 0;
  let running = true;
  const t0 = performance.now();

  const tick = () => {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;

    // Organic neural pulse and breathing
    const posAttr = geometry.attributes.position as import('three').BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const bp = basePos[i];
      const wave = Math.sin(t * bp.speed + bp.phase) * 0.08;
      const pulse = 1.0 + Math.sin(t * 1.5 + bp.radius * 2.0) * 0.04;

      posArray[i * 3] = bp.x * pulse + wave * 0.5;
      posArray[i * 3 + 1] = bp.y * pulse + wave;
      posArray[i * 3 + 2] = bp.z * pulse + wave * 0.5;
    }
    posAttr.needsUpdate = true;

    // Smooth rotation and drift
    particleSystem.rotation.y += (targetRotY + t * 0.08 - particleSystem.rotation.y) * 0.05;
    particleSystem.rotation.x += (targetRotX + Math.sin(t * 0.2) * 0.05 - particleSystem.rotation.x) * 0.05;
    particleSystem.rotation.z = Math.cos(t * 0.15) * 0.04;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', updateRect);
    window.removeEventListener('resize', updateRect);
    ro.disconnect();
    geometry.dispose();
    material.dispose();
    pointTexture.dispose();
    renderer.dispose();
  };
}
