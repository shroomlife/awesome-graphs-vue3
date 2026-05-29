# Using with Nuxt

Awesome Graphs is **server-side-rendering safe** out of the box. Every browser-only API
(`ResizeObserver`, `requestAnimationFrame`, `matchMedia`) is guarded, charts render to a string
without a DOM, and there are no hydration mismatches. That makes it a first-class citizen in
Nuxt 3 / 4.

## Recommended: a Nuxt plugin

Create a plugin that installs the components globally:

```ts
// plugins/awesome-graphs.ts
import AwesomeGraphs from 'awesome-graphs-vue3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(AwesomeGraphs, {
    theme: 'light', // optional app-wide theme
  })
})
```

Add the stylesheet (and transpile the package, which keeps SSR happy) in your Nuxt config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['awesome-graphs-vue3/style.css'],
  build: {
    transpile: ['awesome-graphs-vue3'],
  },
})
```

Now use the charts in any component or page — no imports needed:

```vue
<template>
  <LineChart :data="data" x="month" :series="['sales', 'profit']" />
</template>

<script setup lang="ts">
const data = [
  { month: 'Jan', sales: 30, profit: 12 },
  { month: 'Feb', sales: 52, profit: 20 },
]
</script>
```

## Alternative: named imports

If you'd rather not register globally, just import the charts where you use them. Still add the
CSS and `transpile` entry from above:

```vue
<script setup lang="ts">
import { LineChart } from 'awesome-graphs-vue3'
</script>
```

## Alternative: a local Nuxt module

Prefer a module? Drop this file in `modules/` — it registers the plugin and CSS for you:

```ts
// modules/awesome-graphs.ts
import { defineNuxtModule, addPluginTemplate } from '@nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'awesome-graphs', configKey: 'awesomeGraphs' },
  defaults: { theme: 'light' },
  setup(options, nuxt) {
    nuxt.options.css.push('awesome-graphs-vue3/style.css')
    nuxt.options.build.transpile.push('awesome-graphs-vue3')

    addPluginTemplate({
      filename: 'awesome-graphs.plugin.mjs',
      getContents: () => `
import { defineNuxtPlugin } from '#app'
import AwesomeGraphs from 'awesome-graphs-vue3'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(AwesomeGraphs, ${JSON.stringify(options)})
})`,
    })
  },
})
```

Then configure it (optional):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['~/modules/awesome-graphs'],
  awesomeGraphs: { theme: 'dark' },
})
```

## Responsive sizing & SSR

By default a chart fills its container and measures the available width in the browser. During
SSR the width isn't known yet, so the SVG is rendered on the **client** right after mount — the
server output and the first client render agree (an empty plot box), so there's **no hydration
warning**.

A few tips:

- **Reserve space** to avoid layout shift by giving the chart a fixed `height` (the default is
  `320`) and, if you like, an explicit `width` or `aspectRatio`.
- For a fully server-rendered SVG, pass an explicit `:width` and `:height` — then the chart
  renders on the server too.
- You can always wrap a chart in Nuxt's `<ClientOnly>` if you want to skip SSR for it entirely.

## Reduced motion

Entrance animations automatically disable when the user has `prefers-reduced-motion: reduce`
set, on both client and server. You can also turn them off per chart with `:animate="false"`.
