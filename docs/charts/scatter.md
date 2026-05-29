# Scatter & Bubble Chart

`ScatterChart` plots each row as a point at `(x, y)`. With a `size` key it becomes a **bubble
chart**, where the point area is proportional to the value. It uses a numeric x-axis by default
and shares the [cartesian options](/charts/line#props) with the other charts.

<script setup>
const points = [
  { x: 5, y: 12, pop: 20 },
  { x: 12, y: 28, pop: 60 },
  { x: 18, y: 16, pop: 35 },
  { x: 24, y: 40, pop: 90 },
  { x: 31, y: 33, pop: 45 },
  { x: 38, y: 52, pop: 120 },
  { x: 45, y: 41, pop: 70 },
  { x: 52, y: 61, pop: 150 },
]

const groups = [
  { x: 5, alpha: 12, beta: 30 },
  { x: 14, alpha: 22, beta: 18 },
  { x: 23, alpha: 33, beta: 41 },
  { x: 32, alpha: 28, beta: 52 },
  { x: 41, alpha: 47, beta: 38 },
  { x: 50, alpha: 41, beta: 63 },
]
</script>

## Basic

<Demo title="Scatter plot (numeric x & y)">
  <ScatterChart :data="points" x="x" :series="['y']" :height="320" :legend="false" />
</Demo>

```vue
<ScatterChart :data="data" x="x" :series="['y']" />
```

## Bubble chart

Add a `size` key and points scale by **area** (a square-root radius scale):

<Demo title="Bubble chart (size = population)">
  <ScatterChart
    :data="points"
    x="x"
    :series="[{ key: 'y', name: 'Cities' }]"
    size="pop"
    :size-range="[6, 32]"
    :height="340"
  />
</Demo>

```vue
<ScatterChart
  :data="data"
  x="x"
  :series="['y']"
  size="pop"
  :size-range="[6, 32]"
/>
```

## Multiple series

<Demo title="Two point series">
  <ScatterChart
    :data="groups"
    x="x"
    :series="[
      { key: 'alpha', name: 'Group A' },
      { key: 'beta', name: 'Group B' },
    ]"
    :point-radius="7"
    :height="340"
  />
</Demo>

```vue
<ScatterChart
  :data="data"
  x="x"
  :series="['alpha', 'beta']"
  :point-radius="7"
/>
```

## Scatter-specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string` | — | Data key for bubble radius (omit for fixed-size points). |
| `sizeRange` | `[number, number]` | `[4, 22]` | Min/max radius in px when `size` is used. |
| `pointRadius` | `number` | `5` | Radius when `size` is not used. |
| `fillOpacity` | `number` | `0.7` | Point fill opacity. |
| `xType` | `'linear' \| 'time' \| 'category'` | `'linear'` | x-axis type. |

All other props (`data`, `x`, `series`, `theme`, `palette`, `xAxis`, `yAxis`, `grid`, `legend`,
`tooltip`, `animate`, …) match [LineChart](/charts/line#props).
