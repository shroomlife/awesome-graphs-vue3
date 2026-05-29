---
layout: home
hero:
  name: Awesome Graphs
  text: Stunning charts for Vue 3
  tagline: A highly customizable, SVG-first chart library — crisp at any size, themable to the pixel, accessible and Nuxt-ready.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Browse Charts
      link: /charts/line
    - theme: alt
      text: GitHub
      link: https://github.com/shroomlife/awesome-graphs-vue3
features:
  - icon: 🎨
    title: Super customizable
    details: Theme every pixel via CSS variables and theme objects. Per-series colors, curves, gradients, palettes, axes, legends and tooltips.
  - icon: ✨
    title: SVG-first & crisp
    details: Vector rendering stays razor sharp at any zoom and DPI. Styleable with plain CSS and fully interactive through the DOM.
  - icon: 🧩
    title: Batteries included + headless
    details: Drop-in LineChart, AreaChart, BarChart & PieChart — or compose your own from primitives and the headless core built on d3.
  - icon: ⚡
    title: Tiny & tree-shakable
    details: ESM, ~14 kB gzipped, no runtime dependency on full d3. Import only the charts you use.
  - icon: 🌙
    title: Light & dark themes
    details: Beautiful built-in themes, smooth entrance animations that respect prefers-reduced-motion, and toggleable legends.
  - icon: 💚
    title: Nuxt & SSR ready
    details: Server-side rendering safe out of the box. Works in Nuxt with a one-line plugin.
---

<script setup>
import { ref } from 'vue'

const revenue = [
  { month: 'Jan', product: 42, services: 18 },
  { month: 'Feb', product: 55, services: 25 },
  { month: 'Mar', product: 48, services: 30 },
  { month: 'Apr', product: 70, services: 35 },
  { month: 'May', product: 92, services: 41 },
  { month: 'Jun', product: 88, services: 52 },
]
</script>

<div style="max-width: 880px; margin: 48px auto 0;">

## See it in action

<Demo title="Area chart · gradient fill · stacked">
  <AreaChart
    :data="revenue"
    x="month"
    :series="[{ key: 'product', name: 'Product' }, { key: 'services', name: 'Services' }]"
    stacked
    :height="320"
  />
</Demo>

```vue
<script setup>
import { AreaChart } from 'awesome-graphs-vue3'
import 'awesome-graphs-vue3/style.css'

const revenue = [
  { month: 'Jan', product: 42, services: 18 },
  { month: 'Feb', product: 55, services: 25 },
  // …
]
</script>

<template>
  <AreaChart
    :data="revenue"
    x="month"
    :series="[{ key: 'product', name: 'Product' }, { key: 'services', name: 'Services' }]"
    stacked
  />
</template>
```

</div>
