# Line Chart

`LineChart` plots one or more series as lines. It supports smooth curves, point markers,
dashed strokes, multiple series, time/linear/category x-axes and everything the shared
[cartesian options](#props) offer.

<script setup>
const data = [
  { month: 'Jan', sales: 30, profit: 12, churn: 8 },
  { month: 'Feb', sales: 52, profit: 20, churn: 6 },
  { month: 'Mar', sales: 41, profit: 17, churn: 9 },
  { month: 'Apr', sales: 64, profit: 28, churn: 5 },
  { month: 'May', sales: 81, profit: 36, churn: 7 },
  { month: 'Jun', sales: 75, profit: 40, churn: 4 },
]

const single = data.map((d) => ({ month: d.month, sales: d.sales }))
</script>

## Basic

<Demo title="Single series, smooth curve, point markers">
  <LineChart :data="single" x="month" :series="['sales']" show-points :height="300" />
</Demo>

```vue
<LineChart :data="data" x="month" :series="['sales']" show-points />
```

## Multiple series

<Demo title="Three series with an interactive legend">
  <LineChart
    :data="data"
    x="month"
    :series="[
      { key: 'sales', name: 'Sales' },
      { key: 'profit', name: 'Profit' },
      { key: 'churn', name: 'Churn' },
    ]"
    :height="320"
  />
</Demo>

Click a legend entry to toggle a series on and off — the y-axis rescales automatically.

## Curves

Set `curve` for the whole chart, or per series. Available curves: `linear`, `monotone`
(default), `smooth`, `natural`, `step`, `stepBefore`, `stepAfter`, `basis`, `cardinal`.

<div class="ag-demo-grid">
  <Demo title="curve = linear">
    <LineChart :data="single" x="month" :series="['sales']" curve="linear" :height="240" :legend="false" />
  </Demo>
  <Demo title="curve = step">
    <LineChart :data="single" x="month" :series="['sales']" curve="step" :height="240" :legend="false" />
  </Demo>
</div>

```vue
<LineChart :data="data" x="month" :series="['sales']" curve="step" />
```

## Dashed & custom styling

Per-series options override the chart defaults:

<Demo title="Per-series color, width, dash & curve">
  <LineChart
    :data="data"
    x="month"
    :height="320"
    :series="[
      { key: 'sales', name: 'Sales', color: '#6366f1', strokeWidth: 3 },
      { key: 'profit', name: 'Profit (forecast)', color: '#f59e0b', dashed: true, curve: 'linear' },
    ]"
  />
</Demo>

```vue
<LineChart
  :data="data"
  x="month"
  :series="[
    { key: 'sales', name: 'Sales', color: '#6366f1', strokeWidth: 3 },
    { key: 'profit', name: 'Profit', color: '#f59e0b', dashed: true, curve: 'linear' },
  ]"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `Array<Record<string, any>>` | — | The rows to plot. |
| `x` | `string` | — | Data key for the x value. |
| `series` | `(string \| SeriesConfig)[]` | — | Series to draw. A string is shorthand for `{ key }`. |
| `curve` | `CurveType` | `'monotone'` | Default curve interpolation. |
| `strokeWidth` | `number` | `2` | Default line width. |
| `showPoints` | `boolean` | `false` | Render a marker at every vertex. |
| `pointRadius` | `number` | `3` | Marker radius. |
| `xType` | `'category' \| 'linear' \| 'time'` | `'category'` | How x values are interpreted. |
| `height` | `number` | `320` | Plot height (px). |
| `width` | `number` | _responsive_ | Fixed width; omit to fill the container. |
| `theme` | `string \| Partial<ChartTheme>` | `'light'` | See [Theming](/guide/theming). |
| `palette` | `string \| string[]` | theme palette | Series colors. |
| `xAxis` / `yAxis` | `AxisConfig` | `{}` | Axis configuration. |
| `grid` | `boolean \| { x?, y? }` | `true` | Grid lines. |
| `legend` | `boolean \| LegendConfig` | auto | Legend. |
| `tooltip` | `boolean \| TooltipConfig` | `true` | Hover tooltip. |
| `animate` | `boolean` | `true` | Entrance animation. |

### `SeriesConfig`

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Data key for the series value. |
| `name` | `string` | Legend & tooltip label. |
| `color` | `string` | Override color. |
| `curve` | `CurveType` | Per-series curve. |
| `strokeWidth` | `number` | Per-series stroke width. |
| `dashed` | `boolean \| number[]` | Dashed stroke (or explicit dash array). |
| `showPoints` | `boolean` | Per-series markers. |
