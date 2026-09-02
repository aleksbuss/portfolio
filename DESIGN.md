# Aleksejs Buss — Style Reference
> cyber-aurora in an obsidian void — precision agentic systems, glowing waveforms, and technical minimalism

**Theme:** dark (with light blueprint mode)

Aleksejs Buss operates in a midnight void: a deep charcoal-black canvas (`#05060a`) elevated with subtle obsidian panels, punctuated by generative aurora meshes, ambient signal-green pulses (`#00ff88` / `#2e8b57`), plasma blues (`#2a5cd9`), and warm ember accents (`#d24a0e`). The design system embodies high-throughput technical authority — pairing crisp geometric sans (`Geist`) with industrial monospace accents (`JetBrains Mono` / `Geist Mono`) for telemetry, runtime counters, and terminal logs. Components are whisper-thin: 1px hairline borders at 8–15% opacity, pill-shaped controls at 9999px radius, and cards that float on barely-distinguishable dark surfaces. Buttons achieve a subtle 3D embossed effect through a layered shadow stack that pairs a soft drop shadow with inset white highlights — the chrome looks pressed into the surface rather than floating above it. Density is comfortable, never packed; the page breathes with generous section gaps and lets the generative waveform and telemetry graphics do the visual heavy lifting.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Canvas | `#05060a` | `--color-void-canvas` | Page canvas, deepest background layer — the void against which everything else floats |
| Obsidian Panel | `#0a0d14` | `--color-obsidian` | Card surfaces, elevated panels — a barely-perceptible warm-blue lift from the canvas |
| Charcoal Surface | `#12151f` | `--color-charcoal` | Interactive component surfaces, active states, hover layers |
| Onyx Header | `#080a10` | `--color-onyx` | Sysbar sticky navigation bar, persistent command dock surface |
| Smoke Terminus | `#020305` | `--color-smoke` | Secondary canvas tone, deepest gradient terminus |
| Graphite Divider | `#262a36` | `--color-graphite` | Supporting neutral for dividers, frame corners, and muted borders |
| Signal Green | `#00ff88` | `--color-signal-green` | Live telemetry status, streaming indicators, active agents, success dots |
| Plasma Blue | `#2a5cd9` | `--color-plasma-blue` | Architecture tags, AI model connectors, waveform secondary lines |
| Ember Accent | `#d24a0e` | `--color-ember-accent` | Primary call-to-action highlights, focus rings, interactive accents |
| Ash Mute | `#5c6275` | `--color-ash-mute` | Muted text, timestamps, terminal captions, inactive icon strokes |
| Fog Gray | `#a0a5b5` | `--color-fog-gray` | Body text, descriptions, secondary copy — warm technical gray that softens white's intensity |
| Bone White | `#f5f7fa` | `--color-bone-white` | Primary headings, high-emphasis metrics, key titles |
| Hairline | `#eaecf0` | `--color-hairline` | Ultra-subtle borders at 8–15% opacity — defines card edges and input fields against the void |

---

## Tokens — Typography

### Geist — Primary typeface for all UI — body text, headings, buttons, navigation. The geometric, slightly condensed forms paired with aggressively negative letter-spacing give every line a compressed, technical authority. Weight 300 for display headlines creates a whisper-confident tone; weight 400 for body; weight 500 for emphasis. Letter-spacing tightens proportionally: -0.04em at display sizes, -0.01em at body sizes. · `--font-sans`
- **Substitute:** Inter, Satoshi, system-ui
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 21, 24, 36, 56, 80
- **Line height:** 1.05–1.56
- **Letter spacing:** -0.045em at 80px, -0.03em at 36-56px, -0.02em at 21-24px, -0.01em at 14-18px
- **Role:** Primary typeface for all UI — body text, headings, buttons, navigation.

