# Installation

## Requirements

- **Vue** `^3.4` (Vue 3.5+ recommended)
- A bundler that understands ESM (Vite, Rollup, webpack 5, Nuxt, …)

## Add the package

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

## Import the styles

Awesome Graphs ships a single small stylesheet that defines the default CSS variables and
component styles. Import it **once** in your app entry:

```ts
import 'awesome-graphs-vue3/style.css'
```

## Two ways to use it

### 1. Named imports (tree-shakable, recommended)

Only the charts you import end up in your bundle:

```vue
<script setup>
import { LineChart, BarChart } from 'awesome-graphs-vue3'
</script>
```

### 2. Global plugin

Register everything once and use the components anywhere:

```ts
import AwesomeGraphs from 'awesome-graphs-vue3'

app.use(AwesomeGraphs, {
  theme: 'light', //  app-wide theme (optional)
  prefix: '', //  e.g. 'Ag' -> <AgLineChart> (optional)
})
```

## What's exported

| Export | Description |
| --- | --- |
| `LineChart`, `AreaChart`, `BarChart`, `PieChart` | Ready-to-use chart components |
| `CartesianChart` | The shared workhorse with slot props for custom cartesian charts |
| `Axis`, `CartesianGrid`, `ChartLegend`, `ChartTooltip` | Composable primitives |
| `useTheme`, `provideTheme`, `useElementSize`, `useTooltip`, … | Composables |
| `lightTheme`, `darkTheme`, `resolveTheme`, `palettes` | Theme system |
| `createLinearScale`, `linePath`, `computePie`, … | The headless [core](/guide/headless) |
| `AwesomeGraphs` (default export) | The Vue install plugin |

## TypeScript

The package ships full type declarations — props, slot props, theme and core helpers are all
typed. No extra `@types` package needed.

## Nuxt

Awesome Graphs is SSR-safe and works in Nuxt with a one-line plugin. See the
[Nuxt guide](/guide/nuxt).
