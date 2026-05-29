# Bar Chart

`BarChart` draws vertical bars (columns) on a band x-axis. Multiple series are **grouped**
side by side by default, or **stacked**. Bars grow from the baseline with a smooth entrance
animation and have configurable rounded corners.

<script setup>
const data = [
  { quarter: 'Q1', north: 44, south: 31, west: 28 },
  { quarter: 'Q2', north: 55, south: 42, west: 35 },
  { quarter: 'Q3', north: 41, south: 38, west: 47 },
  { quarter: 'Q4', north: 67, south: 52, west: 44 },
]
const single = data.map((d) => ({ quarter: d.quarter, north: d.north }))
</script>

## Basic

<Demo title="Single series">
  <BarChart :data="single" x="quarter" :series="['north']" :height="300" :legend="false" />
</Demo>

```vue
<BarChart :data="data" x="quarter" :series="['north']" />
```

## Grouped

<Demo title="Grouped bars">
  <BarChart
    :data="data"
    x="quarter"
    :series="[
      { key: 'north', name: 'North' },
      { key: 'south', name: 'South' },
      { key: 'west', name: 'West' },
    ]"
    :height="320"
  />
</Demo>

```vue
<BarChart :data="data" x="quarter" :series="['north', 'south', 'west']" />
```

## Stacked

<Demo title="Stacked bars">
  <BarChart
    :data="data"
    x="quarter"
    :series="['north', 'south', 'west']"
    stacked
    :height="320"
  />
</Demo>

```vue
<BarChart :data="data" x="quarter" :series="['north', 'south', 'west']" stacked />
```

## Rounded corners & spacing

<div class="ag-demo-grid">
  <Demo title="radius = 10">
    <BarChart :data="single" x="quarter" :series="['north']" :radius="10" :height="240" :legend="false" />
  </Demo>
  <Demo title="radius = 0, wider bars">
    <BarChart :data="single" x="quarter" :series="['north']" :radius="0" :height="240" :legend="false" :x-axis="{ padding: 0.05 }" />
  </Demo>
</div>

```vue
<!-- pill-like bars -->
<BarChart :data="data" x="quarter" :series="['north']" :radius="10" />

<!-- square, wide bars (less band padding) -->
<BarChart :data="data" x="quarter" :series="['north']" :radius="0" :x-axis="{ padding: 0.05 }" />
```

## Bar-specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `stacked` | `boolean` | `false` | Stack bars instead of grouping. |
| `radius` | `number` | `3` | Corner radius (px). |
| `groupPadding` | `number` | `0.15` | Gap between grouped bars (0–1 of each slot). |

Band spacing between categories is controlled via `:x-axis="{ padding: 0.2 }"` (0–1). All
other props match [LineChart](/charts/line#props).
