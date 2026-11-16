// @ts-check
import { defineConfig } from 'astro/config';

// Static, zero-JavaScript site: one page, readable without a browser engine.
export default defineConfig({
  site: 'https://arielonoriaga.huggian.com',
  output: 'static',
  compressHTML: true,
});
