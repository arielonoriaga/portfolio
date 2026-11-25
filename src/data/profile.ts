// Everything the site says about Ariel lives here, so the home page, the CV and
// llms.txt cannot drift apart. Facts mirror the verified portfolio notes:
// no employer, operator or customer names beyond what is already public.
import { ezCommerce, workspaceSplitBench } from './proof';

const fmtSec = (n: number) => `${n.toFixed(2)}s`;
const [salesBench, catalogBench, coreBench] = workspaceSplitBench.scenarios;

export const email = 'onoriagaariel@gmail.com';

export const achievements = [
  { icon: 'flag', title: 'Solo run', text: 'Founded, built and operate the five-product Huggian suite alone.' },
  { icon: 'shield', title: 'Passed the audit', text: 'Shipped gaming products that passed GLI certification.' },
  { icon: 'crate', title: 'Seven crates', text: 'Published a seven-crate Rust workspace on crates.io.' },
  { icon: 'star', title: 'Fast climb', text: 'Trainee to lead of a seven-person team in under two years.' },
];

export const huggianModules = [
  {
    slug: 'ez-commerce',
    name: 'ez-commerce',
    kind: 'Commerce SaaS',
    hex: '#E8622C',
    href: 'https://huggian.com/ez-commerce',
    label: 'huggian.com/ez-commerce',
    summary: 'Point of sale, inventory, cash shifts, ARCA electronic invoicing, online storefront and AI assistant for retail shops.',
    built: `Offline-capable SolidJS PWA on a ${ezCommerce.crates}-crate Rust backend (Axum, SQLx, PostgreSQL) with ${ezCommerce.contexts} bounded contexts, ${ezCommerce.migrations} migrations and a transactional outbox.`,
  },
  {
    slug: 'ez-catalog',
    name: 'ez-catalog',
    kind: 'Product API',
    hex: '#14B8A6',
    href: 'https://huggian.com/ez-catalog',
    label: 'huggian.com/ez-catalog',
    summary: 'Barcode lookup API (EAN-13, UPC-12, ISBN) returning normalized names, brands, categories and images across 10 verticals.',
    built: 'Rust REST service with in-memory and PostgreSQL cache, parallel fan-out across 87 external sources, sliding-window rate limits, scoped API keys and moderated corrections.',
  },
  {
    slug: 'ez-contador',
    name: 'ez-contador',
    kind: 'Accountant portal',
    hex: '#3B82F6',
    href: 'https://huggian.com/ez-contador',
    label: 'huggian.com/ez-contador',
    summary: 'Multi-client workspace for accounting firms tracking ez-commerce shops: ARCA status, sales-to-invoice matching, batch invoicing and tax deadlines.',
    built: 'CUIT-delegated multi-tenant portal with 12-month tax-tier ceiling checks, batch invoice issuance and calendar exports without storing client tax passwords.',
  },
  {
    slug: 'ez-rails',
    name: 'ez-rails',
    kind: 'Payments & tax API',
    hex: '#F7BF2E',
    href: 'https://huggian.com/ez-rails',
    label: 'huggian.com/ez-rails',
    summary: 'Payment rails and ARCA invoicing API connecting Mercado Pago and banks to reconcile incoming transfers and deliver signed webhooks.',
    built: 'Scoped sandbox/live API keys, string-decimal amounts, idempotent writes, stateful and stateless transfer matching, CBU micro-deposit verification, HMAC webhooks with replay and the ARCA invoicing engine.',
  },
  {
    slug: 'ez-cochera',
    name: 'ez-cochera',
    kind: 'Parking console',
    hex: '#8B5CF6',
    href: 'https://huggian.com/ez-cochera',
    label: 'huggian.com/ez-cochera',
    summary: 'High-speed parking lot and garage console with F10/F11/F12 shortcuts, barcode tickets, tiered 5-minute rates, daily caps and monthly passes.',
    built: 'Keyboard-first operational app with silent 58/80 mm thermal printing (Windows Print Agent and Android Sunmi/Bluetooth), dual ez-commerce or standalone checkout modes and fail-open exits.',
  },
  {
    slug: 'herramientas',
    name: 'Free tools',
    kind: 'Free tools hub',
    hex: '#1466C4',
    href: 'https://huggian.com/herramientas',
    label: 'huggian.com/herramientas',
    summary: 'Browser-only calculators and utilities for merchants, accountants and parking lots: tax tiers, reverse Mercado Pago margin, Law 4.827 signs and CUIT/CBU validation.',
    built: 'Zero-signup Astro tools running BCRA check-digit and Modulo 11 validation, ARCA/SIFERE .ics calendar export, reverse fee math and print-ready A4 PDF output.',
  },
];

