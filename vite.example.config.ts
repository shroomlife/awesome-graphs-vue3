import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// Standalone example app. It consumes the library straight from `src` via an
// alias, so `pnpm example` runs without building the package first.
export default defineConfig({
  root: r('./examples'),
  base: './',
  resolve: {
    alias: {
      // Order matters: the more specific subpath must come first.
      'awesome-graphs-vue3/style.css': r('./src/styles/base.css'),
      'awesome-graphs-vue3': r('./src/index.ts'),
    },
  },
  plugins: [vue()],
  server: { port: 5174, open: false },
  build: { outDir: r('./examples/dist'), emptyOutDir: true },
})
