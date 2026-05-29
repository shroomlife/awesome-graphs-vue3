<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  AxisConfig,
  ChartData,
  LegendConfig,
  MarginInput,
  Primitive,
  SeriesConfig,
  SeriesMeta,
  ThemeInput,
  TooltipConfig,
  ValueFormatter,
  XAxisType,
} from '../types'
import {
  resolveMargin,
  getBounds,
  createBandScale,
  createPointScale,
  createLinearScale,
  createTimeScale,
  numericExtent,
  resolveNumericDomain,
  createStack,
  stackedExtent,
  colorAt,
  generateTicks,
  toNumber,
  resolveFormatter,
  defaultNumberFormat,
  identityFormat,
} from '../core'
import { palettes } from '../core/color'
import { useTheme } from '../composables/useTheme'
import { useElementSize } from '../composables/useElementSize'
import { useTooltip } from '../composables/useTooltip'
import { useUid } from '../composables/useUid'
import { useEnterProgress } from '../composables/useAnimation'
import type { ScaleLike } from '../core/scales'
import CartesianGrid from './CartesianGrid.vue'
import Axis from './Axis.vue'
import ChartLegend from './ChartLegend.vue'
import ChartTooltip from './ChartTooltip.vue'
import type { CartesianSlotProps } from './cartesian-types'

interface Props {
  data: ChartData
  /** Data key holding the x value of each row. */
  x: string
  /** Series to plot. Strings are shorthand for `{ key }`. */
  series: (SeriesConfig | string)[]
  /** How x values are interpreted. */
  xType?: XAxisType
  /** Scale used for categorical x: `point` (line/area) or `band` (bar). */
  categoryScale?: 'band' | 'point'
  /** Extend the y domain to include zero (area/bar). */
  yBaseline?: boolean
  /** Stack series on top of each other. */
  stacked?: boolean
  width?: number
  height?: number
  aspectRatio?: number
  margin?: MarginInput
  theme?: ThemeInput
  palette?: string | string[]
  xAxis?: AxisConfig
  yAxis?: AxisConfig
  grid?: boolean | { x?: boolean; y?: boolean }
  legend?: boolean | LegendConfig
  tooltip?: boolean | TooltipConfig
  animate?: boolean
  ariaLabel?: string
  /** Render a visually-hidden data table for screen readers. */
  accessibleTable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  xType: 'category',
  categoryScale: 'point',
  yBaseline: false,
  stacked: false,
  width: undefined,
  height: 320,
  aspectRatio: undefined,
  margin: undefined,
  theme: undefined,
  palette: undefined,
  xAxis: () => ({}),
  yAxis: () => ({}),
  // Concrete defaults (not `undefined`) so Vue's boolean prop casting does not
  // coerce an absent value to `false` and suppress the intended default.
  grid: true,
  legend: true,
  tooltip: true,
  animate: true,
  ariaLabel: undefined,
  accessibleTable: true,
})

defineSlots<{ default(props: CartesianSlotProps): unknown }>()

const resolvedTheme = useTheme(() => props.theme)
const uid = useUid('agc')
const tip = useTooltip()

const plotEl = ref<HTMLElement | null>(null)
const svgEl = ref<SVGSVGElement | null>(null)
const { width: measuredWidth } = useElementSize(plotEl)

const progress = useEnterProgress({ enabled: () => props.animate })

const width = computed(() => props.width ?? measuredWidth.value)
const height = computed(() =>
  props.aspectRatio && width.value > 0 ? width.value / props.aspectRatio : props.height,
)
const ready = computed(() => width.value > 0 && height.value > 0)

// --- configuration resolution -------------------------------------------
const xAxis = computed<AxisConfig>(() => ({
  show: true,
  line: true,
  ticks: true,
  tickSize: 6,
  ...props.xAxis,
}))
const yAxis = computed<AxisConfig>(() => ({
  show: true,
  line: false,
  ticks: false,
  tickSize: 6,
  nice: true,
  ...props.yAxis,
}))

const seriesConfigs = computed<SeriesConfig[]>(() =>
  props.series.map((s) => (typeof s === 'string' ? { key: s } : s)),
)

const paletteArr = computed<string[]>(() => {
  const p = props.palette
  if (Array.isArray(p)) return p
  if (typeof p === 'string') return palettes[p] ?? resolvedTheme.value.palette
  return resolvedTheme.value.palette
})

const gridCfg = computed(() => {
  const g = props.grid
  if (g === false) return { x: false, y: false }
  if (g == null || g === true) return { x: false, y: true }
  return { x: g.x ?? false, y: g.y ?? true }
})

