/** Top sysbar runtime fields: simulated CPU jitter + Berlin clock. */
import { $ } from './utils';

let timer: number | null = null;

export function initSysbar(): void {
  const cpu = $('#sysCpu');
  const tz = $('#sysTz');
  const tick = () => {
    if (cpu) cpu.textContent = (0.28 + Math.random() * 0.42).toFixed(2) + 'ms';
    if (tz) {
      const d = new Date();
      const t = d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin',
      });
      tz.textContent = t + ' CET';
    }
  };
  tick();
  timer = window.setInterval(tick, 1500);

  // pause when tab hidden — saves CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && timer !== null) {
      clearInterval(timer);
      timer = null;
    } else if (!document.hidden && timer === null) {
      tick();
      timer = window.setInterval(tick, 1500);
    }
  });
}
