// Everything the site says about Ariel lives here, so the home page, the CV and
// llms.txt cannot drift apart. Facts mirror the verified portfolio notes:
// no employer, operator or customer names beyond what is already public.
import { ezCommerce, workspaceSplitBench } from './proof';

const fmtSec = (n: number) => `${n.toFixed(2)}s`;
const [salesBench, catalogBench, coreBench] = workspaceSplitBench.scenarios;

export const email = 'onoriagaariel@gmail.com';

export const achievements = [
  { icon: 'flag', title: 'Production AI & MCP', text: 'Shipped an in-app AI assistant, multi-model LLM pipelines and open-source Rust MCP & guardrail tooling.' },
  { icon: 'shield', title: 'Passed the audit', text: 'Core engineer on real-money AWS gaming systems whose RNG/math products passed GLI certification.' },
  { icon: 'crate', title: '30-crate Rust SaaS', text: `Built and run the Huggian suite end to end (${ezCommerce.releases} releases, ${ezCommerce.migrations} migrations) plus 7 crates on crates.io.` },
  { icon: 'star', title: 'Fast climb', text: 'Self-taught: went from trainee to leading a seven-person engineering team in under two years.' },
];

const huggianModule = (slug: string, name: string, kind: string, hex: string, summary: string, built: string) => ({
  slug, name, kind, hex, summary, built,
  href: `https://huggian.com/${slug}`,
  label: `huggian.com/${slug}`,
});

export const huggianModules = [
  huggianModule('ez-commerce', 'ez-commerce', 'Commerce SaaS + AI', '#E8622C',
    'Point of sale, inventory, cash shifts, ARCA electronic invoicing, online storefront and in-app AI assistant for retail shops.',
    `Offline-capable SolidJS PWA on a ${ezCommerce.crates}-crate Rust backend (Axum, SQLx, PostgreSQL) with ${ezCommerce.contexts} bounded contexts, ${ezCommerce.migrations} migrations and a transactional outbox.`),
  huggianModule('ez-catalog', 'ez-catalog', 'Product API', '#14B8A6',
    'Barcode lookup API (EAN-13, UPC-12, ISBN) returning normalized names, brands, categories and images across 10 verticals.',
    'Rust REST service with in-memory and PostgreSQL cache, parallel fan-out across 87 external sources, sliding-window rate limits, scoped API keys and moderated corrections.'),
  huggianModule('ez-contador', 'ez-contador', 'Accountant portal', '#3B82F6',
    'Multi-client workspace for accounting firms tracking ez-commerce shops: ARCA status, sales-to-invoice matching, batch invoicing and tax deadlines.',
    'CUIT-delegated multi-tenant portal with 12-month tax-tier ceiling checks, batch invoice issuance and calendar exports without storing client tax passwords.'),
  huggianModule('ez-rails', 'ez-rails', 'Payments & tax API', '#F7BF2E',
    'Payment rails and ARCA invoicing API connecting Mercado Pago and banks to reconcile incoming transfers and deliver signed webhooks.',
    'Scoped sandbox/live API keys, string-decimal amounts, idempotent writes, stateful and stateless transfer matching, CBU micro-deposit verification, HMAC webhooks with replay and the ARCA invoicing engine.'),
  huggianModule('ez-cochera', 'ez-cochera', 'Parking console', '#8B5CF6',
    'High-speed parking lot and garage console with F10/F11/F12 shortcuts, barcode tickets, tiered 5-minute rates, daily caps and monthly passes.',
    'Keyboard-first operational app with silent 58/80 mm thermal printing (Windows Print Agent and Android Sunmi/Bluetooth), dual ez-commerce or standalone checkout modes and fail-open exits.'),
  huggianModule('herramientas', 'Free tools', 'Free tools hub', '#1466C4',
    'Browser-only calculators and utilities for merchants, accountants and parking lots: tax tiers, reverse Mercado Pago margin, Law 4.827 signs and CUIT/CBU validation.',
    'Zero-signup Astro tools running BCRA check-digit and Modulo 11 validation, ARCA/SIFERE .ics calendar export, reverse fee math and print-ready A4 PDF output.'),
];