const legendCfg = computed(() => {
  const count = seriesConfigs.value.length
  const defaults = {
    show: count > 1,
    position: 'bottom' as LegendConfig['position'],
    align: 'center' as LegendConfig['align'],
    symbol: 'circle' as NonNullable<LegendConfig['symbol']>,
    interactive: true,
  }
  const l = props.legend
  if (l === false) return { ...defaults, show: false }
  if (l == null || l === true) return defaults
  return { ...defaults, ...l, show: l.show ?? defaults.show }
})

const tooltipCfg = computed(() => {
  const defaults = { show: true, crosshair: true, sort: false } as TooltipConfig
  const t = props.tooltip
  if (t === false) return { ...defaults, show: false }
  if (t == null || t === true) return defaults
  return { ...defaults, ...t }
})

// --- series meta & visibility -------------------------------------------
const hiddenKeys = ref(new Set<string>(seriesConfigs.value.filter((s) => s.hidden).map((s) => s.key)))

function toggleSeries(key: string) {
  const next = new Set(hiddenKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  hiddenKeys.value = next
}

const allSeriesMeta = computed<SeriesMeta[]>(() =>
  seriesConfigs.value.map((s, i) => ({
    key: s.key,
    name: s.name ?? s.key,
    color: s.color ?? colorAt(paletteArr.value, i),
    hidden: hiddenKeys.value.has(s.key),
    index: i,
  })),
)
const visibleSeriesMeta = computed(() => allSeriesMeta.value.filter((s) => !s.hidden))
const visibleKeys = computed(() => visibleSeriesMeta.value.map((s) => s.key))

// --- geometry ------------------------------------------------------------
const margin = computed(() => {
  const m = resolveMargin(props.margin)
  if (xAxis.value.label) m.bottom += 22
  if (yAxis.value.label) m.left += 24
  return m
})
const bounds = computed(() => getBounds(width.value, height.value, margin.value))

const xValues = computed<Primitive[]>(() => props.data.map((row) => row[props.x] as Primitive))

const parsedX = computed(() => {
  if (props.xType === 'time') {
    return xValues.value.map((v) => (v instanceof Date ? v : new Date(v as string)))
  }
  if (props.xType === 'linear') return xValues.value.map((v) => Number(v))
  return xValues.value.map((v) => String(v))
})

function numberExtent(values: number[]): [number, number] {
  let lo = Infinity
  let hi = -Infinity
  for (const v of values) {
    if (!Number.isFinite(v)) continue
    if (v < lo) lo = v
    if (v > hi) hi = v
  }
  return lo === Infinity ? [0, 1] : [lo, hi]
}

const xScale = computed(() => {
  const range: [number, number] = [bounds.value.left, bounds.value.right]
  if (props.xType === 'category') {
    const domain = parsedX.value as string[]
    if (props.categoryScale === 'band') {
      return createBandScale({ domain, range, padding: props.xAxis.padding ?? 0.2 })
    }
    return createPointScale({ domain, range, padding: props.xAxis.padding ?? 0 })
  }
  if (props.xType === 'time') {
    const dates = parsedX.value as Date[]
    const times = dates.map((d) => d.getTime())
    const [lo, hi] = numberExtent(times)
    return createTimeScale({ domain: [new Date(lo), new Date(hi)], range })
  }
  return createLinearScale({
    domain: numberExtent(parsedX.value as number[]),
    range,
    nice: xAxis.value.nice ?? false,
  })
})

const bandwidth = computed(() => {
  const s = xScale.value as { bandwidth?: () => number }
  return typeof s.bandwidth === 'function' ? s.bandwidth() : 0
})

const xPositions = computed(() => {
  const s = xScale.value as unknown as (value: unknown) => number | undefined
  const half = bandwidth.value / 2
  return parsedX.value.map((v) => (s(v) ?? 0) + half)
})

// Loosely-typed scale views for the Axis/grid helpers (avoids d3 union friction).
const xScaleLike = computed(() => xScale.value as unknown as ScaleLike)
const yScaleLike = computed(() => yScale.value as unknown as ScaleLike)

const stackLayers = computed(() =>
  props.stacked ? createStack(props.data, visibleKeys.value) : null,
)

const yExtent = computed<[number, number]>(() =>
  stackLayers.value
    ? stackedExtent(stackLayers.value)
    : numericExtent(props.data, visibleKeys.value),
)

const stacks = computed(() => {
  const map = new Map<string, Array<[number, number]>>()
  if (!stackLayers.value) return map
  for (const layer of stackLayers.value) {
    map.set(
      layer.key,
      layer.map((p) => [p[0], p[1]] as [number, number]),
    )
  }
  return map
})

const yScale = computed(() => {
  const minAuto = yAxis.value.min == null || yAxis.value.min === 'auto'
  const maxAuto = yAxis.value.max == null || yAxis.value.max === 'auto'
  const domain = resolveNumericDomain(yExtent.value, {
    min: yAxis.value.min,
    max: yAxis.value.max,
    baseline: props.yBaseline,
  })
  return createLinearScale({
    domain,
    range: [bounds.value.bottom, bounds.value.top],
    nice: (yAxis.value.nice ?? true) && minAuto && maxAuto,
  })
})

const baselineY = computed(() => {
  const y = yScale.value(0)
  return Math.max(bounds.value.top, Math.min(bounds.value.bottom, y))
})

// Responsive tick budgets derived from the available plot size, so labels
// thin out gracefully on small screens instead of overlapping.
const xMaxTicks = computed(() => Math.max(2, Math.floor(bounds.value.width / 64)))
const yMaxTicks = computed(() => Math.max(2, Math.floor(bounds.value.height / 36)))
const xTickCount = computed(() => xAxis.value.tickCount ?? xMaxTicks.value)
const yTickCount = computed(() => yAxis.value.tickCount ?? yMaxTicks.value)

const xGridLines = computed(() =>
  generateTicks(xScaleLike.value, xTickCount.value).map((t) => t.offset),
)
const yGridLines = computed(() =>
  generateTicks(yScaleLike.value, yTickCount.value).map((t) => t.offset),
)

// --- formatters ----------------------------------------------------------
const xDefaultFormat = computed<ValueFormatter>(() =>
  props.xType === 'time'
    ? resolveFormatter('%b %d')
    : props.xType === 'linear'
      ? defaultNumberFormat
      : identityFormat,
)
const xFormatter = computed(() => resolveFormatter(xAxis.value.tickFormat, xDefaultFormat.value))
const yFormatter = computed(() => resolveFormatter(yAxis.value.tickFormat, defaultNumberFormat))
const tooltipLabelFormatter = computed(() =>
  resolveFormatter(tooltipCfg.value.labelFormat, xFormatter.value),
)
const tooltipValueFormatter = computed(() =>
  resolveFormatter(tooltipCfg.value.valueFormat, yFormatter.value),
)

// --- interaction ---------------------------------------------------------
const hoveredIndex = ref(-1)

function updateTooltip(index: number, pointerY: number) {
  const items = visibleSeriesMeta.value.map((s) => {
    const raw = toNumber(props.data[index]?.[s.key])
    const finite = Number.isFinite(raw)
    return {
      key: s.key,
      name: s.name,
      color: s.color,
      value: finite ? raw : null,
      formattedValue: tooltipValueFormatter.value(finite ? raw : null, index),
    }
  })
  if (tooltipCfg.value.sort) {
    items.sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity))
  }
  tip.show({
    x: xPositions.value[index],
    y: pointerY,
    label: tooltipLabelFormatter.value(xValues.value[index], index),
    items,
    dataIndex: index,
  })
}

