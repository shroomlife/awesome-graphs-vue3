# Getting Started

**Awesome Graphs** is a highly customizable, SVG-first chart library for Vue 3. It renders
crisp vector charts, is themable down to the pixel, ships smooth animations, is accessible and
works in SSR frameworks like Nuxt.

## Install

::: code-group

```bash [pnpm]
pnpm add awesome-graphs-vue3
```

```bash [npm]
npm install awesome-graphs-vue3
```

```bash [yarn]
yarn add awesome-graphs-vue3
```

:::

## Your first chart

Import a chart component and the stylesheet, pass some `data`, tell it which key is the `x`
axis and which `series` to plot:

<script setup>
const data = [
  { month: 'Jan', sales: 30, profit: 12 },
  { month: 'Feb', sales: 52, profit: 20 },
  { month: 'Mar', sales: 41, profit: 17 },
  { month: 'Apr', sales: 64, profit: 28 },
  { month: 'May', sales: 81, profit: 36 },
  { month: 'Jun', sales: 75, profit: 40 },
]
</script>

<Demo title="LineChart">
  <LineChart
    :data="data"
    x="month"
    :series="[{ key: 'sales', name: 'Sales' }, { key: 'profit', name: 'Profit' }]"
    :height="320"
  />
</Demo>

```vue
<script setup>
import { LineChart } from 'awesome-graphs-vue3'
import 'awesome-graphs-vue3/style.css'

const data = [
  { month: 'Jan', sales: 30, profit: 12 },
  { month: 'Feb', sales: 52, profit: 20 },
  { month: 'Mar', sales: 41, profit: 17 },
  { month: 'Apr', sales: 64, profit: 28 },
  { month: 'May', sales: 81, profit: 36 },
  { month: 'Jun', sales: 75, profit: 40 },
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

That's it — you get axes, gridlines, a legend, an interactive tooltip with crosshair and a
smooth entrance animation, all out of the box.

## Global registration (optional)

Prefer to register every chart once? Use the plugin:

```ts
import { createApp } from 'vue'
import AwesomeGraphs from 'awesome-graphs-vue3'
import 'awesome-graphs-vue3/style.css'
import App from './App.vue'

createApp(App)
  .use(AwesomeGraphs, { theme: 'light' }) // optional app-wide theme
  .mount('#app')
```

Now `<LineChart>`, `<AreaChart>`, `<BarChart>` and `<PieChart>` are available everywhere
without importing them.

## The data shape

All cartesian charts (line, area, bar) consume an **array of objects** plus an `x` key and a
list of `series`:

```ts
const data = [
  { month: 'Jan', sales: 30, profit: 12 },
  { month: 'Feb', sales: 52, profit: 20 },
]

// x = 'month'
// series = [{ key: 'sales' }, { key: 'profit' }]
```

- **`x`** — the property used for the horizontal axis (a category, number or date).
- **`series`** — one entry per line/area/bar group. A bare string like `'sales'` is shorthand
  for `{ key: 'sales' }`.

`PieChart` instead takes a `value` key (and an optional `label` key). See the
[Pie & Donut](/charts/pie) page.

## Next steps

- Explore each chart: [Line](/charts/line), [Area](/charts/area), [Bar](/charts/bar),
  [Pie & Donut](/charts/pie)
- Make it yours with [Theming](/guide/theming)
- Build custom charts with the [headless core](/guide/headless)
- Use it in [Nuxt](/guide/nuxt)