export const mainQuest = {
  title: 'Ez-Commerce & AI Assistant',
  kind: 'Main quest · multi-tenant commerce SaaS & production AI · founder, sole engineer',
  summary: 'Point-of-sale, inventory, electronic invoicing and an in-app AI assistant running in production across 14 retail shops.',
  points: [
    `Rust backend (Axum, SQLx, Tokio) on PostgreSQL: ${ezCommerce.crates}-crate Cargo workspace across ${ezCommerce.contexts} bounded contexts with ${ezCommerce.migrations} migrations and ${ezCommerce.releases} releases.`,
    'In-app AI assistant and multi-model LLM workflows (Anthropic, OpenAI, Google, Groq) with tool boundaries, cost limits and human-in-the-loop checkpoints.',
    'Transactional outbox with idempotency keys, offline-capable POS sync, Mercado Pago payments and electronic invoicing.',
    'Property-based and mutation testing; rollouts follow runbooks with precheck and rollback SQL.',
  ],
  stack: ['Rust', 'TypeScript', 'LLM / MCP', 'PostgreSQL', 'SolidJS'],
  link: { href: 'https://huggian.com/ez-commerce', label: 'huggian.com/ez-commerce' },
};

export const workspaceSplit = {
  title: `One Rust monolith into ${ezCommerce.crates} crates`,
  kind: 'Crafting · Cargo workspace split in Rust',
  summary:
    `Split Ez-Commerce’s 543k-line single-crate Rust backend into a ${ezCommerce.crates}-crate Cargo workspace (core, ${ezCommerce.moduleCrates} module crates and the server binary) with compile-time gates measured before and after.`,
  inputs: ['ez-sales', 'ez-catalog', 'ez-pricing', `+${ezCommerce.moduleCrates - 3} crates`],
  output: `${ezCommerce.crates}-crate workspace`,
  points: [
    `Measured at ${workspaceSplitBench.crates} crates before adding ez-subscriptions: 1-line sales edit dropped from ${fmtSec(salesBench.beforeSec)} to ${fmtSec(salesBench.afterSec)} (${salesBench.speedup} faster); catalog edits from ${fmtSec(catalogBench.beforeSec)} to ${fmtSec(catalogBench.afterSec)} (${catalogBench.speedup}); core edits from ${fmtSec(coreBench.beforeSec)} to ${fmtSec(coreBench.afterSec)} (${coreBench.speedup}).`,
    'Core merges module sub-routers through an HttpModule trait so core never depends on peeled crates and modules cannot wrap each other’s routes.',
    `Extracted ez-sales, ez-catalog, ez-pricing, ez-cash, ez-mercadopago, ez-recommendations, ez-catalog-imports and ${ezCommerce.moduleCrates - 7} more module crates while keeping the binary contract unchanged.`,
  ],
  stack: ['Rust', 'Cargo workspace', 'Axum', 'SQLx'],
};

export const crafting = {
  title: 'Three services + AI into one binary',
  kind: 'Crafting · service consolidation & AI module in Rust',
  summary:
    'Merged three separately deployed services into a single Rust API and worker, cut over live one at a time with each old service retired in turn, then added an AI module in the same binary.',
  inputs: ['images', 'catalog', 'recs', '+ AI (new)'],
  output: 'one Rust API + worker',
  points: [
    'Scoped API keys with plans, rate limits and monthly quotas; existing keys migrated without reissuing any.',
    'A telemetry ingestion platform built as six crates.',
    'A cutover gate that refuses to switch traffic if any key would end up with tighter limits than before.',
  ],
  stack: ['Rust', 'AI module', 'PostgreSQL', 'Redis'],
};

export const sideQuests = [
  {
    title: 'Billing, fiscal and identity platform',
    kind: 'Side quest · platform core in TypeScript',
    summary:
      'The shared platform behind the products: subscriptions, payment processing, fiscal invoicing, identity, event delivery and an admin console.',
    points: ['27 bounded contexts, tested against a real PostgreSQL instance.', 'Tag-triggered CI builds and deploys.'],
    stack: ['TypeScript', 'Bun', 'Hono', 'Drizzle', 'PostgreSQL'],
  },
  {
    title: 'AI agent guardrails & production ops',
    kind: 'Side quest · MCP, guardrails and solo infrastructure',
    summary: 'Open-source agent infrastructure and self-managed Linux ops powering the full product suite.',
    points: [
      'iron-suite (Rust SQLite FTS5 + stdio MCP memory hub) and claude-harness (deterministic Rust guardrail on agent tool calls).',
      'CI deploy, rollback and scheduled deploys with health-gated rollouts, deploy-window guard and scale-to-zero.',
    ],
    stack: ['MCP', 'Rust', 'Docker', 'GitHub Actions', 'nginx'],
  },
];

