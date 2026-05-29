# Accessibility & Responsiveness

Awesome Graphs is built to look great everywhere, work for everyone, and stay
standards-conformant.

## Responsive by default

- **Fills its container.** With no `width`, a chart measures its parent via `ResizeObserver`
  and re-renders crisply on every resize — no blurry scaling.
- **Lock an aspect ratio** for fluid layouts: `:aspect-ratio="16 / 9"`.
- **Fixed size** when you need it: `:width="640" :height="360"`.
- **Smart tick thinning.** On narrow charts the axis labels automatically thin out instead of
  overlapping — the number of ticks adapts to the available space.

<script setup>
const data = Array.from({ length: 24 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: Math.round(40 + 30 * Math.sin(i / 3) + i),
}))
</script>

<Demo title="24 categories — labels thin to fit (resize the window!)">
  <LineChart :data="data" x="day" :series="['value']" :height="280" :legend="false" />
</Demo>

```vue
<!-- fluid, keeps a 2:1 aspect ratio -->
<LineChart :data="data" x="day" :series="['value']" :aspect-ratio="2" />
```

## Accessible to screen readers

Every chart ships an accessible representation out of the box:

- The SVG is exposed as `role="img"` with a descriptive `aria-label`.
- A **visually-hidden data table** mirrors the underlying data, so screen-reader users get the
  real numbers — not just "image". Toggle it with `:accessible-table="false"`.
- The **legend is keyboard-focusable**: it's a semantic `<ul>` of real `<button>`s with
  `aria-pressed`, so series can be toggled with the keyboard.
- Entrance animations honor **`prefers-reduced-motion`** automatically (or disable them with
  `:animate="false"`).

```vue
<!-- provide your own summary; keep the data table -->
<BarChart :data="data" x="day" :series="['value']" aria-label="Daily active users over 24 days" />

<!-- opt out of the hidden table if you provide your own -->
<BarChart :data="data" x="day" :series="['value']" :accessible-table="false" />
```

## Cross-browser & standards-conformant

- **SVG-first** rendering works in every modern browser and stays sharp at any zoom or DPI.
- The markup is **valid HTML & SVG** — semantic lists, table semantics (`<caption>`,
  `scope`), and standard ARIA roles.
- Styling avoids bleeding-edge CSS that lacks broad support, so charts render consistently
  across Chrome, Firefox, Safari and Edge.
- Works under **SSR** (Nuxt) with no browser globals at render time — see the
  [Nuxt guide](/guide/nuxt).