export const mainQuest = {
  title: 'Ez-Commerce',
  kind: 'Main quest · multi-tenant commerce SaaS · founder, sole engineer',
  summary: 'Stock, point-of-sale and electronic invoicing for small and mid-size retailers. In production.',
  points: [
    `Rust backend (Axum, SQLx, Tokio) on PostgreSQL: ${ezCommerce.crates}-crate Cargo workspace across ${ezCommerce.contexts} bounded contexts with ${ezCommerce.migrations} migrations.`,
    'Offline-capable POS that syncs when the connection returns.',
    'Transactional outbox with idempotency keys, Mercado Pago payments and ARCA electronic invoicing.',
    'Property-based and mutation testing; rollouts follow runbooks with precheck and rollback SQL.',
  ],
  stack: ['Rust', 'Axum', 'PostgreSQL', 'SolidJS', 'TypeScript'],
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
  title: 'Three services into one binary',
  kind: 'Crafting · service consolidation in Rust',
  summary:
    'Merged three separately deployed services into a single Rust API and worker, cut over live one at a time with each old service retired in turn, then added a fourth module in the same binary.',
  inputs: ['images', 'catalog', 'recs', '+ AI (new)'],
  output: 'one Rust API + worker',
  points: [
    'Scoped API keys with plans, rate limits and monthly quotas; existing keys migrated without reissuing any.',
    'A telemetry ingestion platform built as six crates.',
    'A cutover gate that refuses to switch traffic if any key would end up with tighter limits than before.',
  ],
  stack: ['Rust', 'PostgreSQL', 'Redis'],
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
    title: 'Production infrastructure, run solo',
    kind: 'Side quest · deploys, rollback and operations',
    summary: 'Everything above runs on infrastructure I built and operate alone.',
    points: [
      'CI deploy, rollback and scheduled deploys, with health-gated rollouts and a deploy-window guard.',
      'Scale-to-zero for idle services, self-hosted secrets management and monitoring.',
    ],
    stack: ['Docker', 'nginx', 'GitHub Actions', 'systemd'],
  },
];

