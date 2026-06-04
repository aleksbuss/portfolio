/**
 * Live GitHub repo data for project cards.
 * Public API (no auth) — 60 req/hour per IP. We cache responses in localStorage with 12h TTL,
 * so most page loads do zero requests.
 *
 * Wire a project to a repo by adding `data-gh-repo="aleksbuss/repo-name"` to its `.proj` element.
 */
import { $$ } from './utils';

interface RepoMeta {
  stars: number;
  pushed: string;
  language?: string;
}

const CACHE_KEY = 'gh_repo_cache_v1';
const TTL_MS = 12 * 60 * 60 * 1000;

interface CacheEntry {
  ts: number;
  data: RepoMeta;
}

export function initGithubLive(): void {
  const projs = $$('.proj[data-gh-repo]');
  for (const proj of projs) {
    const repo = proj.dataset.ghRepo;
    if (!repo) continue;
    fetchAndPaint(proj, repo).catch(err => {
      console.warn(JSON.stringify({ event: 'gh_fetch_failed', repo, err: String(err) }));
    });
  }
}

async function fetchAndPaint(proj: HTMLElement, repo: string): Promise<void> {
  const cached = getCached(repo);
  if (cached) {
    paint(proj, cached);
    return;
  }
  const meta = await fetchRepoMeta(repo);
  if (!meta) return;
  setCached(repo, meta);
  paint(proj, meta);
}

async function fetchRepoMeta(repo: string): Promise<RepoMeta | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { 'Accept': 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const json = await res.json() as Record<string, unknown>;
    return {
      stars: Number(json.stargazers_count ?? 0),
      pushed: String(json.pushed_at ?? ''),
      language: typeof json.language === 'string' ? json.language : undefined,
    };
  } catch {
    return null;
  }
}

function paint(proj: HTMLElement, meta: RepoMeta): void {
  const meta_el = proj.querySelector('.proj-meta');
  if (!meta_el) return;
  // remove any prior live tag (in case of re-init)
  meta_el.querySelectorAll('.gh-live').forEach(el => el.remove());

  const liveBox = document.createElement('span');
  liveBox.className = 'gh-live';
  const ago = relativeAgo(meta.pushed);
  const stars = meta.stars > 0 ? `★ ${meta.stars}` : '★ —';
  liveBox.innerHTML = `<span class="gh-stars">${stars}</span> · <span class="gh-ago">${ago}</span>`;
  meta_el.appendChild(liveBox);
}

function relativeAgo(iso: string): string {
  if (!iso) return 'pushed —';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return 'pushed —';
  const diff = Date.now() - then;
  const day = 86_400_000;
  const days = Math.floor(diff / day);
  if (days <= 0) return 'pushed today';
  if (days === 1) return 'pushed 1d ago';
  if (days < 30) return `pushed ${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `pushed ${months}mo ago`;
  const years = Math.floor(months / 12);
  return `pushed ${years}y ago`;
}

function getCache(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getCached(repo: string): RepoMeta | null {
  const all = getCache();
  const e = all[repo];
  if (!e) return null;
  if (Date.now() - e.ts > TTL_MS) return null;
  return e.data;
}

function setCached(repo: string, data: RepoMeta): void {
  try {
    const all = getCache();
    all[repo] = { ts: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch {
    // quota — non-fatal
  }
}

export const __test = { relativeAgo };
