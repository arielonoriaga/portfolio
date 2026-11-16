// The write-ups, newest first. Each entry has a matching Markdown file in src/pages/writing/.
export const posts = [
  {
    slug: 'payments-that-survive-retries',
    title: 'Payments that survive retries: idempotency keys and a transactional outbox in Rust',
    description:
      'How a commerce backend avoids double charges and lost orders when requests, webhooks and workers are all allowed to retry.',
    date: '2026-11-16',
  },
  {
    slug: 'four-services-into-one-rust-binary',
    title: 'Four services into one Rust binary: a phased live migration',
    description:
      'Why I merged four separately deployed services into a single Rust API and worker, and how the cutover went without taking anything down.',
    date: '2026-11-16',
  },
];