export const experience = [
  {
    role: 'Founder & Principal AI / Backend Engineer, Huggian',
    when: 'Feb 2026 – Present',
    status: 'Active',
    points: [
      'Architected multi-model LLM workflows (Anthropic, OpenAI, Google, Groq), an in-app AI assistant inside Ez-Commerce, and open-source Rust agent tooling (iron-suite MCP memory hub, claude-harness tool-call guardrail, entropy-hunter CI gate).',
      'Built and operate the Huggian SaaS suite (30-crate Rust workspace, 44 bounded contexts, 915 releases, 481 migrations, 62k+ production sales across 14 shops) plus its TypeScript billing, fiscal and identity platform; runs autonomously on rollback-safe infra.',
      'Cut incremental Rust build times by 5.0×–8.7× (48s → 5.5s) via workspace splitting, and consolidated three live services plus an AI module into one Rust API + worker with zero-reissue key migration.',
    ],
  },
  {
    role: 'Senior Backend & Platform Engineer, real-money gaming platform (AWS)',
    when: 'Dec 2021 – Present',
    status: 'Active',
    points: [
      'Core engineer on a multi-tenant real-money gaming platform (remote game server & back office): Go and TypeScript serverless monorepo deployed to isolated per-tenant AWS environments.',
      'Architected and maintain five shared TypeScript libraries and a game template adopted across all studio game teams.',
      'Own Terraform IaC across Lambda, API Gateway, DynamoDB, Aurora, ECS, CloudFront, SQS/SNS and IoT Core, plus GitHub Actions CI/CD and internal Rust/Go deploy tooling.',
      'Co-developed RNG and game-math services with Monte Carlo simulation tooling (Go, Rust, Python) for regulated products that passed GLI certification.',
    ],
  },
  {
    role: 'Engineering Team Lead (promoted from Frontend Developer), PicallEx',
    when: 'Jun 2020 – Jan 2022',
    status: 'Completed',
    points: [
      'Joined as a trainee and was promoted to lead a team of seven engineers in under two years.',
      'Vue, PHP (Laravel) and SQL; introduced TypeScript and Vitest across a previously untyped JavaScript codebase.',
    ],
  },
  {
    role: 'Freelance engineer',
    when: 'Earlier',
    status: 'Completed',
    points: [
      'Independent client projects, including a WordPress-to-static migration that cut hosting cost by 90% and raised Lighthouse from 52 to 98.',
    ],
  },
];

export const openSource = [
  {
    name: 'iron-suite',
    href: 'https://github.com/arielonoriaga/iron-suite',
    what: 'Zero-cloud SQLite FTS5 + stdio MCP memory hub and multi-agent engineering skills across Claude Code, Codex and Antigravity.',
    lang: 'Rust · MCP',
  },
  {
    name: 'claude-harness',
    href: 'https://github.com/arielonoriaga/claude-harness',
    what: 'Safety and self-improvement harness for AI coding agents: deterministic Rust tool-call guardrail, shared journal bus, test agent and review queue.',
    lang: 'Rust · Shell',
  },
  {
    name: 'entropy-hunter',
    href: 'https://github.com/arielonoriaga/entropy-hunter',
    what: 'Deterministic code-health analyzer for Rust and TypeScript: complexity, coupling, churn and duplication, with a CI regression gate to catch AI code drift.',
    lang: 'TypeScript · Rust',
  },
  {
    name: 'lazyfetch',
    href: 'https://github.com/arielonoriaga/lazyfetch',
    what: 'Terminal HTTP client: collections, environments, Postman import, vim keys. Published on crates.io as a seven-crate hexagonal workspace with an IO-free core enforced in CI.',
    lang: 'Rust',
  },
];

export const hotbar = ['AI / MCP', 'TypeScript', 'Rust', 'Go', 'Python', 'Postgres', 'AWS', 'Terraform', 'Docker'];

export const skills = [
  ['AI & Agents', 'LLM orchestration (Anthropic, OpenAI, Google, Groq) · Model Context Protocol (MCP) · deterministic tool-call guardrails · SQLite FTS5 retrieval · multi-agent workflows · human-in-the-loop · CI quality gates'],
  ['Backend', 'Rust (Axum, SQLx, Tokio) · TypeScript (Node, Bun, Hono, Drizzle) · Go · Python · PostgreSQL, DynamoDB, Redis · queues, MQTT, transactional outbox, idempotency'],
  ['Frontend', 'SolidJS, React, Svelte, Vue, Astro · PWA and offline sync'],
  ['Cloud & ops', 'AWS (Lambda, API Gateway, DynamoDB, Aurora, ECS, CloudFront, IoT Core, SQS/SNS) · Terraform · Docker · GitHub Actions · nginx'],
  ['Practices', 'Domain-driven and hexagonal design · property and mutation testing · rollback-safe deploys · AI-native engineering'],
];

