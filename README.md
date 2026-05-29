<div align="center">

# 📊 Awesome Graphs for Vue 3

**A highly customizable, SVG-first chart library for Vue 3 — beautiful, crisp, accessible & Nuxt-ready.**

[![CI](https://github.com/shroomlife/awesome-graphs-vue3/actions/workflows/ci.yml/badge.svg)](https://github.com/shroomlife/awesome-graphs-vue3/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)

[**📖 Documentation & live examples →**](https://shroomlife.github.io/awesome-graphs-vue3/)

</div>

---

## Why Awesome Graphs?

- 🎨 **Super customizable** — theme every pixel via CSS variables and theme objects; per-series colors, curves, gradients, palettes, axes, legends and tooltips.
- ✨ **SVG-first & crisp** — razor sharp at any zoom and DPI, styleable with plain CSS, interactive through the DOM.
- 🧩 **Batteries included _and_ headless** — drop-in `LineChart`, `AreaChart`, `BarChart` & `PieChart`, or compose your own from primitives and a pure, d3-powered core.
- ⚡ **Tiny & tree-shakable** — ESM, ~14 kB gzipped, import only what you use.
- 🌙 **Light & dark themes** — smooth entrance animations that respect `prefers-reduced-motion`, toggleable legends, interactive tooltips with crosshair.
- 💚 **Nuxt & SSR ready** — server-side-rendering safe out of the box.
- 🔒 **Fully typed** — strict TypeScript, typed props, slot props and theme.

## Installation

```bash
pnpm add awesome-graphs-vue3
# or: npm install / yarn add
```

## Quick start

```vue
<script setup>
import { LineChart } from 'awesome-graphs-vue3'
import 'awesome-graphs-vue3/style.css'

const data = [
  { month: 'Jan', sales: 30, profit: 12 },
  { month: 'Feb', sales: 52, profit: 20 },
  { month: 'Mar', sales: 41, profit: 17 },
  { month: 'Apr', sales: 64, profit: 28 },
]
</script>

<template>
  <LineChart
    :data="data"
    x="month"
    :series="[
      { key: 'sales', name: 'Sales' },
      { key: 'profit', name: 'Profit' },
    ]"
  />
</template>
```

You get axes, gridlines, a legend, an interactive tooltip with crosshair and a smooth entrance
animation — out of the box.

### Or register globally

```ts
import { createApp } from 'vue'
import AwesomeGraphs from 'awesome-graphs-vue3'
import 'awesome-graphs-vue3/style.css'

createApp(App).use(AwesomeGraphs, { theme: 'light' }).mount('#app')
```

## Charts

| Chart | Highlights |
| --- | --- |
| **LineChart** | curves, point markers, dashed strokes, multi-series, time/linear/category x |
| **AreaChart** | gradient fills, stacking, top outline |
| **BarChart** | grouped & stacked, rounded corners, grow-from-baseline animation |
| **PieChart** | pie & donut, slice labels (%/value/name), padding, rounded corners |

Plus the headless `CartesianChart` (typed slot props) and primitives (`Axis`, `CartesianGrid`,
`ChartLegend`, `ChartTooltip`) to build entirely custom charts. See the
[documentation](https://shroomlife.github.io/awesome-graphs-vue3/) for live examples.

## Nuxt

Awesome Graphs is SSR-safe. Add a one-line plugin:

```ts
// plugins/awesome-graphs.ts
import AwesomeGraphs from 'awesome-graphs-vue3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(AwesomeGraphs)
})
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['awesome-graphs-vue3/style.css'],
  build: { transpile: ['awesome-graphs-vue3'] },
})
```

See the [Nuxt guide](https://shroomlife.github.io/awesome-graphs-vue3/guide/nuxt) for a ready-made module too.

## Theming

```vue
<!-- named theme -->
<LineChart :data="data" x="month" :series="['sales']" theme="dark" />

<!-- partial override -->
<LineChart :data="data" x="month" :series="['sales']" :theme="{ palette: ['#ec4899', '#8b5cf6'] }" />
```

```css
/* …or just override CSS variables */
.ag-chart {
  --ag-grid: #eef2ff;
  --ag-tooltip-radius: 14px;
}
```

## Development

```bash
pnpm install        # install deps
pnpm test           # run unit + component + SSR tests (Vitest)
pnpm typecheck      # vue-tsc strict typecheck
pnpm build          # build the library (ESM + CJS + types + CSS)
pnpm docs:dev       # run the docs site locally
pnpm docs:build     # build the docs site
```

### Enabling GitHub Pages

The docs deploy automatically on every push to `main` via
[`.github/workflows/docs.yml`](./.github/workflows/docs.yml). One-time setup: in the repo
**Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.

## License

[MIT](./LICENSE) © shroomlife
