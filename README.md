# aleksbuss.dev — Portfolio

Source for my personal portfolio: **[aleksbuss.dev](https://aleksbuss.dev)**

A hand-built, dependency-light site that doubles as a code sample — no UI framework, no template, every interaction written from scratch in TypeScript.

## Highlights

- **Zero-framework TypeScript** — modular ES architecture (`src/`), each section a self-contained mount (`theme`, `i18n`, `hero`, `agent`, `modals`, `observers`, …) wired in `main.ts`.
- **Live AI agent** — the "Ask the agent" dock talks to a Cloudflare Worker proxy (`workers/agent-proxy`) that rate-limits per IP via KV and streams from OpenRouter. No keys ever reach the client.
- **Motion & polish** — boot sequence, typed hero, Three.js audio-waveform visual (capability-gated, lazy-loaded so it never blocks LCP), View Transitions API page motion, scroll-reveal via `IntersectionObserver`.
- **i18n** — runtime EN/DE switching, no reload.
- **SEO / social** — JSON-LD `Person` schema, Open Graph + Twitter cards, generated OG image, sitemap, canonical.
- **Tested & shipped** — unit tests (Vitest), e2e (Playwright), CI on every push, Lighthouse budget config.

## Stack

`TypeScript` · `Vite` · `Three.js` · `Cloudflare Workers` (agent proxy) · `Vitest` · `Playwright` · `GitHub Actions`

## Develop

```bash
npm install
npm run dev        # vite dev server
npm run build      # production build → dist/
npm test           # unit (vitest)
npm run test:e2e   # end-to-end (playwright)
```

The agent proxy lives in `workers/agent-proxy/` — copy `.dev.vars.example` to `.dev.vars`, add an [OpenRouter](https://openrouter.ai/) key, then `npx wrangler dev`.

## License

Code is MIT. Content, copy, and personal branding are © Aleksejs Buss.
