# Theming

Awesome Graphs is themable on three levels, from quickest to most powerful:

1. **Named themes** — `theme="dark"`
2. **Theme overrides** — `:theme="{ palette: [...], grid: '#eee' }"`
3. **CSS variables** — override `--ag-*` in your own stylesheet

<script setup>
const data = [
  { month: 'Jan', a: 30, b: 12 },
  { month: 'Feb', a: 52, b: 20 },
  { month: 'Mar', a: 41, b: 17 },
  { month: 'Apr', a: 64, b: 28 },
  { month: 'May', a: 81, b: 36 },
]
const series = [{ key: 'a', name: 'Sales' }, { key: 'b', name: 'Profit' }]
</script>

## Named themes

Two themes ship in the box: `light` (default) and `dark`.

<Demo title='theme="dark"'>
  <div style="background:#0f172a;padding:16px;border-radius:10px">
    <LineChart :data="data" x="month" :series="series" theme="dark" :height="280" />
  </div>
</Demo>

```vue
<LineChart :data="data" x="month" :series="series" theme="dark" />
```

Set an app-wide default via the plugin:

```ts
app.use(AwesomeGraphs, { theme: 'dark' })
```

…or for a subtree with the `provideTheme` composable:

```ts
import { provideTheme } from 'awesome-graphs-vue3'
provideTheme('dark') // or a partial theme object / ref
```

## Theme overrides

Pass a partial object to tweak just what you need — it's deep-merged onto the base theme:

<Demo title="Custom palette & grid">
  <LineChart
    :data="data"
    x="month"
    :series="series"
    :theme="{ palette: ['#ec4899', '#8b5cf6'], grid: '#f1e9ff', axis: '#d8b4fe' }"
    :height="280"
  />
</Demo>

```vue
<LineChart
  :data="data"
  x="month"
  :series="series"
  :theme="{ palette: ['#ec4899', '#8b5cf6'], grid: '#f1e9ff' }"
/>
```

### Theme fields

| Field | Description |
| --- | --- |
| `palette` | `string[]` categorical colors for series |
| `foreground` | Primary text color |
| `muted` | Axis labels / secondary text |
| `grid` | Grid line color |
| `axis` | Axis line & tick color |
| `background` | Plot background (transparent by default) |
| `fontFamily`, `fontSize` | Typography |
| `tooltip` | `{ background, color, border, radius, shadow }` |

## Palettes

Use a built-in palette by name, or pass your own color array, via the `palette` prop:

<div class="ag-demo-grid">
  <Demo title='palette="vivid"'>
    <BarChart :data="data" x="month" :series="series" palette="vivid" :height="240" :legend="false" />
  </Demo>
  <Demo title='palette="pastel"'>
    <BarChart :data="data" x="month" :series="series" palette="pastel" :height="240" :legend="false" />
  </Demo>
</div>

Built-in palettes: `awesome` (default), `vivid`, `pastel`, `cool`, `warm`, `monochromeBlue`.

```vue
<BarChart :data="data" x="month" :series="series" palette="vivid" />
<BarChart :data="data" x="month" :series="series" :palette="['#06b6d4', '#f59e0b']" />
```

Per-series colors always win over the palette:

```vue
<LineChart :data="data" x="month" :series="[{ key: 'a', color: '#10b981' }]" />
```

## CSS variables

Every visual is ultimately driven by `--ag-*` custom properties set on the `.ag-chart` root.
Override them in your own CSS to restyle charts globally — no props required:

```css
.ag-chart {
  --ag-font-family: 'Inter', sans-serif;
  --ag-grid: #eef2ff;
  --ag-axis: #c7d2fe;
  --ag-tooltip-radius: 14px;
  --ag-tooltip-shadow: 0 10px 40px rgba(99, 102, 241, 0.25);
}
```

Because they're plain CSS variables, you can scope overrides to a container, react to your
app's dark mode, or animate them — whatever CSS allows.
