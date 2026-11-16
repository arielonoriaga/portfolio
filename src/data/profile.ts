// Everything the site says about Ariel lives here, so the home page, the CV and
// llms.txt cannot drift apart. Facts mirror the verified portfolio notes:
// no employer, operator or customer names beyond what is already public.
export const email = 'onoriagaariel@gmail.com';

export const achievements = [
  { icon: 'flag', title: 'Solo run', text: 'Founded, built and operate a production SaaS alone.' },
  { icon: 'shield', title: 'Passed the audit', text: 'Shipped gaming products that passed GLI certification.' },
  { icon: 'crate', title: 'Seven crates', text: 'Published a seven-crate Rust workspace on crates.io.' },
  { icon: 'star', title: 'Fast climb', text: 'Trainee to lead of a seven-person team in under two years.' },
];

export const mainQuest = {
  title: 'Ez-Stock',
  kind: 'Main quest · multi-tenant commerce SaaS · founder, sole engineer',
  summary: 'Stock, point-of-sale and electronic invoicing for small and mid-size retailers. In production.',
  points: [
    'Rust backend (Axum, SQLx, Tokio) on PostgreSQL, organised as about 40 bounded contexts with 440+ migrations.',
    'Offline-capable POS that syncs when the connection returns.',
    'Transactional outbox with idempotency keys, payment-provider integration and government tax invoicing.',
    'Property-based and mutation testing; rollouts follow runbooks with precheck and rollback SQL.',
  ],
  stack: ['Rust', 'Axum', 'PostgreSQL', 'SolidJS', 'TypeScript'],
  link: { href: 'https://ez-stock.huggian.com', label: 'ez-stock.huggian.com' },
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
    when: 'Aug 2024 – present',
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
    when: 'Alongside',
    status: 'Active',
    points: ['Built and run the commerce, billing and infrastructure products described above, end to end.'],
  },
  {
    role: 'Trainee to team lead, PicallEx',
    when: 'Earlier',
    status: 'Completed',
    points: ['Joined as a trainee and was leading a team of seven engineers in under two years.'],
  },
  {
    role: 'Freelance engineer',
    when: 'Earlier',
    status: 'Completed',
    points: [
      'Independent client projects, including a WordPress-to-static migration that cut a client’s hosting cost by 90% and raised Lighthouse from 52 to 98.',
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
  ['Backend', 'Axum, SQLx, Tokio, Hono, Drizzle · PostgreSQL, DynamoDB, Redis · GraphQL, MQTT, queues, outbox and idempotency patterns'],
  ['Frontend', 'SolidJS, Svelte, Vue, Astro · Phaser, PixiJS · PWA and offline sync'],
  ['Cloud and ops', 'AWS (Lambda, API Gateway, DynamoDB, Aurora, ECS, CloudFront, IoT Core, SQS/SNS) · Terraform · Docker · GitHub Actions'],
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
  'I build and run the systems where mistakes cost money: payments, billing, commerce, and the infrastructure under them. Seven years in, with one production SaaS built and operated alone and gaming products that passed GLI certification.';

// Pre-filled enquiry: a three-line brief is all I ask for.
export const mailto =
  `mailto:${email}?subject=${encodeURIComponent('Contract work: [your company]')}` +
  `&body=${encodeURIComponent("What we're building:\n\nWhat's stuck:\n\nTimeline:\n")}`;

export const offers = [
  {
    title: 'Payments that survive retries',
    text: 'Payment-provider integrations built so a timeout, a duplicate webhook or a retry never charges twice or loses an order: idempotency keys, guarded state transitions and a transactional outbox for the events that follow.',
    proof: 'Done in Ez-Stock, in production.',
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
    a: 'Four open-source projects, including lazyfetch, a seven-crate Rust workspace published on crates.io. Ez-Stock is live in production, and he can walk through its architecture on a call.',
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
