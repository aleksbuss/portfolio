/** Minimal EN/DE i18n. Selectors mapped to translations. */
import { $, $$ } from './utils';

export type Lang = 'en' | 'de';

const KEY = 'lang';

/**
 * Each entry: [selector, en HTML, de HTML].
 * Original HTML (the one in the markup) is the EN string, so toggling back is just
 * "set DE" / "set EN" — no caching needed.
 */
const DICT: Array<[string, string, string]> = [
  // sysbar status field
  ['#sysbarStatusLbl', 'status', 'status'],

  // sysbtns
  ['#themeBtn .lbl', 'Light', 'Hell'], // initial label (when in dark mode)
  ['#langBtn .lbl', 'DE', 'EN'],       // shows the OPPOSITE language as click target
  ['.sysbtn[data-key="contact"] .lbl', 'Contact', 'Kontakt'],
  ['.sysbtn[data-key="hire"] .lbl', 'Hire →', 'Anstellen →'],

  // hero
  ['.hero-marker .left', '№ 2026 / FOLIO', 'NR. 2026 / FOLIO'],
  ['.hero-marker .right', 'Available now', 'Sofort verfügbar'],
  ['.agent-handshake span:last-child', 'handshake authenticated · session opened · greeting human',
                                       'Handshake authentifiziert · Sitzung offen · begrüße Mensch'],
  ['.hero-tagline', 'AI engineer · multi-agent systems.<br>\n      <em>Production systems</em>, shipped solo.',
                    'KI-Ingenieur · Multi-Agenten-Systeme.<br>\n      <em>Produktionssysteme</em>, solo geliefert.'],

  // hero foot — meta-col has two .lbl/.val pairs separated by <br><br>;
  // use :nth-of-type on span to dodge the line-break siblings.
  ['.hero-foot .meta-col:nth-child(1) span:nth-of-type(1)', 'Based', 'Standort'],
  ['.hero-foot .meta-col:nth-child(1) span:nth-of-type(3)', 'Status', 'Status'],
  ['.hero-foot .meta-col:nth-child(1) span:nth-of-type(4)', 'EU citizen · remote-first', 'EU-Bürger · remote-first'],
  ['.hero-foot .meta-col:nth-child(2) .lbl', 'Credentials', 'Qualifikation'],
  ['.hero-foot .meta-col:nth-child(3) .lbl', 'Stack', 'Stack'],
  ['.hero-foot .hero-actions .btn-primary', 'View work <span class="arrow">→</span>',
                                            'Projekte <span class="arrow">→</span>'],
  ['.hero-foot .hero-actions .btn-ghost', 'CV', 'Lebenslauf'],

  // section heads
  // ── METRICS (§ I) ───────────────────────────────────────────
  ['#index .eyebrow', '§ I — At a glance', '§ I — Auf einen Blick'],
  ['#index .section-title', 'A short ledger of <em>what shipped</em>.', 'Eine kurze Bilanz <em>der Lieferungen</em>.'],
  ['#index .section-sub', 'Every figure points to live infrastructure — servers I own, deployed under my own name, serving real users today.',
                          'Jede Zahl steht für Live-Infrastruktur — Server in meinem Besitz, unter meinem Namen, mit echten Nutzern.'],
  ['#index .metric:nth-child(1) .lbl', 'Production systems', 'Produktionssysteme'],
  ['#index .metric:nth-child(1) .det', 'All serving real users', 'Alle dienen echten Nutzern'],
  ['#index .metric:nth-child(2) .lbl', 'Tests in the flagship', 'Tests im Flaggschiff'],
  ['#index .metric:nth-child(2) .det', 'Orchestra · Vitest + Playwright', 'Orchestra · Vitest + Playwright'],
  ['#index .metric:nth-child(3) .lbl', 'Zero to eight live', 'Von null auf acht live'],
  ['#index .metric:nth-child(3) .det', 'Solo delivery, since 07/2025', 'Solo geliefert, seit 07/2025'],
  ['#index .metric:nth-child(4) .lbl', 'Languages spoken', 'Gesprochene Sprachen'],

  // ── STORY (§ II) ────────────────────────────────────────────
  ['#story .eyebrow', '§ II — The route', '§ II — Der Weg'],
  ['#story .section-title', 'Fourteen years moving freight.<br>Now I move <em>features into production</em>.',
                            'Vierzehn Jahre Frachttransport.<br>Heute liefere ich <em>Features in Produktion</em>.'],
  ['#story .story-left .lede', "I didn't take the conventional route. I took the <em>self-disciplined</em> one.",
                                'Ich nahm nicht den konventionellen Weg. Ich nahm den <em>disziplinierten</em>.'],
  // Bio paragraphs the user explicitly flagged as untranslated.
  ['#story .story-left p:nth-of-type(2)',
    'Fourteen years in multicultural logistics — Tesco Carlisle, long-haul freight across the UK and Europe — taught me systems, processes, and how to <strong>deliver under pressure</strong>.',
    'Vierzehn Jahre in multikultureller Logistik — Tesco Carlisle, Fernverkehr durch Großbritannien und Europa — haben mich Systeme, Prozesse und das <strong>Liefern unter Druck</strong> gelehrt.'],
  ['#story .story-left p:nth-of-type(3)',
    'In 2022 I retrained as a Frontend Developer at <strong>Tel-Ran Berlin</strong> (960h, DEKRA-certified). Then I went deeper: LLMs, prompt engineering, serverless, local AI. Nights and weekends, while driving part-time to pay the bills.',
    '2022 habe ich mich zum Frontend-Entwickler an der <strong>Tel-Ran Berlin</strong> umgeschult (960h, DEKRA-zertifiziert). Danach ging es tiefer: LLMs, Prompt Engineering, Serverless, lokale KI. Abends und am Wochenende, während ich nebenbei LKW gefahren bin, um die Rechnungen zu zahlen.'],
  ['#story .story-left p:nth-of-type(4)',
    "From mid-2025, <strong>I've been shipping</strong>. Not learning. Real systems, real users, real infrastructure — under my own name.",
    'Seit Mitte 2025 <strong>liefere ich</strong>. Nicht mehr lerne. Echte Systeme, echte Nutzer, echte Infrastruktur — unter meinem eigenen Namen.'],
  ['.story-pull', 'Self-discipline is the skill that transfers. Everything else I learn fast — and I have.',
                  'Selbstdisziplin ist die Fähigkeit, die übertragbar ist. Alles andere lerne ich schnell — und habe es bewiesen.'],
  // Timeline (5 rows)
  ['#story .tl-row:nth-child(1) .ttl', 'Logistics, UK &amp; Germany', 'Logistik, UK &amp; Deutschland'],
  ['#story .tl-row:nth-child(1) .desc',
    'Tesco Carlisle (WMS, planograms), long-haul freight. Process, resilience, multicultural teams.',
    'Tesco Carlisle (WMS, Planogramme), Fernverkehr. Prozess, Resilienz, multikulturelle Teams.'],
  ['#story .tl-row:nth-child(2) .ttl', 'Frontend Developer · Tel-Ran Berlin', 'Frontend-Entwickler · Tel-Ran Berlin'],
  ['#story .tl-row:nth-child(2) .desc',
    'DEKRA-certified, 960h. JS Advanced, React, DSA, DevOps, QA, UI/UX.',
    'DEKRA-zertifiziert, 960h. JS Advanced, React, DSA, DevOps, QA, UI/UX.'],
  ['#story .tl-row:nth-child(3) .ttl', 'Deep self-study in AI &amp; automation', 'Tiefes Selbststudium in KI &amp; Automatisierung'],
  ['#story .tl-row:nth-child(3) .desc',
    'n8n, Cloudflare Workers, Ollama, prompt engineering, local LLM, Docker.',
    'n8n, Cloudflare Workers, Ollama, Prompt Engineering, lokale LLMs, Docker.'],
  ['#story .tl-row:nth-child(4) .ttl', 'Production mode · 8 live systems', 'Produktionsmodus · 8 Live-Systeme'],
  ['#story .tl-row:nth-child(4) .desc',
    'End-to-end: architecture → deployment → monitoring. Solo delivery, real users.',
    'End-to-End: Architektur → Deployment → Monitoring. Solo geliefert, echte Nutzer.'],
  ['#story .tl-row:nth-child(5) .ttl', 'Open to your team', 'Offen für Ihr Team'],
  ['#story .tl-row:nth-child(5) .desc',
    'Immediate availability. Germany-based, EU citizen. Remote or on-site.',
    'Sofort verfügbar. Standort Deutschland, EU-Bürger. Remote oder vor Ort.'],

  // ── VALUES (§ III) ──────────────────────────────────────────
  ['#values .eyebrow', '§ III — Approach', '§ III — Arbeitsweise'],
  ['#values .section-title', 'What an early-stage team needs<br>— in <em>one hire</em>.',
                             'Was ein junges Team braucht<br>— in <em>einer Einstellung</em>.'],
  ['#values .section-sub',
    "Startups don't need specialists. They need operators who ship features end-to-end without waiting for permission. Six things I bring on day one.",
    'Startups brauchen keine Spezialisten. Sie brauchen Operatoren, die Features end-to-end liefern, ohne auf Erlaubnis zu warten. Sechs Dinge, die ich vom ersten Tag an mitbringe.'],
  ['#values .value:nth-child(1) .vix', 'i. Ship rate', 'i. Liefer-Tempo'],
  ['#values .value:nth-child(1) h3', 'Founder-grade <em>ownership</em>.', 'Gründer-niveau <em>Verantwortung</em>.'],
  ['#values .value:nth-child(1) p',
    'Spec → architecture → code → deploy → monitor → iterate. No hand-offs, no "not my job". Eight live systems in ten months — solo. The cadence your runway needs.',
    'Spec → Architektur → Code → Deploy → Monitor → Iteration. Keine Übergaben, kein „nicht mein Bier". Acht Live-Systeme in zehn Monaten — solo. Die Kadenz, die Ihre Runway braucht.'],
  ['#values .value:nth-child(2) .vix', 'ii. Full stack', 'ii. Voller Stack'],
  ['#values .value:nth-child(2) h3', 'AI, backend &amp; <em>infra</em> in one.', 'KI, Backend &amp; <em>Infra</em> in einem.'],
  ['#values .value:nth-child(2) p',
    'TypeScript/Next.js, LLM pipelines, multi-agent orchestration, FastAPI/Python, Cloudflare edge, Docker/systemd. One headcount, full stack — your seed runway stretches further.',
    'TypeScript/Next.js, LLM-Pipelines, Multi-Agenten-Orchestrierung, FastAPI/Python, Cloudflare Edge, Docker/systemd. Eine Person, voller Stack — Ihre Seed-Runway reicht weiter.'],
  ['#values .value:nth-child(3) .vix', 'iii. AI-native', 'iii. KI-nativ'],
  ['#values .value:nth-child(3) h3', 'LLM is native, <em>not a bolt-on</em>.', 'LLM ist nativ, <em>kein Add-on</em>.'],
  ['#values .value:nth-child(3) p',
    'I build agent systems, not wrappers: Mixture-of-Agents pipelines, disagreement detection, reflection loops. Multi-provider failover (OpenAI / Gemini / Groq / Ollama), structured outputs, voice pipelines. Designed with latency, cost &amp; failure modes in mind.',
    'Ich baue Agentensysteme, keine Wrapper: Mixture-of-Agents-Pipelines, Disagreement Detection, Reflexionsschleifen. Multi-Provider-Failover (OpenAI / Gemini / Groq / Ollama), strukturierte Outputs, Voice-Pipelines. Entworfen mit Latenz, Kosten &amp; Fehlermodi im Blick.'],
  ['#values .value:nth-child(4) .vix', 'iv. Production hygiene', 'iv. Produktions-Hygiene'],
  ['#values .value:nth-child(4) h3', 'Defaults, <em>not afterthoughts</em>.', 'Standards, <em>kein Nachgedanke</em>.'],
  ['#values .value:nth-child(4) p',
    'HMAC-SHA256, zero-secrets architecture, rate limiting, systemd auto-restart, health checks, webhook verification, secrets via env. Built in from day one.',
    'HMAC-SHA256, Zero-Secrets-Architektur, Rate Limiting, systemd Auto-Restart, Health Checks, Webhook-Verifizierung, Secrets via Env. Vom ersten Tag an eingebaut.'],
  ['#values .value:nth-child(5) .vix', 'v. Late-career grit', 'v. Späte-Karriere-Biss'],
  ['#values .value:nth-child(5) h3', 'Self-driven, <em>under pressure</em>.', 'Eigenmotiviert, <em>unter Druck</em>.'],
  ['#values .value:nth-child(5) p',
    "Career-switched at 35+ and shipped eight live systems in ten months while working part-time. Not talent — discipline. I don't need reminders to unblock myself.",
    'Mit 35+ den Beruf gewechselt und acht Live-Systeme in zehn Monaten geliefert, während ich nebenbei gearbeitet habe. Kein Talent — Disziplin. Ich brauche keine Erinnerungen, um mich selbst zu entblockieren.'],
  ['#values .value:nth-child(6) .vix', 'vi. Full product', 'vi. Gesamtes Produkt'],
  ['#values .value:nth-child(6) h3', 'Beyond the <em>backend</em>.', 'Über das <em>Backend</em> hinaus.'],
  ['#values .value:nth-child(6) p',
    'I can design, implement, and launch an AI product end to end — voice, visual generation (ComfyUI, Stable Diffusion), UI, copy, deployment. Useful when your team is three people and a deadline.',
    'Ich kann ein KI-Produkt von Anfang bis Ende entwerfen, umsetzen und launchen — Voice, Bildgenerierung (ComfyUI, Stable Diffusion), UI, Texte, Deployment. Nützlich, wenn Ihr Team aus drei Leuten und einer Deadline besteht.'],

  // ── PROJECTS (§ IV) ─────────────────────────────────────────
  ['#projects .eyebrow', '§ IV — Work · Selected', '§ IV — Projekte · Auswahl'],
  ['#projects .section-title', 'Eight systems.<br>Shipped <em>solo</em>. All live.',
                               'Acht Systeme.<br><em>Solo</em> geliefert. Alle live.'],
  ['#projects .section-sub',
    'Every project below runs on infrastructure I own and operate. This is what "ships fast" looks like in practice — not side projects, real production.',
    'Jedes Projekt unten läuft auf Infrastruktur, die ich besitze und betreibe. So sieht „schnelles Liefern" in der Praxis aus — keine Nebenprojekte, echte Produktion.'],

  
  // Project 01 — Orchestra
  ['.proj:nth-child(1) .proj-meta .date:nth-child(3)', 'Flagship', 'Flaggschiff'],
  ['.proj:nth-child(1) .tagline', 'Mixture-of-Agents pipeline · code-guaranteed Skeptic · live cost telemetry.',
                                  'Mixture-of-Agents-Pipeline · code-garantierter Skeptiker · Live-Kosten-Telemetrie.'],
  ['.proj:nth-child(1) .desc',
    'Self-hosted AI workspace that runs 3–5 specialised expert agents in parallel on every substantive turn. Embedding-based disagreement detection surfaces expert conflict instead of smoothing it away; a reflection critic revises the final answer. 2,602 tests, 74 documented post-mortems, CI — engineering-led, MIT-licensed.',
    'Selbst gehosteter KI-Workspace, der bei jedem substanziellen Turn 3–5 spezialisierte Experten-Agenten parallel ausführt. Embedding-basierte Disagreement Detection macht Expertenkonflikte sichtbar, statt sie zu glätten; ein Reflexions-Kritiker überarbeitet die finale Antwort. 2.602 Tests, 74 dokumentierte Post-Mortems, CI — engineering-geführt, MIT-lizenziert.'],
  ['.proj:nth-child(1) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(1) .proj-stat:nth-child(1) .l', 'tests', 'Tests'],
  ['.proj:nth-child(1) .proj-stat:nth-child(2) .l', 'post-mortems', 'Post-Mortems'],
  ['.proj:nth-child(1) .proj-stat:nth-child(3) .l', 'parallel agents', 'parallele Agenten'],
  ['.proj:nth-child(1) .proj-stat:nth-child(4) .l', 'open source', 'Open Source'],

  // Project 02 — AI Dictaphone
  ['.proj:nth-child(2) .proj-meta .date:nth-child(3)', 'Flagship', 'Flaggschiff'],
  ['.proj:nth-child(2) .tagline', 'Edge voice pipeline · Whisper → LLM · sub-second latency.',
                                  'Edge-Voice-Pipeline · Whisper → LLM · Sub-Sekunden-Latenz.'],
  ['.proj:nth-child(2) .desc',
    'Serverless voice-to-insight pipeline on Cloudflare edge. User voice note → Whisper transcription → LLM summarization → rich Mini-App UI. Zero cold-start, global edge latency, zero secrets leaked to client.',
    'Serverlose Voice-to-Insight-Pipeline auf Cloudflare Edge. Sprachnachricht → Whisper-Transkription → LLM-Zusammenfassung → Mini-App-UI. Null Cold-Start, globale Edge-Latenz, keine Secrets im Client.'],
  ['.proj:nth-child(2) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(2) .proj-stat:nth-child(1) .l', 'in production', 'in Produktion'],
  ['.proj:nth-child(2) .proj-stat:nth-child(2) .l', 'cold start', 'Cold-Start'],
  ['.proj:nth-child(2) .proj-stat:nth-child(3) .l', 'webhook auth', 'Webhook-Auth'],
  ['.proj:nth-child(2) .proj-stat:nth-child(4) .l', 'global', 'global'],

  // Project 03 — AI Moderation Bot
  ['.proj:nth-child(3) .tagline', 'n8n workflow · dual-AI failover · auto-escalation.',
                                  'n8n-Workflow · Dual-KI-Failover · Auto-Eskalation.'],
  ['.proj:nth-child(3) .desc',
    'Production AI agent workflow for Telegram moderation. 15+ node n8n pipeline classifies every message with structured JSON outputs, routes to action, escalates sanctions. Dual-provider failover keeps it running when any LLM API fails.',
    'KI-Agent-Workflow für Telegram-Moderation in Produktion. Eine n8n-Pipeline mit 15+ Knoten klassifiziert jede Nachricht mit strukturierten JSON-Outputs, leitet weiter und eskaliert Sanktionen. Dual-Provider-Failover hält den Betrieb aufrecht, wenn eine LLM-API ausfällt.'],
  ['.proj:nth-child(3) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(3) .proj-stat:nth-child(1) .l', 'n8n nodes', 'n8n-Knoten'],
  ['.proj:nth-child(3) .proj-stat:nth-child(2) .l', 'AI providers', 'KI-Anbieter'],
  ['.proj:nth-child(3) .proj-stat:nth-child(3) .l', 'sanctions', 'Sanktionen'],
  ['.proj:nth-child(3) .proj-stat:nth-child(4) .l', 'structured', 'strukturiert'],

  // Project 04 — AI Psychology Bot
  ['.proj:nth-child(4) .proj-meta .date:nth-child(3)', 'SaaS product', 'SaaS-Produkt'],
  ['.proj:nth-child(4) .tagline', 'Full SaaS · payments · crisis support · CBT exercises.',
                                  'Komplettes SaaS · Zahlungen · Krisenhilfe · CBT-Übungen.'],
  ['.proj:nth-child(4) .desc',
    'End-to-end SaaS built solo: distributed serverless backend + auth + payments + referral program + AI failover. Real users, real revenue, real infrastructure — no team, no funding.',
    'End-to-End-SaaS solo gebaut: verteiltes Serverless-Backend + Auth + Zahlungen + Referral-Programm + KI-Failover. Echte Nutzer, echte Umsätze, echte Infrastruktur — kein Team, keine Finanzierung.'],
  ['.proj:nth-child(4) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(4) .proj-stat:nth-child(1) .l', 'protocol', 'Protokoll'],
  ['.proj:nth-child(4) .proj-stat:nth-child(2) .l', 'payments', 'Zahlungen'],
  ['.proj:nth-child(4) .proj-stat:nth-child(3) .l', 'credit ops', 'Kredit-Ops'],
  ['.proj:nth-child(4) .proj-stat:nth-child(4) .l', 'revenue', 'Umsatz'],

  // Project 05 — Bushmark
  ['.proj:nth-child(5) .tagline', 'Self-hosted · cookie auth · one-click install.',
                                  'Selbst gehostet · Cookie-Auth · 1-Klick-Installation.'],
  ['.proj:nth-child(5) .desc',
    'Self-hosted secure clipboard solving a real daily problem: transferring text between servers and devices without USB or third-party services. Three persistent slots, 24h history, auto-rotation, Tailwind UI.',
    'Selbst gehostete sichere Zwischenablage, die ein echtes Alltagsproblem löst: Text zwischen Servern und Geräten übertragen — ohne USB oder Drittanbieter. Drei persistente Slots, 24h-Verlauf, Auto-Rotation, Tailwind-UI.'],
  ['.proj:nth-child(5) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(5) .proj-stat:nth-child(1) .l', 'bash install', 'Bash-Install'],
  ['.proj:nth-child(5) .proj-stat:nth-child(2) .l', 'Ubuntu VPS', 'Ubuntu-VPS'],
  ['.proj:nth-child(5) .proj-stat:nth-child(3) .l', 'history', 'Verlauf'],
  ['.proj:nth-child(5) .proj-stat:nth-child(4) .l', 'slots', 'Slots'],

  // Project 06 — CyberDed Ultra
  ['.proj:nth-child(6) .proj-meta .date:nth-child(3)', 'Self-hosted', 'Selbst gehostet'],
  ['.proj:nth-child(6) .tagline', 'Local AI infra · one-click installer · Android + Linux.',
                                  'Lokale KI-Infra · 1-Klick-Installer · Android + Linux.'],
  ['.proj:nth-child(6) .desc',
    'One-click installer for local AI infrastructure. Flask backend with Server-Sent Events streaming chat, real-time system monitoring, Docker-Compose ComfyUI stack with NVIDIA auto-config. Full bash automation.',
    'Ein-Klick-Installer für lokale KI-Infrastruktur. Flask-Backend mit Server-Sent-Events-Streaming-Chat, Echtzeit-System-Monitoring, Docker-Compose-ComfyUI-Stack mit NVIDIA-Autokonfiguration. Vollständige Bash-Automatisierung.'],
  ['.proj:nth-child(6) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(6) .proj-stat:nth-child(1) .l', 'streaming', 'Streaming'],
  ['.proj:nth-child(6) .proj-stat:nth-child(2) .l', 'auto-detect', 'Auto-Erkennung'],
  ['.proj:nth-child(6) .proj-stat:nth-child(3) .l', 'self-hosted', 'selbst gehostet'],
  ['.proj:nth-child(6) .proj-stat:nth-child(4) .l', 'Linux + Android', 'Linux + Android'],

  // Project 07 — Termux AI Dictaphone
  ['.proj:nth-child(7) .proj-meta .date:nth-child(3)', 'Open Source', 'Open Source'],
  ['.proj:nth-child(7) .tagline', 'Android as offline AI server · zero cloud cost.',
                                  'Android als Offline-KI-Server · null Cloud-Kosten.'],
  ['.proj:nth-child(7) .desc',
    'Local AI deployment product: complete offline AI stack on any Android phone — Whisper transcription + LLaMA/Gemma inference running on-device. Zero cloud cost, full privacy. Published OSS.',
    'Lokales KI-Deployment-Produkt: kompletter Offline-KI-Stack auf jedem Android-Telefon — Whisper-Transkription + LLaMA/Gemma-Inferenz on-device. Null Cloud-Kosten, volle Privatsphäre. Als OSS veröffentlicht.'],
  ['.proj:nth-child(7) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(7) .proj-stat:nth-child(1) .l', 'offline', 'offline'],
  ['.proj:nth-child(7) .proj-stat:nth-child(2) .l', 'API cost', 'API-Kosten'],
  ['.proj:nth-child(7) .proj-stat:nth-child(3) .l', 'mode', 'Modus'],
  ['.proj:nth-child(7) .proj-stat:nth-child(4) .l', 'privacy', 'Privatsphäre'],

  // "Explore all repos" CTA at bottom of projects
  ['#projects > .reveal:last-child .btn-ghost', 'Explore all repositories on GitHub <span class="arrow">→</span>',
                                                'Alle Repositories auf GitHub erkunden <span class="arrow">→</span>'],

  // ── STACK (§ V) ─────────────────────────────────────────────
  ['#stack .eyebrow', '§ V — Toolkit', '§ V — Werkzeuge'],
  ['#stack .section-title', 'Full-stack AI engineering,<br>top to <em>bottom</em>.',
                            'Full-Stack KI-Engineering,<br>von oben bis <em>unten</em>.'],
  ['#stack .section-sub',
    "From edge serverless to local LLM on Android — every tool here I've used in production.",
    'Von Edge-Serverless bis lokales LLM auf Android — jedes Werkzeug hier habe ich in Produktion eingesetzt.'],
  ['#stack .stack-row:nth-child(1) .ttl', '<em>AI</em> · LLM · Agents', '<em>KI</em> · LLM · Agenten'],
  ['#stack .stack-row:nth-child(2) .ttl', '<em>Automation</em> &amp; No-code', '<em>Automatisierung</em> &amp; No-Code'],
  ['#stack .stack-row:nth-child(3) .ttl', '<em>Programming</em>', '<em>Programmierung</em>'],
  ['#stack .stack-row:nth-child(4) .ttl', '<em>Cloud</em> &amp; Serverless', '<em>Cloud</em> &amp; Serverless'],
  ['#stack .stack-row:nth-child(5) .ttl', '<em>Production</em> &amp; Ops', '<em>Produktion</em> &amp; Ops'],
  ['#stack .stack-row:nth-child(6) .ttl', '<em>Security</em> &amp; Payments', '<em>Sicherheit</em> &amp; Zahlungen'],
  // Languages
  ['.langs .lang:nth-child(1) .name', 'Russian', 'Russisch'],
  ['.langs .lang:nth-child(1) .lvl',  'Native', 'Muttersprache'],
  ['.langs .lang:nth-child(2) .name', 'Latvian', 'Lettisch'],
  ['.langs .lang:nth-child(2) .lvl',  'C2 · Fluent', 'C2 · fließend'],
  ['.langs .lang:nth-child(3) .name', 'English', 'Englisch'],
  ['.langs .lang:nth-child(3) .lvl',  'C1 · Business', 'C1 · Business'],
  ['.langs .lang:nth-child(4) .name', 'German', 'Deutsch'],
  ['.langs .lang:nth-child(4) .lvl',  'B1', 'B1'],

  // ── CONTACT (§ VI) ──────────────────────────────────────────
  ['.contact-eye', '§ VI — Now hiring myself out', '§ VI — Verfügbar zur Einstellung'],
  ['.contact-h', "Let's turn your backlog<br>into <em>shipped software</em>.",
                 'Verwandeln wir Ihr Backlog<br>in <em>ausgelieferte Software</em>.'],
  ['.contact-lede',
    "I'm looking for AI Engineer or Founding Engineer roles at early-stage startups (Seed–Series C). I build multi-agent systems, write production code, own features end-to-end, and ship fast. EU citizen, based in Germany, available immediately.",
    'Ich suche eine Stelle als KI-Ingenieur oder Founding Engineer bei Early-Stage-Startups (Seed–Series C). Ich baue Multi-Agenten-Systeme, schreibe Produktionscode, übernehme Features end-to-end und liefere schnell. EU-Bürger, in Deutschland, sofort verfügbar.'],
  ['.contact-actions .btn-primary', 'Request an interview <span class="arrow">→</span>',
                                    'Interview anfragen <span class="arrow">→</span>'],
  ['.contact-actions .btn-ghost:nth-of-type(2)', 'See the code', 'Code ansehen'],
  ['.contact-actions .btn-ghost:nth-of-type(3)', 'Download CV', 'Lebenslauf herunterladen'],
  ['.contact-cell:nth-child(1) .lbl', 'Email', 'E-Mail'],
  ['.contact-cell:nth-child(2) .lbl', 'GitHub', 'GitHub'],
  ['.contact-cell:nth-child(3) .lbl', 'Location', 'Standort'],

  // ── FOOTER ──────────────────────────────────────────────────
  ['footer div:nth-child(1)', '<span class="live">●</span> &nbsp;aleksejs-portfolio.pages.dev — all systems operational',
                              '<span class="live">●</span> &nbsp;aleksejs-portfolio.pages.dev — alle Systeme betriebsbereit'],
  ['footer div:nth-child(2)', '© Aleksejs Buss · 2026 · Set in Fraunces, Geist &amp; JetBrains Mono<br><span style="font-size:0.8em;color:var(--ink-3);display:inline-block;margin-top:1rem;"><a href="Impressum.html" style="color:inherit;text-decoration:none">Impressum</a> | <a href="Datenschutz.html" style="color:inherit;text-decoration:none">Datenschutz</a></span>',
                              '© Aleksejs Buss · 2026 · Gesetzt in Fraunces, Geist &amp; JetBrains Mono<br><span style="font-size:0.8em;color:var(--ink-3);display:inline-block;margin-top:1rem;"><a href="Impressum.html" style="color:inherit;text-decoration:none">Impressum</a> | <a href="Datenschutz.html" style="color:inherit;text-decoration:none">Datenschutz</a></span>'],

  // ── CMD-DOCK ────────────────────────────────────────────────
  ['.cmd-dock .placeholder span:first-child', 'Ask the agent —', 'Frag den Agenten —'],
  ['.cmd-dock .placeholder em', 'show me your stack', 'zeig mir deinen Stack'],
  ['.cmd-suggestions .cmd-sug:nth-child(1)', 'Show projects', 'Projekte zeigen'],
  ['.cmd-suggestions .cmd-sug:nth-child(2)', "What's your stack?", 'Was ist dein Stack?'],
  ['.cmd-suggestions .cmd-sug:nth-child(3)', 'Why hire you?', 'Warum dich einstellen?'],
  ['.cmd-suggestions .cmd-sug:nth-child(4)', 'Hiring process?', 'Einstellungsprozess?'],
];

export function initI18n(): void {
  // Cache EN HTML on first run (resilient to refresh / theme toggles)
  cacheEn();
  const saved = (localStorage.getItem(KEY) as Lang | null) ?? 'en';
  apply(saved);

  const btn = $<HTMLButtonElement>('#langBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const next: Lang = (currentLang() === 'en') ? 'de' : 'en';
      apply(next);
      localStorage.setItem(KEY, next);
    });
  }
}

function currentLang(): Lang {
  return (document.documentElement.lang as Lang) || 'en';
}

function cacheEn(): void {
  for (const [sel, en] of DICT) {
    const el = $(sel);
    if (el && !el.dataset.enHtml) el.dataset.enHtml = en;
  }
}

function apply(lang: Lang): void {
  document.documentElement.lang = lang;
  for (const [sel, en, de] of DICT) {
    const el = $(sel);
    if (!el) continue;
    el.innerHTML = lang === 'en' ? en : de;
  }
  const btn = $('#langBtn');
  if (btn) {
    const lbl = btn.querySelector('.lbl');
    if (lbl) lbl.textContent = lang === 'en' ? 'DE' : 'EN';
  }
}