### JetBrains Mono / Geist Mono — Reserved for the brand signature, runtime counters, timestamps, and terminal code logs. Heavy weights at micro sizes act as a technical signature — an industrial monospace that contrasts Geist's lighter geometric forms. · `--font-mono`
- **Substitute:** Fira Code, Space Mono
- **Weights:** 400, 500, 700
- **Sizes:** 11, 12, 14
- **Line height:** 1.20, 1.33
- **Role:** Sysbar status, timestamp headers (`[00:00.812]`), metrics counters, and architecture tags.

### Fraunces (Optional Editorial Italic) — Expressive serif accent for editorial contrast in titles (e.g., *"what shipped"*, *"self-disciplined"*). · `--font-editorial`
- **Weights:** 300, 400 Italic
- **Role:** High-impact editorial contrast in display headings.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Font Family | Token |
|------|------|-------------|----------------|-------------|-------|
| caption-mono | 11px | 1.30 | +0.02em | JetBrains Mono | `--text-caption-mono` |
| caption | 12px | 1.33 | -0.01em | Geist | `--text-caption` |
| body-sm | 14px | 1.50 | -0.01em | Geist | `--text-body-sm` |
| body | 16px | 1.56 | -0.015em | Geist | `--text-body` |
| body-lg | 18px | 1.50 | -0.02em | Geist | `--text-body-lg` |
| subheading | 21px | 1.40 | -0.02em | Geist | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.025em | Geist | `--text-heading-sm` |
| heading-md | 36px | 1.22 | -0.03em | Geist | `--text-heading-md` |
| heading-lg | 56px | 1.15 | -0.04em | Geist | `--text-heading-lg` |
| display | 80px | 1.05 | -0.045em | Geist | `--text-display` |

---

## Tokens — Spacing & Shapes

**Base unit:** 4px  
**Density:** comfortable / technical

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| sysbtn / badges | 4px |
| cards / modals | 12px |
| waveform frames | 16px |
| buttons / tags | 9999px |

### Shadows & Elevation

| Name | Value | Token |
|------|-------|-------|
| Card Glass | `0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(234, 236, 240, 0.08) inset` | `--shadow-card` |
| Embossed Button | `0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.15) inset, 0 -1px 0 rgba(0, 0, 0, 0.4) inset` | `--shadow-btn` |
| Signal Glow | `0 0 16px rgba(0, 255, 136, 0.35)` | `--shadow-glow-signal` |
| Ember Glow | `0 0 20px rgba(210, 74, 14, 0.4)` | `--shadow-glow-ember` |

### Layout
- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

---

## Components

### Pill Primary Button (`Hire →` / `View Work →`)
**Role:** Primary action trigger  
9999px border-radius (full pill). Background `#12151f` with signature embossed shadow stack and subtle `#d24a0e` Ember highlight border. Text: Geist 16px weight 500, `#f5f7fa`. Padding: 10px 20px. Includes a trailing arrow (`→`) icon.

### Pill Ghost Button (`CV` / `GitHub`)
**Role:** Secondary action, external links  
9999px border-radius. Transparent or `#0a0d14` background with 1px `#eaecf0` border at low opacity. Text: Geist 14–16px weight 400, `#a0a5b5` or `#f5f7fa`. Padding: 8px 20px.

### Sysbar (Top Status Bar)
**Role:** Persistent site header & live telemetry  
Full-width sticky glass bar at `#080a10` background (`backdrop-filter: blur(12px)`). Left: `aleksbuss v3.0` with green pulsing dot. Center: live runtime telemetry (`cpu: 0.40ms · tz: CET · status: ONLINE · 8 systems`). Right: micro-action switches (`[Theme: T]`, `[Lang: L]`, `[Contact: C]`, `[Hire →: H]`). Padding: 12px 24px. Height ~52px.

### Hero Section & Live Waveform
**Role:** Above-the-fold brand statement & interactive proof  
Full-width `#05060a` canvas with subtle aurora glow. Left: Monospace timestamp header `Agent [00:00.812] · session opened`, 64–80px headline `Aleksejs Buss`, subline `Agentic AI Engineer · Multi-Agent Orchestration`. Right (45%): 16px-radius dark card with crosshair corners displaying real-time Three.js audio/agent stream canvas and live packet transcript.