function onPointerMove(event: PointerEvent) {
  if (!tooltipCfg.value.show || !svgEl.value || xPositions.value.length === 0) return
  const rect = svgEl.value.getBoundingClientRect()
  const px = event.clientX - rect.left
  const py = event.clientY - rect.top
  let index = 0
  let best = Infinity
  const xs = xPositions.value
  for (let i = 0; i < xs.length; i += 1) {
    const d = Math.abs(xs[i] - px)
    if (d < best) {
      best = d
      index = i
    }
  }
  hoveredIndex.value = index
  const clampedY = Math.max(bounds.value.top, Math.min(bounds.value.bottom, py))
  updateTooltip(index, clampedY)
}

function onPointerLeave() {
  hoveredIndex.value = -1
  tip.hide()
}

const cssVars = computed(() => {
  const t = resolvedTheme.value
  return {
    '--ag-font-family': t.fontFamily,
    '--ag-font-size': `${t.fontSize}px`,
    '--ag-background': t.background,
    '--ag-foreground': t.foreground,
    '--ag-muted': t.muted,
    '--ag-grid': t.grid,
    '--ag-axis': t.axis,
    '--ag-tooltip-bg': t.tooltip.background,
    '--ag-tooltip-color': t.tooltip.color,
    '--ag-tooltip-border': t.tooltip.border,
    '--ag-tooltip-radius': `${t.tooltip.radius}px`,
    '--ag-tooltip-shadow': t.tooltip.shadow,
  } as Record<string, string>
})

const containerStyle = computed(() => {
  const side = legendCfg.value.position === 'left' || legendCfg.value.position === 'right'
  return {
    ...cssVars.value,
    display: 'flex',
    flexDirection: (side ? 'row' : 'column') as 'row' | 'column',
    gap: '8px',
    width: props.width ? `${props.width}px` : '100%',
  }
})

