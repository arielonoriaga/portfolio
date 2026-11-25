# portfolio

Personal site of Ariel Onoriaga, senior Rust / TypeScript engineer. Static Astro site (home, CV, writing, llms.txt) with no client-side JavaScript.

```bash
bun install
bun run dev      # local preview
bun run build    # output in dist/
```

Facts live in `src/data/` (`profile.ts`, `proof.ts`, `writing.ts`) and feed every page, `llms.txt` and the CV. After changing content or design, regenerate the CV PDF and share image with `bun run build && scripts/make-assets.sh && bun run build`. Pushing to `main` deploys to GitHub Pages.

The earlier Three.js experiment is kept on the `yggdrasil-experiment` branch.
