// /llms.txt: a plain-text summary for AI assistants and answer engines, generated from
// the same data as the pages so the facts cannot drift.
import type { APIRoute } from 'astro';
import { posts } from '../data/writing';
import { contributions, ezCommerce, shopRhythm, workspaceSplitBench } from '../data/proof';
import { email, site, person, summary, offers, faq, huggianModules, mainQuest, workspaceSplit, crafting, sideQuests, experience, openSource, hotbar, skills } from '../data/profile';

export const GET: APIRoute = () => {
  const projects = [mainQuest, workspaceSplit, crafting, ...sideQuests];
  const out = [
    `# ${person.name}`,
    '',
    `> ${person.role}. ${person.years} years of professional experience. Based in ${person.location}. ${person.availability}.`,
    '',
    summary,
    '',
    '## Contact',
    `- Email: ${email}`,
    `- Website: ${site}/`,
    `- CV: ${site}/cv/ (PDF: ${site}/ariel-onoriaga-cv.pdf)`,
    `- GitHub: ${person.github}`,
    `- LinkedIn: ${person.linkedin}`,
    `- crates.io: ${person.crates}`,
    '',
    '## Shipping record',
    `- ${contributions.total} GitHub contributions between ${contributions.from} and ${contributions.to}, on ${contributions.activeDays} days: ${contributions.work} at his day job and ${contributions.personal} on his own products (two accounts, nearly all private repositories).`,
    `- Ez-Commerce (as of ${ezCommerce.asOf}): ${ezCommerce.releases} production releases, ${ezCommerce.migrations} database migrations, ${ezCommerce.commits60d} commits in the last 60 days, ${ezCommerce.crates} Cargo workspace crates and ${ezCommerce.contexts} bounded contexts since ${ezCommerce.since}.`,
    `- Cargo workspace split (${workspaceSplitBench.asOf}, measured at ${workspaceSplitBench.crates} crates on commit ${workspaceSplitBench.commit}, median of 5 alternating pairs on the same laptop; now ${ezCommerce.crates} crates with ez-subscriptions): ${workspaceSplitBench.scenarios.map((s) => `${s.label} ${s.beforeSec.toFixed(2)}s -> ${s.afterSec.toFixed(2)}s (${s.speedup})`).join('; ')}.`,
    `- Shops using Ez-Commerce recorded ${shopRhythm.sales} sales over ${shopRhythm.days} days (to ${shopRhythm.asOf}) across ${shopRhythm.shops} shops.`,
    '',
    '## Huggian modules',
    ...huggianModules.map((m) => `- [${m.name}](${m.href}) (${m.kind}): ${m.summary} Technical: ${m.built}`),
    '',
    '## What he does for clients',
    ...offers.map((o) => `- ${o.title}: ${o.text}`),
    '',
    '## Selected work',
    ...projects.map((w) => `- ${w.title} (${w.stack.join(', ')}): ${w.summary}`),
    '',
    '## Experience',
    ...experience.flatMap((e) => [`- ${e.role} (${e.when})`, ...e.points.map((p) => `  - ${p}`)]),
    '',
    '## Open source',
    ...openSource.map((o) => `- [${o.name}](${o.href}) (${o.lang}): ${o.what}`),
    '',
    '## Writing',
    ...posts.map((p) => `- [${p.title}](${site}/writing/${p.slug}/): ${p.description}`),
    '',
    '## Skills',
    `- Core: ${hotbar.join(', ').replace('Postgres', 'PostgreSQL')}`,
    ...skills.map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Frequently asked questions',
    ...faq.flatMap((f) => [`### ${f.q}`, f.a, '']),
  ].join('\n');
  return new Response(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