const legendBefore = computed(
  () => legendCfg.value.position === 'top' || legendCfg.value.position === 'left',
)

const ariaLabel = computed(
  () =>
    props.ariaLabel ??
    `Chart with ${visibleSeriesMeta.value.length} series and ${props.data.length} data points`,
)

/** Format a raw cell for the accessible data table. */
function cellValue(raw: unknown, index: number): string {
  const n = toNumber(raw)
  if (Number.isFinite(n)) return yFormatter.value(n, index)
  return raw == null ? '' : String(raw)
}
</script>

<template>
  <div
    class="ag-chart"
    :class="resolvedTheme.dark ? 'ag-theme-dark' : 'ag-theme-light'"
    :style="containerStyle"
  >
    <ChartLegend
      v-if="legendCfg.show && legendBefore"
      :items="allSeriesMeta"
      :align="legendCfg.align"
      :position="legendCfg.position"
      :symbol="legendCfg.symbol"
      :interactive="legendCfg.interactive"
      @toggle="toggleSeries"
    />

    <div ref="plotEl" class="ag-chart__plot" style="position: relative; flex: 1; min-width: 0">
      <svg
        v-if="ready"
        ref="svgEl"
        class="ag-chart__svg"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="ariaLabel"
      >
        <CartesianGrid
          :bounds="bounds"
          :x-lines="xGridLines"
          :y-lines="yGridLines"
          :show-x="gridCfg.x"
          :show-y="gridCfg.y"
          :zero-y="yBaseline ? baselineY : null"
        />

        <!-- Series drawing supplied by the concrete chart component. -->
        <slot
          :bounds="bounds"
          :xScale="xScale"
          :yScale="yScale"
          :series="visibleSeriesMeta"
          :xValues="xValues"
          :xPositions="xPositions"
          :bandwidth="bandwidth"
          :baseline="baselineY"
          :stacked="stacked"
          :stacks="stacks"
          :hoveredIndex="hoveredIndex"
          :progress="progress"
          :theme="resolvedTheme"
          :uid="uid"
        />

        <Axis
          v-if="yAxis.show"
          orientation="left"
          :scale="yScaleLike"
          :bounds="bounds"
          :formatter="yFormatter"
          :tick-count="yTickCount"
          :max-ticks="yMaxTicks"
          :tick-values="yAxis.tickValues"
          :show-line="yAxis.line"
          :show-ticks="yAxis.ticks"
          :tick-size="yAxis.tickSize"
          :title="yAxis.label"
        />
        <Axis
          v-if="xAxis.show"
          orientation="bottom"
          :scale="xScaleLike"
          :bounds="bounds"
          :formatter="xFormatter"
          :tick-count="xTickCount"
          :max-ticks="xMaxTicks"
          :tick-values="xAxis.tickValues"
          :show-line="xAxis.line"
          :show-ticks="xAxis.ticks"
          :tick-size="xAxis.tickSize"
          :title="xAxis.label"
        />

        <line
          v-if="tooltipCfg.show && tooltipCfg.crosshair && hoveredIndex >= 0 && tip.state.visible"
          class="ag-crosshair"
          :x1="xPositions[hoveredIndex]"
          :x2="xPositions[hoveredIndex]"
          :y1="bounds.top"
          :y2="bounds.bottom"
        />

        <rect
          v-if="tooltipCfg.show"
          :x="bounds.left"
          :y="bounds.top"
          :width="bounds.width"
          :height="bounds.height"
          fill="transparent"
          style="pointer-events: all"
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        />
      </svg>

      <ChartTooltip v-if="tooltipCfg.show" :state="tip.state" :width="width" />
    </div>

    <ChartLegend
      v-if="legendCfg.show && !legendBefore"
      :items="allSeriesMeta"
      :align="legendCfg.align"
      :position="legendCfg.position"
      :symbol="legendCfg.symbol"
      :interactive="legendCfg.interactive"
      @toggle="toggleSeries"
    />

    <!-- Visually-hidden data table: the accessible equivalent of the chart. -->
    <table v-if="accessibleTable" class="ag-sr-only">
      <caption>{{ ariaLabel }}</caption>
      <thead>
        <tr>
          <th scope="col">{{ x }}</th>
          <th v-for="s in allSeriesMeta" :key="s.key" scope="col">{{ s.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in data" :key="i">
          <th scope="row">{{ xFormatter(xValues[i], i) }}</th>
          <td v-for="s in allSeriesMeta" :key="s.key">{{ cellValue(row[s.key], i) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
