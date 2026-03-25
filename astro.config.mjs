// @ts-check
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      external: ['three'],
    },
    build: {
      minify: 'terser',
      sourcemap: false,
    },
  },

  integrations: [solidJs()],

  output: 'static',

  // Optimization
  compressHTML: true,

  build: {
    assets: '_astro',
    inlineAssets: true,
  },

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
