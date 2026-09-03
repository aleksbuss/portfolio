/** Portfolio entry. Boots, then mounts every section module. */
import './styles.css';
import { startBoot } from './boot';
import { startHeroSequence } from './hero';
import { initMotion, initProgressBar } from './motion';
import { initReveal, initMetricCounters } from './observers';
import { initSysbar } from './sysbar';
import { initTheme } from './theme';
import { initI18n } from './i18n';
import { initAgent } from './agent';
import { initModals } from './modals';
import { initGithubLive } from './github';
import { initViewTransitions } from './view-transitions';
import { initEditMode } from './edit-mode';

function mount(): void {
  // Theme + i18n must run early — they mutate DOM that other modules read.
  initTheme();
  initI18n();

  // Boot sequence holds back hero animations until it finishes.
  startBoot(() => {
    startHeroSequence();

    // Hero waveform is heavy (Three.js). Mount after boot clears and DOM is stable,
    // so it never competes for GPU/layout resources during initial paint.
    requestAnimationFrame(() => {
      import('./hero-waveform').then(m => m.initHeroWaveform()).catch(() => {});
    });
  });

  initSysbar();
  initMotion();
  initProgressBar();
  initReveal();
  initMetricCounters();
  initAgent();
  initModals();
  initGithubLive();
  initViewTransitions();
  initEditMode();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