export const site = 'https://arielonoriaga.huggian.com';
export const person = {
  name: 'Ariel Onoriaga',
  role: 'Senior AI Engineer & Backend Architect — Agentic Systems, MCP, TypeScript & Rust',
  years: 7,
  location: 'Argentina (UTC−3), US business hours',
  availability: 'Remote · Full-time & senior contract',
  github: 'https://github.com/arielonoriaga',
  linkedin: 'https://www.linkedin.com/in/arielonoriaga/',
  crates: 'https://crates.io/users/arielonoriaga',
};
export const description =
  'Ariel Onoriaga: Senior AI Engineer & Production Backend Architect (LLM agents, MCP, guardrails, TypeScript, Rust, Go, AWS). Seven years of production systems, remote on US hours.';
export const summary =
  'I build production AI systems and the high-reliability backends behind them: agentic workflows, MCP servers, deterministic tool-call guardrails and money-movement platforms where mistakes cost real money. Seven years in, shipping GLI-certified AWS systems and running the Huggian Rust/TypeScript suite end to end.';

// Pre-filled enquiry for hiring managers, recruiters or technical founders.
export const mailto =
  `mailto:${email}?subject=${encodeURIComponent('Role / Engineering inquiry: [your company]')}` +
  `&body=${encodeURIComponent("Team & role:\n\nCore problem you're solving:\n\nTimeline:\n")}`;

export const offers = [
  {
    title: 'Production AI & Agentic Systems',
    text: 'Turning fragile LLM prototypes into production software: MCP servers, deterministic tool-call guardrails, retrieval/memory layers, cost caps, human-in-the-loop checkpoints and CI regression gates.',
    proof: 'Shipped in iron-suite, claude-harness & Ez-Commerce AI.',
  },
  {
    title: 'Payments, Billing & High-Reliability Backends',
    text: 'Payment, subscription and multi-tenant systems built so retries, duplicate webhooks or crashes never corrupt state: idempotency keys, guarded transitions and transactional outbox.',
    proof: 'Done in Ez-Commerce & Huggian billing core, in production.',
  },
  {
    title: 'Systems Architecture & Live Migrations',
    text: 'High-throughput Rust, TypeScript and Go backends on AWS or Linux: splitting monoliths for compile velocity, consolidating services live with verification gates, and owning CI/CD end to end.',
    proof: 'Done: 30-crate Rust split (5×–8.7× faster) & live service merge.',
  },
];

export const faq = [
  {
    q: 'Who is Ariel Onoriaga?',
    a: 'A Senior AI Engineer and Production Backend Architect with seven years of experience, based in Argentina (UTC−3, US hours). He builds agentic systems, MCP tooling, deterministic guardrails and high-reliability backends in TypeScript, Rust, Go and Python.',
  },
  {
    q: 'What roles or engagements is Ariel open to?',
    a: 'Full-time remote roles (Senior AI Engineer, Forward Deployed Engineer, Senior Backend / Distributed Systems Engineer) and senior contract engagements with US or global teams. Full workday overlap with US Eastern/Central.',
  },
  {
    q: 'What kind of AI Engineering does he specialize in?',
    a: 'Applied AI and production agent infrastructure — not ML model pretraining. Multi-model LLM orchestration (Anthropic, OpenAI, Google, Groq), MCP servers, SQLite FTS5 memory/retrieval, deterministic Rust guardrails on tool calls, cost limits and automated CI quality gates.',
  },
  {
    q: 'Will running Huggian conflict with a full-time engineering role?',
    a: 'No. Huggian is a mature, automated production lab running on rollback-safe infrastructure for 14 small local shops. It does not require daytime hours, and his primary focus is joining one high-bar engineering team full-time.',
  },
  {
    q: 'Most of his product code is private. What can a hiring team inspect?',
    a: 'Four active open-source repos on GitHub: iron-suite (Rust stdio MCP memory hub), claude-harness (Rust AI agent safety guardrail), entropy-hunter (CI code-health gate) and lazyfetch (7-crate Rust workspace on crates.io), plus two detailed architecture write-ups on this site.',
  },
  {
    q: 'Has he worked in regulated or high-stakes environments?',
    a: 'Yes. He is a core engineer on a multi-tenant real-money gaming platform on AWS whose RNG and game-math products passed GLI certification, and he built payment reconciliation and government electronic tax invoicing in production.',
  },
  {
    q: 'How does he use AI in day-to-day engineering?',
    a: 'AI-native with strict verification: agents draft code inside explicit architecture, guardrail hooks, adversarial review and automated test gates — the same discipline he brings to shipping agentic features for users.',
  },
];