### Cards & Surfaces
- **Obsidian Project Card (`.card-project`):**  
  12px border-radius. Background: `#0a0d14`. Border: 1px `#eaecf0` at 8% opacity. Padding: 24px. Contains live status dot (`● LIVE`), architecture category tag (`Mixture-of-Agents`), headline (Geist 24–28px, `#f5f7fa`), metric highlights (4,100+ tests, 70+ post-mortems), and stack pills (`TypeScript`, `Next.js 15`, `Workers`, `Whisper`).
- **Telemetry Counter Tile (`.card-metric`):**  
  4-column responsive grid of `#0a0d14` tiles. Top index `i.`, 48px numerical counter in bold Geist `#f5f7fa` (e.g. `5`, `5,400+`, `10mo`, `4`), 14px label in `#a0a5b5`, and detail note in `#5c6275`.

### Floating AI Agent Dock ("Ask the Agent")
**Role:** Interactive live portfolio agent entry point  
Fixed bottom-center pill shape (`9999px` radius) with `#eaecf0` border. Green status dot + `Ask Aleksejs' Agent` label + `⌘K` keyboard badge. Opens streaming Cloudflare Worker agent drawer.

---

## Do's and Don'ts

### Do
- Use Void Black (`#05060a`) as the base canvas for all pages; let cards lift through `#0a0d14` obsidian surfaces.
- Apply Geist weight 300 for all display headlines; reserve weight 500/600 for interactive elements.
- Set border-radius strictly to **4px (badges), 12px (cards), 16px (viz frames), and 9999px (pills)**.
- Use the embossed button shadow stack on primary actions to maintain the pressed-glass tactile feel.
- Keep body and description copy in `#a0a5b5` Fog Gray; reserve pure `#f5f7fa` Bone White for headlines and primary metrics.
- Highlight live states using **Signal Green (`#00ff88`)** and primary conversion actions using **Ember (`#d24a0e`)**.

### Don't
- Do not make primary CTA buttons pure flat grey without visual highlight — conversion requires clear affordance.
- Do not use drop-shadow elevation on cards; define surface layers through background luminance shifts and 1px hairline borders.
- Do not break the negative letter-spacing pattern on headings — tracking gives the compressed authority.
- Do not use decorative gradients on interactive UI chrome — gradients belong only in the ambient hero canvas and waveforms.
- Do not default to generic 8px border radii.

---

## Surfaces & Elevation

| Level | Name | Value | Purpose |
|:-----:|------|-------|---------|
| **1** | Void | `#05060a` | Base page canvas — the absolute background |
| **2** | Obsidian | `#0a0d14` | Card surfaces, metric tiles, timeline rows |
| **3** | Charcoal | `#12151f` | Elevated buttons, active inputs, hover states |
| **4** | Onyx | `#080a10` | Sticky sysbar navigation, persistent dock |

---

## Imagery & Generative Canvas

The signature visual element is the **interactive agent audio-waveform**: smooth, ribbon-like WebGL curves rendered in real time via Three.js with signal-green and plasma-blue frequencies. Event conference imagery and cryptocurrency logos are omitted; all visual weight is carried by **live system telemetry, terminal transcripts, and code architecture diagrams**.

---

## Agent Prompt Guide (for Stitch / Design Generation)

**Quick Color Reference:**
- `text`: `#f5f7fa` (headings), `#a0a5b5` (body), `#5c6275` (muted/mono)
- `background`: `#05060a` (canvas), `#0a0d14` (cards), `#12151f` (buttons)
- `border`: `#eaecf0` at 8–15% opacity
- `accent`: `#d24a0e` (Ember CTA), `#00ff88` (Signal Green live telemetry)

### 5 Example Component Prompts

1. *Create a hero section.* Full-width `#05060a` canvas with subtle aurora glow. Left column: monospace timestamp header `Agent [00:00.812] · session opened`, 64px display headline `Aleksejs Buss` in weight 300, subtext at 18px `Agentic AI Engineer · Multi-Agent Orchestration`. Below: pill button — 9999px radius, `#12151f` background with `#d24a0e` border highlight, white text `View work →`. Right side: 16px-radius card with crosshair corners showing real-time audio waveform canvas and green live indicator.

