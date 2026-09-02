/** Complete EN/DE i18n system. All visible copy synchronized. */
import { $, $$ } from './utils';
import { updateHeroHeadlineLang } from './hero';
import { refreshOpenModalLang } from './modals';

export type Lang = 'en' | 'de';

const KEY = 'lang';

/**
 * Each entry: [selector, en HTML, de HTML].
 */
const DICT: Array<[string, string, string]> = [
  // ── SYSBAR & NAVIGATION ──
  ['#sysbarStatusLbl', 'status', 'status'],
  ['#themeBtn .lbl', 'Light', 'Hell'],
  ['#langBtn .lbl', 'DE', 'EN'],
  ['.sysbtn[data-key="the-way"] .lbl', 'The Way', 'Der Weg'],
  ['.sysbtn[data-key="ledger"] .lbl', 'Ledger', 'Register'],
  ['.sysbtn[data-key="systems"] .lbl', 'Systems', 'Systeme'],
  ['.sysbtn[data-key="approach"] .lbl', 'Approach', 'Arbeitsweise'],
  ['.sysbtn[data-key="stack"] .lbl', 'Stack', 'Stack'],
  ['.sysbtn[data-key="contact"] .lbl', 'Contact', 'Kontakt'],
  ['.sysbar-cta .lbl', 'Request Interview →', 'Interview anfragen →'],
  ['.mobile-nav-item[data-key="the-way"] .lbl', 'The Way', 'Der Weg'],
  ['.mobile-nav-item[data-key="ledger"] .lbl', 'Ledger', 'Register'],
  ['.mobile-nav-item[data-key="systems"] .lbl', 'Systems', 'Systeme'],
  ['.mobile-nav-item[data-key="approach"] .lbl', 'Approach', 'Arbeitsweise'],
  ['.mobile-nav-item[data-key="stack"] .lbl', 'Stack', 'Stack'],
  ['.mobile-nav-item[data-key="contact"] .lbl', 'Contact', 'Kontakt'],
  ['.mobile-cta .lbl', 'Request Interview →', 'Interview anfragen →'],

  // ── HERO SECTION ──
  ['[data-i18n="hero.marker.left"]', '№ 2026 / FOLIO · AGENTIC AI ARCHITECTURE', 'NR. 2026 / FOLIO · AGENTIC AI ARCHITEKTUR'],
  ['[data-i18n="hero.marker.right"]', 'AVAILABLE FOR HIRE (SEED–SERIES C)', 'VERFÜGBAR ZUR EINSTELLUNG (SEED–SERIES C)'],
  ['[data-i18n="hero.tagline"]',
    'Agentic AI engineer · Creator of <em>Orchestra</em> (Mixture-of-Agents) and <em>4take</em> (Multi-Model AI Code Review Council). Five production AI systems designed &amp; operated solo · 5,400+ automated tests.',
    'Agentic AI Engineer · Entwickler von <em>Orchestra</em> (Mixture-of-Agents) und <em>4take</em> (Multi-Modell-KI-Code-Review-Rat). Fünf produktive KI-Systeme solo entworfen &amp; betrieben · 5.400+ automatisierte Tests.'],
  ['[data-i18n="hero.pill1"]', 'Orchestra MoA (4,100+ tests)', 'Orchestra MoA (4.100+ Tests)'],
  ['[data-i18n="hero.pill2"]', '4take FastMCP Council (Pytest)', '4take FastMCP Rat (Pytest)'],
  ['[data-i18n="hero.pill3"]', '5 Production Systems Live', '5 Produktionssysteme live'],
  ['[data-i18n="hero.pill4"]', 'Hof / Saale, Germany', 'Hof / Saale, Deutschland'],
  ['[data-i18n="hero.interview"]', 'Request an interview', 'Interview anfragen'],
  ['[data-i18n="hero.explore"]', 'Explore systems →', 'Systeme erkunden →'],
  ['[data-i18n="hero.cv"]', 'Download CV', 'Lebenslauf herunterladen'],
  ['[data-i18n="hero.foot.loc.lbl"]', 'Location', 'Standort'],
  ['[data-i18n="hero.foot.loc.val"]', 'Hof / Saale, Bavaria, Germany · EU Citizen · Remote', 'Hof / Saale, Bayern, Deutschland · EU-Bürger · Remote'],
  ['[data-i18n="hero.foot.cred.lbl"]', 'Credentials', 'Zertifizierung'],
  ['[data-i18n="hero.foot.cred.val"]', 'DEKRA №2023337 · Tel-Ran Berlin (960h)', 'DEKRA №2023337 · Tel-Ran Berlin (960 Std.)'],
  ['[data-i18n="hero.foot.stack.lbl"]', 'Core Stack', 'Kern-Stack'],
  ['[data-i18n="hero.foot.stack.val"]', 'TypeScript · Python 3.12 · FastMCP · MoA · Cloudflare Workers', 'TypeScript · Python 3.12 · FastMCP · MoA · Cloudflare Workers'],

  // ── TICKER ──
  ['.ticker-track span:first-child',
    '<span class="key">MIXTURE-OF-AGENTS</span> <span class="dot">●</span> FASTMCP COUNCIL PROTOCOL <span class="dot">●</span> <span class="key">TYPESCRIPT · PYTHON 3.12</span> <span class="dot">●</span> <span class="key">CLOUDFLARE WORKERS</span> <span class="dot">●</span> <span class="key">WHISPER · LLAMA 3.3 · GEMINI 2.5</span> <span class="dot">●</span> 5,400+ AUTOMATED TESTS <span class="dot">●</span> <span class="key">DOCKER · SYSTEMD</span> <span class="dot">●</span> HMAC-SHA256 <span class="dot">●</span> OLLAMA · LOCAL LLM <span class="dot">●</span> <span class="key">N8N AGENTS</span> <span class="dot">●</span> SUPABASE · FIREBASE <span class="dot">●</span>',
    '<span class="key">MIXTURE-OF-AGENTS</span> <span class="dot">●</span> FASTMCP-RAT-PROTOKOLL <span class="dot">●</span> <span class="key">TYPESCRIPT · PYTHON 3.12</span> <span class="dot">●</span> <span class="key">CLOUDFLARE WORKERS</span> <span class="dot">●</span> <span class="key">WHISPER · LLAMA 3.3 · GEMINI 2.5</span> <span class="dot">●</span> 5.400+ AUTOMATISIERTE TESTS <span class="dot">●</span> <span class="key">DOCKER · SYSTEMD</span> <span class="dot">●</span> HMAC-SHA256 <span class="dot">●</span> OLLAMA · LOKALE LLMS <span class="dot">●</span> <span class="key">N8N AGENTEN</span> <span class="dot">●</span> SUPABASE · FIREBASE <span class="dot">●</span>'],

  // ── SECTION § I: AT A GLANCE (#index) ──
  ['#index .eyebrow', '§ I — At a glance', '§ I — Auf einen Blick'],
  ['#index .section-title', 'A short ledger of <em>what shipped</em>.', 'Eine kurze Bilanz <em>gelieferter Systeme</em>.'],
  ['#index .section-sub',
    'Every figure points to live infrastructure — production-grade systems I engineered, built, and deployed end-to-end under my own name.',
    'Jede Zahl steht für Live-Infrastruktur — produktionsreife Systeme, die ich selbst entwickelt, gebaut und End-to-End unter eigenem Namen deployt habe.'],
  ['#index .metric:nth-child(1) .lbl', 'Production systems', 'Produktionssysteme'],
  ['#index .metric:nth-child(1) .det', 'All deployed &amp; live solo', 'Alle solo deployt &amp; live'],
  ['#index .metric:nth-child(2) .lbl', 'Automated tests', 'Automatisierte Tests'],
  ['#index .metric:nth-child(2) .det', 'Vitest · Playwright · Pytest', 'Vitest · Playwright · Pytest'],
  ['#index .metric:nth-child(3) .lbl', 'Zero to five live', 'Von null auf fünf live'],
  ['#index .metric:nth-child(3) .det', 'Solo delivery, since 07/2025', 'Solo geliefert, seit 07/2025'],
  ['#index .metric:nth-child(4) .lbl', 'Languages spoken', 'Gesprochene Sprachen'],
  ['#index .metric:nth-child(4) .det', 'RU · LV · EN · DE', 'RU · LV · EN · DE'],

  // ── SECTION § II: THE WAY (#story) ──
  ['#story .eyebrow', '§ II — The Way', '§ II — Der Weg'],
  ['#story .section-title', 'Fourteen years in logistics.<br>Now I build <em>AI systems for production</em>.',
                            'Vierzehn Jahre in der Logistik.<br>Jetzt entwickle ich <em>KI-Systeme für die Produktion</em>.'],
  ['[data-i18n="story.badge"]', 'ALEKSEJS BUSS · AGENTIC AI ENGINEER', 'ALEKSEJS BUSS · AGENTIC AI ENGINEER'],
  ['#story .story-left .lede', "I didn't take the conventional route. I took the <em>self-disciplined</em> one.",
                                'Ich nahm nicht den konventionellen Weg. Ich nahm den <em>disziplinierten</em>.'],
  ['#story .story-left p:nth-of-type(2)',
    'Fourteen years in multicultural logistics — Tesco Carlisle, long-haul freight across the UK and Europe — taught me systems, processes, and how to <strong>deliver under pressure</strong>.',
    'Vierzehn Jahre in multikultureller Logistik — Tesco Carlisle, Fernverkehr durch Großbritannien und Europa — haben mich Systeme, Prozesse und das <strong>Liefern unter Druck</strong> gelehrt.'],
  ['#story .story-left p:nth-of-type(3)',
    'In 2022 I retrained as a Frontend Developer at <strong>Tel-Ran Berlin</strong> (960h, DEKRA-certified). Then I went deeper: LLMs, prompt engineering, serverless, local AI. Nights and weekends, while driving part-time to pay the bills.',
    '2022 habe ich mich zum Frontend-Entwickler an der <strong>Tel-Ran Berlin</strong> umgeschult (960h, DEKRA-zertifiziert). Danach ging es tiefer: LLMs, Prompt Engineering, Serverless, lokale KI. Abends und am Wochenende, während ich nebenbei LKW gefahren bin, um die Rechnungen zu zahlen.'],
  ['#story .story-left p:nth-of-type(4)',
    "From mid-2025, <strong>I've been shipping</strong>. Not learning. Real systems, real infrastructure, built end-to-end — under my own name.",
    'Seit Mitte 2025 <strong>liefere ich</strong>. Nicht mehr lerne. Echte Systeme, echte Infrastruktur, End-to-End gebaut — unter meinem eigenen Namen.'],
  ['.story-pull',
    '“Self-discipline is the skill that transfers. Everything else I learn fast — and I have.”',
    '„Selbstdisziplin ist die Fähigkeit, die übertragbar ist. Alles andere lerne ich schnell — und habe es bewiesen.“'],
  // Timeline rows
  ['#story .tl-row:nth-child(1) .ttl', 'Logistics, UK &amp; Germany', 'Logistik, UK &amp; Deutschland'],
  ['#story .tl-row:nth-child(1) .desc',
    'Tesco Carlisle (WMS, planograms), long-haul freight. Process, resilience, multicultural teams.',
    'Tesco Carlisle (WMS, Planogramme), Fernverkehr. Prozess, Resilienz, multikulturelle Teams.'],
  ['#story .tl-row:nth-child(2) .ttl', 'Frontend Developer · Tel-Ran Berlin', 'Frontend-Entwickler · Tel-Ran Berlin'],
  ['#story .tl-row:nth-child(2) .desc',
    'DEKRA-certified, 960h. JS Advanced, React, DSA, DevOps, QA, UI/UX.',
    'DEKRA-zertifiziert, 960h. JS Advanced, React, DSA, DevOps, QA, UI/UX.'],
  ['#story .tl-row:nth-child(3) .ttl', 'AI system design &amp; engineering self-study', 'KI-Systemdesign &amp; Engineering-Selbststudium'],
  ['#story .tl-row:nth-child(3) .desc',
    'n8n, Cloudflare Workers, Ollama, prompt engineering, local LLM, Docker.',
    'n8n, Cloudflare Workers, Ollama, Prompt Engineering, lokale LLMs, Docker.'],
  ['#story .tl-row:nth-child(4) .ttl', 'Engineering &amp; operations · 5 production systems', 'Engineering &amp; Betrieb · 5 Produktionssysteme'],
  ['#story .tl-row:nth-child(4) .desc',
    'End-to-end: system design → deployment → monitoring. Designed and operated solo.',
    'End-to-End: Systemdesign → Deployment → Monitoring. Entworfen und betrieben, solo.'],
  ['#story .tl-row:nth-child(5) .ttl', 'Open to your team', 'Offen für Ihr Team'],
  ['#story .tl-row:nth-child(5) .desc',
    'Immediate availability. Germany-based, EU citizen. Remote or on-site.',
    'Sofort verfügbar. Standort Deutschland, EU-Bürger. Remote oder vor Ort.'],

  // ── SECTION § III: APPROACH (#values) ──
  ['#values .eyebrow', '§ III — Approach', '§ III — Arbeitsweise'],
  ['#values .section-title', 'What I build<br>— and <em>why it works</em>.',
                             'Was ich entwickle<br>— und <em>warum es funktioniert</em>.'],
  ['#values .section-sub',
    'I design AI systems from first principles — agent topology, provider failover, latency budgets, cost routing — then build and operate them end-to-end. Six things I bring on day one.',
    'Ich entwerfe KI-Systeme von Grund auf — Agenten-Topologie, Provider-Failover, Latenz-Budgets, Kosten-Routing — und baue und betreibe sie End-to-End. Sechs Dinge, die ich vom ersten Tag an mitbringe.'],
  ['#values .value:nth-child(1) .vix', '01. Ship rate', '01. Liefer-Tempo'],
  ['#values .value:nth-child(1) h3', 'Founder-grade <em>ownership</em>.', 'Gründer-niveau <em>Verantwortung</em>.'],
  ['#values .value:nth-child(1) p',
    'Spec → architecture → code → deploy → monitor → iterate. No hand-offs, no "not my job". Five systems shipped solo since mid-2025. The cadence your runway needs.',
    'Spec → Architektur → Code → Deploy → Monitor → Iteration. Keine Übergaben, kein „nicht mein Bier". Fünf Systeme solo geliefert seit Mitte 2025. Die Kadenz, die Ihre Runway braucht.'],
  ['#values .value:nth-child(2) .vix', '02. Full stack', '02. Voller Stack'],
  ['#values .value:nth-child(2) h3', 'AI, backend &amp; <em>infra</em> in one.', 'KI, Backend &amp; <em>Infra</em> in einem.'],
  ['#values .value:nth-child(2) p',
    'TypeScript/Next.js, LLM pipelines, multi-agent orchestration, FastAPI/Python, Cloudflare edge, Docker/systemd. One headcount, full stack — your seed runway stretches further.',
    'TypeScript/Next.js, LLM-Pipelines, Multi-Agenten-Orchestrierung, FastAPI/Python, Cloudflare Edge, Docker/systemd. Eine Person, voller Stack — Ihre Seed-Runway reicht weiter.'],
  ['#values .value:nth-child(3) .vix', '03. AI-native', '03. KI-nativ'],
  ['#values .value:nth-child(3) h3', 'LLM is native, <em>not a bolt-on</em>.', 'LLM ist nativ, <em>kein Add-on</em>.'],
  ['#values .value:nth-child(3) p',
    'I build agent systems, not wrappers: Mixture-of-Agents pipelines, disagreement detection, reflection loops. Multi-provider failover (OpenAI / Gemini / Groq / Ollama), structured outputs, voice pipelines. Designed with latency, cost &amp; failure modes in mind.',
    'Ich baue Agentensysteme, keine Wrapper: Mixture-of-Agents-Pipelines, Disagreement Detection, Reflexionsschleifen. Multi-Provider-Failover (OpenAI / Gemini / Groq / Ollama), strukturierte Outputs, Voice-Pipelines. Entworfen mit Latenz, Kosten &amp; Fehlermodi im Blick.'],
  ['#values .value:nth-child(4) .vix', '04. Production hygiene', '04. Produktions-Hygiene'],
  ['#values .value:nth-child(4) h3', 'Defaults, <em>not afterthoughts</em>.', 'Standards, <em>kein Nachgedanke</em>.'],
  ['#values .value:nth-child(4) p',
    'HMAC-SHA256, zero-secrets architecture, rate limiting, systemd auto-restart, health checks, webhook verification, secrets via env. Built in from day one.',
    'HMAC-SHA256, Zero-Secrets-Architektur, Rate Limiting, systemd Auto-Restart, Health Checks, Webhook-Verifizierung, Secrets via Env. Vom ersten Tag an eingebaut.'],
  ['#values .value:nth-child(5) .vix', '05. Late-career grit', '05. Späte-Karriere-Biss'],
  ['#values .value:nth-child(5) h3', 'Self-driven, <em>under pressure</em>.', 'Eigenmotiviert, <em>unter Druck</em>.'],
  ['#values .value:nth-child(5) p',
    "Career-switched at 35+ and shipped five systems solo while moving from part-time driving into full-time engineering. Not talent — discipline. I don't need reminders to unblock myself.",
    'Mit 35+ den Beruf gewechselt und fünf Systeme solo geliefert — beim Übergang vom Teilzeit-Fahren zur Vollzeit-Entwicklung. Kein Talent — Disziplin. Ich brauche keine Erinnerungen, um mich selbst zu entblockieren.'],
  ['#values .value:nth-child(6) .vix', '06. Full product', '06. Gesamtes Produkt'],
  ['#values .value:nth-child(6) h3', 'Beyond the <em>backend</em>.', 'Über das <em>Backend</em> hinaus.'],
  ['#values .value:nth-child(6) p',
    'I can design, implement, and launch an AI product end to end — voice, visual generation (ComfyUI, Stable Diffusion), UI, copy, deployment. Useful when your team is three people and a deadline.',
    'Ich kann ein KI-Produkt von Anfang bis Ende entwerfen, umsetzen und launchen — Voice, Bildgenerierung (ComfyUI, Stable Diffusion), UI, Texte, Deployment. Nützlich, wenn Ihr Team aus drei Leuten und einer Deadline besteht.'],

  // ── SECTION § IV: SYSTEMS (#projects) ──
  ['#projects .eyebrow', '§ IV — Systems · Selected', '§ IV — Systeme · Auswahl'],
  ['#projects .section-title', 'Production systems,<br>shipped <em>solo</em>.',
                               'Produktive Systeme,<br>solo <em>geliefert</em>.'],
  ['#projects .section-sub',
    'A selection from five production systems below — each deployed on infrastructure I own and operate, engineered and built end-to-end to production standards.',
    'Eine Auswahl aus fünf Produktionssystemen unten — jedes auf Infrastruktur deployt, die ich besitze und betreibe, End-to-End auf Produktionsniveau gebaut.'],

  // Project 01 — Orchestra
  ['.proj:nth-child(1) .proj-meta .badge', 'Flagship System', 'Flaggschiff-System'],
  ['.proj:nth-child(1) .tagline', 'Mixture-of-Agents pipeline · code-guaranteed Skeptic · live cost telemetry.',
                                  'Mixture-of-Agents-Pipeline · code-garantierter Skeptiker · Live-Kosten-Telemetrie.'],
  ['.proj:nth-child(1) .desc',
    'Self-hosted AI workspace running 3–5 specialized agents in parallel per turn. Disagreement detection surfaces expert conflict; reflection critic revises the final answer. 4,100+ tests, 70+ documented post-mortems, CI/CD — MIT licensed.',
    'Selbst gehosteter KI-Workspace, der 3–5 spezialisierte Agenten parallel ausführt. Disagreement Detection macht Expertenkonflikte sichtbar; ein Reflexions-Kritiker überarbeitet die finale Antwort. 4.100+ Tests, 70+ Post-Mortems, CI/CD — MIT-lizenziert.'],
  ['.proj:nth-child(1) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(1) .proj-stat:nth-child(1) .l', 'tests', 'Tests'],
  ['.proj:nth-child(1) .proj-stat:nth-child(2) .l', 'post-mortems', 'Post-Mortems'],
  ['.proj:nth-child(1) .proj-stat:nth-child(3) .l', 'parallel agents', 'parallele Agenten'],
  ['.proj:nth-child(1) .proj-stat:nth-child(4) .l', 'open source', 'Open Source'],

  // Project 02 — 4take
  ['.proj:nth-child(2) .proj-meta .badge', 'Flagship Protocol', 'Flaggschiff-Protokoll'],
  ['.proj:nth-child(2) .tagline', 'FastMCP &amp; CLI council · 4-model consensus protocol · adversarial synthesis.',
                                  'FastMCP- &amp; CLI-Rat · 4-Modell-Konsens-Protokoll · adversarielle Synthese.'],
  ['.proj:nth-child(2) .desc',
    'Autonomous multi-model AI code review council querying 4 independent LLMs in parallel. Scores confidence, discovers consensus &amp; critical regressions before code merges. Zero-dependency FastMCP server + high-speed CLI, comprehensive Pytest suite, MIT-licensed.',
    'Autonomer Multi-Modell-KI-Code-Review-Rat, der 4 unabhängige LLMs parallel abfragt. Bewertet Konfidenz, erkennt Konsens &amp; kritische Regressionen vor dem Merge. FastMCP-Server ohne externe Abhängigkeiten + High-Speed-CLI, umfassende Pytest-Suite, MIT-lizenziert.'],
  ['.proj:nth-child(2) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(2) .proj-stat:nth-child(1) .l', 'suite', 'Suite'],
  ['.proj:nth-child(2) .proj-stat:nth-child(2) .l', 'parallel LLMs', 'parallele LLMs'],
  ['.proj:nth-child(2) .proj-stat:nth-child(3) .l', 'protocol', 'Protokoll'],
  ['.proj:nth-child(2) .proj-stat:nth-child(4) .l', 'open source', 'Open Source'],

  // Project 03 — AI Dictaphone
  ['.proj:nth-child(3) .proj-meta .badge', 'Production App', 'Produktions-App'],
  ['.proj:nth-child(3) .tagline', 'Edge voice pipeline · Whisper → LLM · sub-second latency.',
                                  'Edge-Voice-Pipeline · Whisper → LLM · Sub-Sekunden-Latenz.'],
  ['.proj:nth-child(3) .desc',
    'Serverless voice-to-insight pipeline on Cloudflare edge. User voice note → Whisper transcription → LLM summarization → rich Mini-App UI. Zero cold-start, global edge latency, zero secrets leaked to client.',
    'Serverlose Voice-to-Insight-Pipeline auf Cloudflare Edge. Sprachnachricht → Whisper-Transkription → LLM-Zusammenfassung → Mini-App-UI. Null Cold-Start, globale Edge-Latenz, keine Secrets im Client.'],
  ['.proj:nth-child(3) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(3) .proj-stat:nth-child(1) .l', 'in production', 'in Produktion'],
  ['.proj:nth-child(3) .proj-stat:nth-child(2) .l', 'cold start', 'Cold-Start'],
  ['.proj:nth-child(3) .proj-stat:nth-child(3) .l', 'webhook auth', 'Webhook-Auth'],
  ['.proj:nth-child(3) .proj-stat:nth-child(4) .l', 'global', 'global'],

  // Project 04 — AI Moderation Bot
  ['.proj:nth-child(4) .proj-meta .badge', 'Production Bot', 'Produktions-Bot'],
  ['.proj:nth-child(4) .tagline', 'LLM moderation pipeline with n8n orchestrator &amp; multi-turn context memory.',
                                  'LLM-Moderations-Pipeline mit n8n-Orchestrator &amp; Multi-Turn-Kontextspeicher.'],
  ['.proj:nth-child(4) .desc',
    'Autonomous Telegram community moderation bot operating on zero-downtime n8n workflows with LLaMA 3.3 and Gemini fallbacks. Detects spam, scams, toxic intent, and multi-turn manipulation patterns in real-time. 1,000+ tests across bot, API, and mini-app.',
    'Autonomer Telegram-Community-Moderationsbot auf ausfallsicheren n8n-Workflows mit LLaMA 3.3 und Gemini-Fallback. Erkennt Spam, Betrug und Manipulation in Echtzeit. 1.000+ Tests über Bot, API und Mini-App.'],
  ['.proj:nth-child(4) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(4) .proj-stat:nth-child(1) .l', 'tests', 'Tests'],
  ['.proj:nth-child(4) .proj-stat:nth-child(2) .l', 'active', 'aktiv'],
  ['.proj:nth-child(4) .proj-stat:nth-child(3) .l', 'orchestrator', 'Orchestrator'],
  ['.proj:nth-child(4) .proj-stat:nth-child(4) .l', 'memory', 'Speicher'],

  // Project 05 — AI Psychology Bot
  ['.proj:nth-child(5) .proj-meta .badge', 'Commercial SaaS', 'Kommerzielles SaaS'],
  ['.proj:nth-child(5) .tagline', 'Therapeutic reflection loops with Telegram Stars native monetization.',
                                  'Therapeutische Reflexionsschleifen mit nativer Telegram-Stars-Monetarisierung.'],
  ['.proj:nth-child(5) .desc',
    'Commercial AI psychological assistant featuring safe reflective listening techniques, personalized state tracking, and integrated Telegram Stars payments for subscription tiers.',
    'Kommerzieller psychologischer KI-Assistent mit reflektierenden Gesprächstechniken, personalisierter Zustandserfassung und integrierten Telegram-Stars-Zahlungen für Abonnements.'],
  ['.proj:nth-child(5) .proj-cta', 'Read case study →', 'Fallstudie lesen →'],
  ['.proj:nth-child(5) .proj-stat:nth-child(1) .l', 'monetized', 'monetarisiert'],
  ['.proj:nth-child(5) .proj-stat:nth-child(2) .l', 'private', 'privat'],
  ['.proj:nth-child(5) .proj-stat:nth-child(3) .l', 'guardrails', 'Sicherheitsfilter'],
  ['.proj:nth-child(5) .proj-stat:nth-child(4) .l', 'SaaS', 'SaaS'],

  // Explore all repos CTA
  ['#projects > .reveal:last-child .btn-ghost',
    'Explore all repositories on GitHub <span class="arrow">→</span>',
    'Alle Repositories auf GitHub erkunden <span class="arrow">→</span>'],

  // ── SECTION § V: TOOLKIT & STACK (#stack) ──
  ['#stack .eyebrow', '§ V — Toolkit &amp; Stack', '§ V — Werkzeuge &amp; Stack'],
  ['#stack .section-title', 'Production stack<br>— <em>tools I ship with</em>.',
                            'Produktions-Stack<br>— <em>Werkzeuge, mit denen ich liefere</em>.'],
  ['#stack .section-sub',
    "Tools I've used in production — tested, debugged under pressure, and operated on live infrastructure.",
    'Werkzeuge, die ich in Produktion eingesetzt habe — getestet, unter Druck debuggt und auf Live-Infrastruktur betrieben.'],
  ['#stack .stack-row:nth-child(1) .ttl', '<em>AI</em> · LLM · Agents', '<em>KI</em> · LLM · Agenten'],
  ['#stack .stack-row:nth-child(2) .ttl', '<em>Programming</em> &amp; Testing', '<em>Programmierung</em> &amp; Testing'],
  ['#stack .stack-row:nth-child(3) .ttl', '<em>Automation</em> &amp; Workflows', '<em>Automatisierung</em> &amp; Workflows'],
  ['#stack .stack-row:nth-child(4) .ttl', '<em>Security</em> &amp; Protocols', '<em>Sicherheit</em> &amp; Protokolle'],

  // Spoken languages table
  ['.langs .lang:nth-child(1) .name', 'Russian', 'Russisch'],
  ['.langs .lang:nth-child(1) .lvl',  'Native fluency', 'Muttersprache'],
  ['.langs .lang:nth-child(2) .name', 'Latvian', 'Lettisch'],
  ['.langs .lang:nth-child(2) .lvl',  'Native fluency', 'Muttersprache / Zweitsprache'],
  ['.langs .lang:nth-child(3) .name', 'English', 'Englisch'],
  ['.langs .lang:nth-child(3) .lvl',  'C1 Professional working proficiency', 'C1 Fließend verhandlungssicher'],
  ['.langs .lang:nth-child(4) .name', 'German', 'Deutsch'],
  ['.langs .lang:nth-child(4) .lvl',  'B1 Independent user', 'B1 Selbstständige Sprachverwendung'],

  // ── SECTION § VI: CONTACT (#contact) ──
  ['.contact-eye', '§ VI — Connect &amp; Hire', '§ VI — Kontakt &amp; Engagement'],
  ['.contact-h', "Let's build something <em>impossible</em>.", 'Bauen wir etwas, das <em>begeistert</em>.'],
  ['.contact-lede',
    "I'm currently considering full-time Agentic AI Engineer and Founding Engineer roles (Seed to Series C). Remote-first or based in Germany.",
    'Ich bin derzeit offen für Vollzeitstellen als Agentic AI Engineer und Founding Engineer (Seed bis Series C). Remote-first oder mit Standort in Deutschland.'],
  ['.contact-cell:nth-child(1) .lbl', 'Direct Email', 'Direkte E-Mail'],
  ['.contact-cell:nth-child(2) .lbl', 'Telegram', 'Telegram'],
  ['.contact-cell:nth-child(3) .lbl', 'GitHub', 'GitHub'],
  ['.contact-cell:nth-child(4) .lbl', 'LinkedIn', 'LinkedIn'],

  // ── FOOTER ──
  ['footer div:nth-child(1)', '© 2026 Aleksejs Buss · Agentic AI Architecture', '© 2026 Aleksejs Buss · Agentic AI Architektur'],
  ['footer div:nth-child(2)',
    '<span class="live">●</span> ALL 5 SYSTEMS OPERATIONAL · 5,400+ TESTS PASSING',
    '<span class="live">●</span> ALLE 5 SYSTEME BETRIEBSBEREIT · 5.400+ TESTS ERFOLGREICH'],

  // ── CMD-DOCK & AGENT PANEL ──
  ['.cmd-dock .placeholder span:first-child', 'Ask the agent —', 'Frag den Agenten —'],
  ['.cmd-dock .placeholder em', 'show me your stack', 'zeig mir deinen Stack'],
  ['.cmd-suggestions .cmd-sug:nth-child(1)', 'Show projects', 'Projekte zeigen'],
  ['.cmd-suggestions .cmd-sug:nth-child(2)', "What's your stack?", 'Was ist dein Stack?'],
  ['.cmd-suggestions .cmd-sug:nth-child(3)', 'Why hire you?', 'Warum dich einstellen?'],
  ['.cmd-suggestions .cmd-sug:nth-child(4)', 'Hiring process?', 'Einstellungsprozess?'],
];