export const experience = [
  {
    role: 'Core engineer, real-money gaming platform',
    when: 'Dec 2021 – present',
    status: 'Active',
    points: [
      'Core engineer on a multi-tenant gaming platform (remote game server and back office): a Go and TypeScript monorepo on AWS serverless. About 3,700 commits, roughly 38% of the codebase.',
      'Designed and maintain five shared TypeScript libraries and a game template that the studio’s game teams build on.',
      'Terraform across Lambda, API Gateway, DynamoDB, Aurora, ECS, CloudFront and IoT Core, plus the GitHub Actions pipelines.',
      'Co-developed RNG and game-math services with Monte Carlo simulation tooling. The products passed GLI certification.',
      'Wrote the team’s internal tooling: a Rust terminal UI for multi-environment deploy status and a Go service for game scaffolding.',
    ],
  },
  {
    role: 'Founder and engineer, Huggian',
    when: 'Feb 2026 – present',
    status: 'Active',
    points: ['Built and run the Huggian suite (ez-commerce, ez-catalog, ez-contador, ez-rails, ez-cochera) and its billing, fiscal and identity platform end to end (Rust, TypeScript, PostgreSQL).'],
  },
  {
    role: 'Trainee to team lead, PicallEx',
    when: 'Jun 2020 – Jan 2022',
    status: 'Completed',
    points: [
      'Joined as a trainee and was leading a team of seven engineers in under two years.',
      'Vue, PHP (Laravel) and SQL; introduced TypeScript and Vitest where the team used plain JavaScript.',
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
    name: 'lazyfetch',
    href: 'https://github.com/arielonoriaga/lazyfetch',
    what: 'Terminal HTTP client: collections, environments, Postman import, vim keys. Published on crates.io as a seven-crate hexagonal workspace with an IO-free core enforced in CI.',
    lang: 'Rust',
  },
  {
    name: 'entropy-hunter',
    href: 'https://github.com/arielonoriaga/entropy-hunter',
    what: 'Deterministic code-health analyzer for Rust and TypeScript: complexity, coupling, churn and duplication, with a regression gate for CI.',
    lang: 'TypeScript',
  },
  {
    name: 'claude-harness',
    href: 'https://github.com/arielonoriaga/claude-harness',
    what: 'Safety and self-improvement harness for AI coding agents: a guardrail hook, shared journal, test agent and review queue.',
    lang: 'Rust · Shell',
  },
  {
    name: 'lazywifi',
    href: 'https://github.com/arielonoriaga/lazywifi',
    what: 'Terminal UI for NetworkManager: wifi, ethernet, VPN and QR sharing.',
    lang: 'Rust',
  },
];

export const hotbar = ['Rust', 'TypeScript', 'Go', 'SQL', 'Python', 'Postgres', 'AWS', 'Terraform', 'Docker'];

export const skills = [
  ['Backend', 'Axum, SQLx, Tokio, Hono, Drizzle · PostgreSQL, DynamoDB, Redis · GraphQL, MQTT, queues, outbox, idempotency'],
  ['Frontend', 'SolidJS, Svelte, Vue, Astro · Phaser, PixiJS · PWA and offline sync'],
  ['Cloud and ops', 'AWS (Lambda, API Gateway, DynamoDB, Aurora, ECS, CloudFront, IoT Core, SQS/SNS) · Terraform · GitHub Actions'],
  ['Practices', 'Domain-driven and hexagonal design · property and mutation testing · AI-agent workflows with review gates'],
];

export const site = 'https://arielonoriaga.huggian.com';
export const person = {
  name: 'Ariel Onoriaga',
  role: 'Senior Rust engineer for payments, billing and commerce backends',
  years: 7,
  location: 'Argentina (UTC−3), working US hours',
  availability: 'About 20 hours a week, on contract or a monthly retainer',
  github: 'https://github.com/arielonoriaga',
  linkedin: 'https://www.linkedin.com/in/arielonoriaga/',
  crates: 'https://crates.io/users/arielonoriaga',
};
export const description =
  'Ariel Onoriaga: senior Rust and TypeScript engineer for payments, billing and commerce backends. Seven years in, available on contract to US teams.';
export const summary =
  'I build and run the systems where mistakes cost money: payments, billing, commerce, and the infrastructure under them. Seven years in, running the five-product Huggian suite alone and shipping gaming systems that passed GLI certification.';

// Pre-filled enquiry: a three-line brief is all I ask for.
export const mailto =
  `mailto:${email}?subject=${encodeURIComponent('Contract work: [your company]')}` +
  `&body=${encodeURIComponent("What we're building:\n\nWhat's stuck:\n\nTimeline:\n")}`;

export const offers = [
  {
    title: 'Payments that survive retries',
    text: 'Payment-provider integrations built so a timeout, a duplicate webhook or a retry never charges twice or loses an order: idempotency keys, guarded state transitions and a transactional outbox for the events that follow.',
    proof: 'Done in Ez-Commerce, in production.',
  },
  {
    title: 'Billing and subscriptions',
    text: 'Plans, subscriptions, quotas, invoicing and the tax or fiscal integration behind them.',
    proof: 'Done in the platform behind my own products.',
  },
  {
    title: 'Fewer services, in Rust',
    text: 'Consolidating backend services into one Rust codebase while they stay live: phased cutover, a verification gate before traffic moves, old services retired one at a time.',
    proof: 'Done: three services into one binary.',
  },
];

export const faq = [
  {
    q: 'Who is Ariel Onoriaga?',
    a: 'A senior Rust and TypeScript engineer with seven years of experience, based in Argentina. He builds payments, billing and commerce backends, founded the software company Huggian, and is a core engineer on a real-money gaming platform on AWS.',
  },
  {
    q: 'Is Ariel available for contract work?',
    a: 'Yes. About 20 hours a week, on an hourly contract or a monthly retainer, working with US teams. He is in UTC−3, which overlaps the US business day.',
  },
  {
    q: 'What kind of work does he take on?',
    a: 'Payment-provider integrations, billing and subscription systems, multi-tenant commerce backends, and consolidating or migrating services to Rust. He also takes responsibility for the deploy pipeline and operations around that work.',
  },
  {
    q: 'How does an engagement start?',
    a: 'Email three lines: what you are building, what is stuck, and your timeline. He replies within two days with a yes, a no, or a time for a 20-minute call. Work starts with one scoped piece so both sides can judge the fit.',
  },
  {
    q: 'Most of his code is private. What can I look at?',
    a: 'Four open-source projects, including lazyfetch, a seven-crate Rust workspace published on crates.io. Ez-Commerce is live in production, and he can walk through its architecture on a call.',
  },
  {
    q: 'Has he worked in regulated environments?',
    a: 'Yes. He co-developed RNG and game-math services for gaming products that passed GLI certification, and built government tax-invoicing integration into a commerce platform.',
  },
  {
    q: 'How does he use AI in his work?',
    a: 'He works AI-augmented: agents write a lot of the code, while he owns the architecture, the review and the test gates. That is how one engineer can responsibly run a large surface area.',
  },
];
