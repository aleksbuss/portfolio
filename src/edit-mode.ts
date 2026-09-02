/** postMessage host integration for design-tool tweaks panel. */
import { $ } from './utils';

interface EditState {
  accent: string;
  showCursor: boolean;
  showAurora: boolean;
  showTicker: boolean;
}

export function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (typeof window !== 'undefined' && origin === window.location.origin) return true;
  // Local development
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  // Production and staging domains
  if (/^https:\/\/([a-z0-9-]+\.)*(aleksbuss\.dev|aleksbuss\.de|aleksejsbuss\.com)$/.test(origin)) return true;
  return false;
}

export function initEditMode(): void {
  const st: EditState = {
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8052ff',
    showCursor: true,
    showAurora: false,
    showTicker: true,
  };
  let panel: HTMLDivElement | null = null;

  const apply = (t: EditState): void => {
    if (t.accent) document.documentElement.style.setProperty('--accent', t.accent);
    document.body.style.cursor = 'default';
    const cdot = $('#cdot');
    const cring = $('#cring');
    if (cdot && cring) {
      cdot.style.display = t.showCursor ? 'block' : 'none';
      cring.style.display = t.showCursor ? 'block' : 'none';
    }
    const aurora = $('.aurora');
    if (aurora) aurora.style.display = t.showAurora ? 'block' : 'none';
    const ticker = $('.ticker');
    if (ticker) ticker.style.display = t.showTicker ? 'block' : 'none';
  };

  const build = (): HTMLDivElement => {
    const p = document.createElement('div');
    p.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9000;background:#000000;color:#ffffff;border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:1.4rem;width:260px;font-family:Geist,sans-serif;box-shadow:0 24px 60px rgba(0,0,0,0.9);display:none';
    p.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:1.1rem;font-weight:600">Tweaks</span>
        <button id="ct" style="background:none;border:none;color:#9a9a9a;cursor:pointer;font-size:1.3rem;line-height:1">×</button>
      </div>
      <label style="display:block;margin-bottom:0.9rem">
        <span style="font-size:0.7rem;color:#9a9a9a;letter-spacing:0.1em;text-transform:uppercase;display:block;margin-bottom:0.4rem">Accent</span>
        <input type="color" id="ta" value="${st.accent}" style="width:100%;height:34px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:transparent;cursor:pointer">
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;cursor:pointer">
        <span style="font-size:0.85rem">Custom cursor</span>
        <input type="checkbox" id="tc" ${st.showCursor ? 'checked' : ''}>
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;cursor:pointer">
        <span style="font-size:0.85rem">Aurora background</span>
        <input type="checkbox" id="taa" ${st.showAurora ? 'checked' : ''}>
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;cursor:pointer">
        <span style="font-size:0.85rem">Show ticker</span>
        <input type="checkbox" id="tt" ${st.showTicker ? 'checked' : ''}>
      </label>`;
    document.body.appendChild(p);
    p.querySelector<HTMLButtonElement>('#ct')!.onclick = () => {
      p.style.display = 'none';
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    };
    p.querySelector<HTMLInputElement>('#ta')!.oninput = e => {
      st.accent = (e.target as HTMLInputElement).value;
      apply(st);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: st }, '*');
    };
    p.querySelector<HTMLInputElement>('#tc')!.onchange = e => {
      st.showCursor = (e.target as HTMLInputElement).checked;
      apply(st);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: st }, '*');
    };
    p.querySelector<HTMLInputElement>('#taa')!.onchange = e => {
      st.showAurora = (e.target as HTMLInputElement).checked;
      apply(st);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: st }, '*');
    };
    p.querySelector<HTMLInputElement>('#tt')!.onchange = e => {
      st.showTicker = (e.target as HTMLInputElement).checked;
      apply(st);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: st }, '*');
    };
    return p;
  };

  window.addEventListener('message', (e: MessageEvent) => {
    if (!isAllowedOrigin(e.origin)) return;
    if (e.data?.type === '__activate_edit_mode') {
      if (!panel) panel = build();
      panel.style.display = 'block';
    }
    if (e.data?.type === '__deactivate_edit_mode') {
      if (panel) panel.style.display = 'none';
    }
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  apply(st);
}

export const __test = {
  isAllowedOrigin,
};
