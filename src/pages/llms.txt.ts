// /llms.txt: a plain-text summary for AI assistants and answer engines, generated from
// the same data as the pages so the facts cannot drift.
import type { APIRoute } from 'astro';
import { posts } from '../data/writing';
import { email, site, person, summary, offers, faq, mainQuest, crafting, sideQuests, experience, openSource, hotbar, skills } from '../data/profile';

export const GET: APIRoute = () => {
  const projects = [mainQuest, crafting, ...sideQuests];
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
