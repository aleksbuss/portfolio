/** Top sysbar runtime fields: simulated CPU jitter + Berlin clock + Mobile drawer + Scroll spy. */
import { $, $$ } from './utils';

let timer: number | null = null;

export function initSysbar(): void {
  const sysbar = $('#sysbar');
  const cpu = $('#sysCpu');
  const tz = $('#sysTz');
  const menuToggle = $<HTMLButtonElement>('#menuToggle');
  const mobileDrawer = $('#mobileDrawer');

  // 1. Clock & CPU metrics
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

  // 2. Mobile drawer toggle
  if (menuToggle && sysbar) {
    const closeDrawer = () => {
      sysbar.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', 'true');
    };

    const toggleDrawer = () => {
      const isOpen = sysbar.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    // Close on link click inside drawer
    $$('.mobile-nav-item, .mobile-cta', sysbar).forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sysbar.classList.contains('menu-open')) {
        closeDrawer();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (sysbar.classList.contains('menu-open')) {
        const target = e.target as HTMLElement;
        if (!sysbar.contains(target)) {
          closeDrawer();
        }
      }
    });
  }

  // 3. Scroll spy for navigation pills
  const navLinks = $$<HTMLAnchorElement>('.sysbar .ctrls a[href^="#"]');
  const sections: HTMLElement[] = [];
  navLinks.forEach((link) => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const el = $(id);
      if (el) sections.push(el);
    }
  });

  if (sections.length > 0) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 160;
          let currentId = '';
          for (let i = sections.length - 1; i >= 0; i--) {
            const sec = sections[i];
            if (sec.offsetTop <= scrollPos) {
              currentId = '#' + sec.id;
              break;
            }
          }
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}