2. *Create a project architecture card.* 12px border-radius, `#0a0d14` background, 1px `#eaecf0` border at 8% opacity, 24px padding. Top: green dot `● LIVE SYSTEM` and pill badge `Mixture-of-Agents`. Headline at 28px Geist `#f5f7fa` `Orchestra`. Summary: multi-agent LLM orchestrator with 4,100+ tests. Bottom: stack pills (`TypeScript`, `Next.js 15`, `Workers`, `Whisper`).

3. *Create a sysbar navigation bar.* Full-width sticky, `#080a10` background with backdrop blur, 52px height, 24px padding. Left: `aleksbuss v3.0` with green pulse dot. Center: telemetry pills `cpu: 0.40ms · tz: CET · live: 5 systems`. Right: micro-switches `[Theme: T]`, `[Lang: L]`, `[Hire →: H]` in amber highlight.

4. *Create a metrics ledger grid.* 4-column responsive grid of `#0a0d14` tiles. Top index `i.`, 48px numerical counter in bold Geist `#f5f7fa` with unit suffix (`5,400+`), 14px label in `#a0a5b5`, and detail note `Vitest · Playwright · Pytest`. Subtle `#d24a0e` hairline border on hover.

5. *Create a floating AI agent dock.* Fixed bottom-center pill shape (`9999px` radius) with `#eaecf0` border at 12% opacity. Left: pulsing green dot. Center: `Ask Aleksejs' Agent` in 14px Geist `#f5f7fa`. Right: `⌘K` keyboard badge in 4px capsule.

---

## Quick Start Tokens

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-canvas: #05060a;
  --color-obsidian: #0a0d14;
  --color-charcoal: #12151f;
  --color-onyx: #080a10;
  --color-smoke: #020305;
  --color-graphite: #262a36;
  --color-ash-mute: #5c6275;
  --color-fog-gray: #a0a5b5;
  --color-bone-white: #f5f7fa;
  --color-signal-green: #00ff88;
  --color-plasma-blue: #2a5cd9;
  --color-ember-accent: #d24a0e;
  --color-hairline: rgba(234, 236, 240, 0.09);

  /* Typography */
  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Geist Mono', monospace;
  --font-editorial: 'Fraunces', Georgia, serif;

  /* Typography Scale */
  --text-caption-mono: 11px;
  --text-caption: 12px;
  --text-body-sm: 14px;
  --text-body: 16px;
  --text-body-lg: 18px;
  --text-subheading: 21px;
  --text-heading-sm: 24px;
  --text-heading-md: 36px;
  --text-heading-lg: 56px;
  --text-display: 80px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radii */
  --radius-xs: 4px;
  --radius-cards: 12px;
  --radius-frame: 16px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-card: 0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(234, 236, 240, 0.08) inset;
  --shadow-btn: 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.15) inset, 0 -1px 0 rgba(0, 0, 0, 0.4) inset;
}
```

### Tailwind v4 `@theme`

```css
@theme {
  --color-void-canvas: #05060a;
  --color-obsidian: #0a0d14;
  --color-charcoal: #12151f;
  --color-onyx: #080a10;
  --color-smoke: #020305;
  --color-graphite: #262a36;
  --color-ash-mute: #5c6275;
  --color-fog-gray: #a0a5b5;
  --color-bone-white: #f5f7fa;
  --color-signal-green: #00ff88;
  --color-plasma-blue: #2a5cd9;
  --color-ember-accent: #d24a0e;
  --color-hairline: rgba(234, 236, 240, 0.09);

  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Geist Mono', monospace;
  --font-editorial: 'Fraunces', Georgia, serif;

  --radius-xs: 4px;
  --radius-cards: 12px;
  --radius-frame: 16px;
  --radius-pill: 9999px;
}
```
