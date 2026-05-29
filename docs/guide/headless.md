# Headless & Composables

Awesome Graphs is built in layers. The polished chart components sit on top of a
**framework-agnostic core** (pure functions built on the standalone d3 math modules) and a set
of **composables** and **primitives**. When the built-in charts aren't enough, drop down a
level and build exactly what you need.

## Compose with `CartesianChart`

`CartesianChart` does all the heavy lifting — sizing, scales, axes, grid, legend, tooltip and
hover detection — and hands you a fully-resolved drawing context through its default slot. You
just render the series geometry.

<script setup>
const data = [
  { month: 'Jan', value: 30 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 41 },
  { month: 'Apr', value: 64 },
  { month: 'May', value: 81 },
  { month: 'Jun', value: 75 },
]
</script>

<Demo title="A custom lollipop chart, built from the slot">
  <CartesianChart :data="data" x="month" :series="['value']" category-scale="point" :y-baseline="true" :height="300" :legend="false">
    <template #default="{ xPositions, yScale, baseline, series, progress }">
      <g v-for="s in series" :key="s.key">
        <line
          v-for="(row, i) in data"
          :key="'l' + i"
          :x1="xPositions[i]"
          :x2="xPositions[i]"
          :y1="baseline"
          :y2="baseline + (yScale(row[s.key]) - baseline) * progress"
          :stroke="s.color"
          stroke-width="2"
        />
        <circle
          v-for="(row, i) in data"
          :key="'c' + i"
          :cx="xPositions[i]"
          :cy="baseline + (yScale(row[s.key]) - baseline) * progress"
          :r="6"
          :fill="s.color"
        />
      </g>
    </template>
  </CartesianChart>
</Demo>

```vue
<CartesianChart :data="data" x="month" :series="['value']" category-scale="point" :y-baseline="true">
  <template #default="{ xPositions, yScale, baseline, series, progress }">
    <g v-for="s in series" :key="s.key">
      <line
        v-for="(row, i) in data"
        :key="'l' + i"
        :x1="xPositions[i]"
        :x2="xPositions[i]"
        :y1="baseline"
        :y2="baseline + (yScale(row[s.key]) - baseline) * progress"
        :stroke="s.color"
        stroke-width="2"
      />
      <circle
        v-for="(row, i) in data"
        :key="'c' + i"
        :cx="xPositions[i]"
        :cy="baseline + (yScale(row[s.key]) - baseline) * progress"
        :r="6"
        :fill="s.color"
      />
    </g>
  </template>
</CartesianChart>
```

### Slot props

| Prop | Type | Description |
| --- | --- | --- |
| `bounds` | `Bounds` | Inner plot rectangle (`left`, `top`, `right`, `bottom`, `width`, `height`). |
| `xScale` | d3 scale | The resolved x scale (band / point / linear / time). |
| `yScale` | `ScaleLinear` | The resolved y scale. |
| `series` | `SeriesMeta[]` | Visible series with resolved `color` & index. |
| `xValues` | `Primitive[]` | Raw x value per row. |
| `xPositions` | `number[]` | Pixel x (band center) per row. |
| `bandwidth` | `number` | Band width (0 for non-band scales). |
| `baseline` | `number` | Pixel y of zero. |
| `stacked` / `stacks` | `boolean` / `Map` | Stacking info (when enabled). |
| `hoveredIndex` | `number` | Currently hovered row, or `-1`. |
| `progress` | `number` | Entrance animation progress `0→1`. |
| `theme` | `ChartTheme` | The resolved theme. |
| `uid` | `string` | Unique id prefix for `<defs>` (gradients, clips). |

## The core (pure functions)

No DOM, no Vue — usable anywhere. A taste:

```ts
import {
  createLinearScale,
  createBandScale,
  generateTicks,
  linePath,
  areaPath,
  computePie,
  arcPath,
  numericExtent,
  colorAt,
  resolveFormatter,
} from 'awesome-graphs-vue3'

const x = createBandScale({ domain: ['A', 'B', 'C'], range: [0, 300], padding: 0.2 })
const y = createLinearScale({ domain: [0, 100], range: [200, 0], nice: true })
const d = linePath([[0, 0], [10, 40], [20, 15]], 'monotone')
const ticks = generateTicks(y, 5) // [{ value, offset }, …]
```

Highlights: `bounds`, scales (`createLinearScale`, `createBandScale`, `createPointScale`,
`createTimeScale`, `createLogScale`), `generateTicks`, domains (`numericExtent`, `createStack`,
`stackedExtent`, `resolveNumericDomain`), shapes (`linePath`, `areaPath`, `computePie`,
`arcPath`, `arcCentroid`), color (`palettes`, `colorAt`, `withAlpha`) and formatting
(`resolveFormatter`, `defaultNumberFormat`).

## Composables

```ts
import {
  useTheme,
  provideTheme,
  useElementSize,
  useTooltip,
  useEnterProgress,
  useTween,
} from 'awesome-graphs-vue3'
```

| Composable | Purpose |
| --- | --- |
| `useTheme(local?)` | Resolve the effective theme (prop → injected → default). |
| `provideTheme(theme)` | Provide a theme to a subtree. |
| `useElementSize(ref)` | Reactive `ResizeObserver`-based size (SSR-safe). |
| `useTooltip()` | Reactive tooltip state + `show` / `move` / `hide`. |
| `useEnterProgress(opts)` | One-shot `0→1` entrance progress (respects reduced motion). |
| `useTween(source, opts)` | Smoothly tween a number toward a reactive value. |

## Primitives

`Axis`, `CartesianGrid`, `ChartLegend` and `ChartTooltip` are exported too, so you can mix and
match them inside your own SVG.
