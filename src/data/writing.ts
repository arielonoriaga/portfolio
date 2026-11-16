// The write-ups, newest first. Each entry has a matching Markdown file in src/pages/writing/.
export const posts = [
  {
    slug: 'payments-that-survive-retries',
    title: 'Payments that survive retries: idempotency keys, guarded transitions and an outbox in Rust',
    description:
      'How a commerce backend avoids double charges and lost orders when requests, webhooks and workers are all allowed to retry.',
    date: '2026-11-16',
  },
  {
    slug: 'three-services-one-rust-binary',
    title: 'Three services, one Rust binary: a phased live migration',
    description:
      'Why I merged three separately deployed services into a single Rust API and worker, how each cutover was gated, and the two mistakes that taught me the most.',
    date: '2026-11-16',
  },
];