export function initI18n(): void {
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

export function currentLang(): Lang {
  return (document.documentElement.lang as Lang) || 'en';
}

export function apply(lang: Lang): void {
  document.documentElement.lang = lang;

  // 1. Synchronize Hero dynamic typing headline
  updateHeroHeadlineLang(lang);

  // 2. Synchronize case-study modals
  refreshOpenModalLang(lang);

  // 3. Apply DOM translations from dictionary
  for (const [sel, en, de] of DICT) {
    const el = $(sel);
    if (!el) continue;
    el.innerHTML = lang === 'en' ? en : de;
  }

  // 4. Update language toggle button label
  const btn = $('#langBtn');
  if (btn) {
    const lbl = btn.querySelector('.lbl');
    if (lbl) lbl.textContent = lang === 'en' ? 'DE' : 'EN';
  }

  // 5. Update agent input placeholder
  const input = $<HTMLInputElement>('#cmdInput');
  if (input) {
    input.placeholder = lang === 'en'
      ? 'Ask about systems, stack, architecture...'
      : 'Frage zu Systemen, Stack, Architektur...';
  }

  // 6. Swap CV download hrefs to match the active language (ATS-optimised versions)
  const cvLinks = document.querySelectorAll<HTMLAnchorElement>('a[href*="CV-Standard"], a[href*="CV-EN-Standard"]');
  for (const a of cvLinks) {
    a.href = lang === 'en' ? 'CV-EN-Standard.html' : 'CV-Standard.html';
  }
}
