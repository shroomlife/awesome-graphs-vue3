# Area Chart

`AreaChart` fills the region under each line. It supports gradient fills, stacking, smooth
curves and per-series styling. It shares all the [cartesian options](/charts/line#props) with
`LineChart`, plus the area-specific props below.

<script setup>
const data = [
  { month: 'Jan', product: 42, services: 18, support: 9 },
  { month: 'Feb', product: 55, services: 25, support: 12 },
  { month: 'Mar', product: 48, services: 30, support: 14 },
  { month: 'Apr', product: 70, services: 35, support: 16 },
  { month: 'May', product: 92, services: 41, support: 20 },
  { month: 'Jun', product: 88, services: 52, support: 24 },
]
const single = data.map((d) => ({ month: d.month, product: d.product }))
</script>

## Basic

<Demo title="Gradient area">
  <AreaChart :data="single" x="month" :series="['product']" :height="300" :legend="false" />
</Demo>

```vue
<AreaChart :data="data" x="month" :series="['product']" />
```

The fill defaults to a vertical **gradient** that fades to transparent. Disable it with
`:gradient="false"` to get a flat translucent fill instead.

## Stacked

Set `stacked` to stack the series; the y-axis becomes the cumulative total.

<Demo title="Stacked areas">
  <AreaChart
    :data="data"
    x="month"
    :series="[
      { key: 'product', name: 'Product' },
      { key: 'services', name: 'Services' },
      { key: 'support', name: 'Support' },
    ]"
    stacked
    :height="320"
  />
</Demo>

```vue
<AreaChart
  :data="data"
  x="month"
  :series="['product', 'services', 'support']"
  stacked
/>
```

## Flat fill, no outline

<div class="ag-demo-grid">
  <Demo title="gradient = false">
    <AreaChart :data="single" x="month" :series="['product']" :gradient="false" :fill-opacity="0.25" :height="240" :legend="false" />
  </Demo>
  <Demo title="line = false">
    <AreaChart :data="single" x="month" :series="['product']" :line="false" :height="240" :legend="false" />
  </Demo>
</div>

```vue
<!-- flat translucent fill -->
<AreaChart :data="data" x="month" :series="['product']" :gradient="false" :fill-opacity="0.25" />

<!-- fill only, no top stroke -->
<AreaChart :data="data" x="month" :series="['product']" :line="false" />
```

## Area-specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `stacked` | `boolean` | `false` | Stack series and plot the cumulative total. |
| `gradient` | `boolean` | `true` | Vertical gradient fill fading to transparent. |
| `fillOpacity` | `number` | `0.3` | Fill opacity (gradient top stop / flat fill alpha). |
| `line` | `boolean` | `true` | Draw the top outline stroke. |
| `strokeWidth` | `number` | `2` | Outline width. |
| `curve` | `CurveType` | `'monotone'` | Curve interpolation. |

All other props (`data`, `x`, `series`, `theme`, `palette`, `xAxis`, `yAxis`, `grid`,
`legend`, `tooltip`, `animate`, …) match [LineChart](/charts/line#props).
