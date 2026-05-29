# Pie & Donut Chart

`PieChart` renders proportional slices. It takes a `value` key and an optional `label` key,
supports a donut hole, slice labels (percent / value / name), padding and rounded corners, an
interactive legend and a sweep-in animation.

<script setup>
const traffic = [
  { source: 'Organic', visits: 4200 },
  { source: 'Direct', visits: 2600 },
  { source: 'Referral', visits: 1500 },
  { source: 'Social', visits: 1100 },
  { source: 'Email', visits: 700 },
]
</script>

## Basic pie

<Demo title="Pie with percent labels">
  <PieChart :data="traffic" value="visits" label="source" :height="320" />
</Demo>

```vue
<script setup>
import { PieChart } from 'awesome-graphs-vue3'
import 'awesome-graphs-vue3/style.css'

const traffic = [
  { source: 'Organic', visits: 4200 },
  { source: 'Direct', visits: 2600 },
  { source: 'Referral', visits: 1500 },
  { source: 'Social', visits: 1100 },
  { source: 'Email', visits: 700 },
]
</script>

<template>
  <PieChart :data="traffic" value="visits" label="source" />
</template>
```

## Donut

Pass `donut` for a 60% hole, or a custom ratio like `:donut="0.75"`.

<div class="ag-demo-grid">
  <Demo title="donut">
    <PieChart :data="traffic" value="visits" label="source" donut :height="300" :legend="false" />
  </Demo>
  <Demo title="donut = 0.8, padded, rounded">
    <PieChart :data="traffic" value="visits" label="source" :donut="0.8" :pad-angle="0.02" :corner-radius="6" label-type="none" :height="300" :legend="false" />
  </Demo>
</div>

```vue
<PieChart :data="traffic" value="visits" label="source" donut />

<!-- thin, padded, rounded ring with no labels -->
<PieChart
  :data="traffic"
  value="visits"
  label="source"
  :donut="0.8"
  :pad-angle="0.02"
  :corner-radius="6"
  label-type="none"
/>
```

## Labels & sorting

`labelType` can be `'percent'` (default), `'value'`, `'name'` or `'none'`. Use `valueFormat`
(a [d3 format](https://d3js.org/d3-format) string or function) to format values, and `sort`
to order slices by size.

<Demo title="value labels, sorted, custom format">
  <PieChart
    :data="traffic"
    value="visits"
    label="source"
    label-type="value"
    value-format=",d"
    sort
    :height="320"
  />
</Demo>

```vue
<PieChart
  :data="traffic"
  value="visits"
  label="source"
  label-type="value"
  value-format=",d"
  sort
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `Array<Record<string, any>>` | — | Slice rows. |
| `value` | `string` | — | Data key for the numeric value. |
| `label` | `string` | `'name'` | Data key for the slice label. |
| `donut` | `boolean \| number` | `false` | Donut hole; `true` = 0.6 ratio, or a custom 0–1 ratio. |
| `padAngle` | `number` | `0` | Gap between slices (radians). |
| `cornerRadius` | `number` | `0` | Slice corner radius (px). |
| `startAngle` / `endAngle` | `number` | `0` / `360` | Sweep range in degrees. |
| `sort` | `boolean` | `false` | Sort slices by value descending. |
| `showLabels` | `boolean` | `true` | Render slice labels. |
| `labelType` | `'percent' \| 'value' \| 'name' \| 'none'` | `'percent'` | What the label shows. |
| `valueFormat` | `string \| (v, i) => string` | — | Value formatter (labels & tooltip). |
| `legend` | `boolean \| LegendConfig` | `true` | Interactive legend (toggles slices). |
| `tooltip` | `boolean \| TooltipConfig` | `true` | Hover tooltip with value & percent. |
| `theme` / `palette` / `animate` / `width` / `height` | — | — | As on the other charts. |
