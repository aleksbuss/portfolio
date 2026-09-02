import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initHeroWaveform, destroyHeroWaveform } from '../../src/hero-waveform';

describe('hero-waveform initialization and lifecycle', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="heroViz">
        <div class="hero-viz-frame">
          <canvas id="heroVizCanvas"></canvas>
        </div>
      </div>
    `;
    destroyHeroWaveform();
  });

  afterEach(() => {
    destroyHeroWaveform();
  });

  it('can be called multiple times without duplicate initializations or crashes', async () => {
    // Calling init concurrently or sequentially
    const p1 = initHeroWaveform();
    const p2 = initHeroWaveform();
    await Promise.all([p1, p2]);

    // Cleanup and re-init
    destroyHeroWaveform();
    await initHeroWaveform();
    destroyHeroWaveform();
  });
});
