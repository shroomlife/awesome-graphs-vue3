<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FormatInput, LegendConfig, SeriesMeta, ThemeInput, TooltipConfig } from '../types'
import { computePie, arcPath, arcCentroid } from '../core/shape'
import { colorAt, palettes } from '../core/color'
import { toNumber } from '../core/domain'
import { resolveFormatter, defaultNumberFormat } from '../core/format'
import { useTheme } from '../composables/useTheme'
import { useElementSize } from '../composables/useElementSize'
import { useTooltip } from '../composables/useTooltip'
import { useEnterProgress } from '../composables/useAnimation'
import ChartLegend from './ChartLegend.vue'
import ChartTooltip from './ChartTooltip.vue'

interface PieChartProps {
  data: Record<string, unknown>[]
  /** Data key holding the numeric value of each slice. */
  value: string
  /** Data key holding the slice label/name. */
  label?: string
  /** Donut hole: `true` (0.6 ratio), or an explicit inner-radius ratio (0–1). */
  donut?: boolean | number
  /** Padding between slices, in radians. */
  padAngle?: number
  /** Slice corner radius in px. */
  cornerRadius?: number
  /** Start angle in degrees (0 = top, clockwise). */
  startAngle?: number
  /** End angle in degrees. */
  endAngle?: number
  /** Sort slices by value descending. */
  sort?: boolean
  /** Show labels on slices. */
  showLabels?: boolean
  /** What to render as the slice label. */
  labelType?: 'percent' | 'value' | 'name' | 'none'
  /** Format applied to values (labels & tooltip). */
  valueFormat?: FormatInput
  width?: number
  height?: number
  theme?: ThemeInput
  palette?: string | string[]
  legend?: boolean | LegendConfig
  tooltip?: boolean | TooltipConfig
  animate?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<PieChartProps>(), {
  label: 'name',
  donut: false,
  padAngle: 0,
  cornerRadius: 0,
  startAngle: 0,
  endAngle: 360,
  sort: false,
  showLabels: true,
  labelType: 'percent',
  valueFormat: undefined,
  width: undefined,
  height: 320,
  theme: undefined,
  palette: undefined,
  // Concrete `true` defaults avoid Vue's boolean-casting of absent props to false.
  legend: true,
  tooltip: true,
  animate: true,
  ariaLabel: undefined,
})

const resolvedTheme = useTheme(() => props.theme)
const tip = useTooltip()
const plotEl = ref<HTMLElement | null>(null)
const svgEl = ref<SVGSVGElement | null>(null)
const { width: measuredWidth } = useElementSize(plotEl)
const progress = useEnterProgress({ enabled: () => props.animate })

const width = computed(() => props.width ?? measuredWidth.value)
const height = computed(() => props.height)
const ready = computed(() => width.value > 0 && height.value > 0)

const paletteArr = computed<string[]>(() => {
  const p = props.palette
  if (Array.isArray(p)) return p
  if (typeof p === 'string') return palettes[p] ?? resolvedTheme.value.palette
  return resolvedTheme.value.palette
})

const valueFormatter = computed(() => resolveFormatter(props.valueFormat, defaultNumberFormat))

const hiddenKeys = ref(new Set<string>())
function toggle(key: string) {
  const next = new Set(hiddenKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  hiddenKeys.value = next
}

interface Item {
  key: string
  name: string
  value: number
  color: string
  index: number
}

const allItems = computed<Item[]>(() =>
  props.data.map((row, i) => {
    const name = row[props.label] != null ? String(row[props.label]) : `Item ${i + 1}`
    const v = toNumber(row[props.value])
    return {
      key: name,
      name,
      value: Number.isFinite(v) ? v : 0,
      color: colorAt(paletteArr.value, i),
      index: i,
    }
  }),
)

const legendItems = computed<SeriesMeta[]>(() =>
  allItems.value.map((it) => ({
    key: it.key,
    name: it.name,
    color: it.color,
    hidden: hiddenKeys.value.has(it.key),
    index: it.index,
  })),
)

const visibleItems = computed(() => allItems.value.filter((it) => !hiddenKeys.value.has(it.key)))
const total = computed(() => visibleItems.value.reduce((sum, it) => sum + Math.max(0, it.value), 0))

const cx = computed(() => width.value / 2)
const cy = computed(() => height.value / 2)
const outerRadius = computed(() => Math.max(0, Math.min(width.value, height.value) / 2 - 8))
const innerRadius = computed(() => {
  if (!props.donut) return 0
  const ratio = props.donut === true ? 0.6 : props.donut
  return outerRadius.value * ratio
})

const deg2rad = (d: number) => (d * Math.PI) / 180

interface Slice extends Item {
  startAngle: number
  endAngle: number
  padAngle: number
  path: string
  labelPos: [number, number]
  percent: number
  span: number
}

const slices = computed<Slice[]>(() => {
  if (!ready.value) return []
  const layout = computePie(
    visibleItems.value.map((it) => ({ key: it.key, value: Math.max(0, it.value) })),
    {
      startAngle: deg2rad(props.startAngle),
      endAngle: deg2rad(props.endAngle),
      padAngle: props.padAngle,
      sort: props.sort,
    },
  )
  const arcOpts = {
    innerRadius: innerRadius.value,
    outerRadius: outerRadius.value,
    cornerRadius: props.cornerRadius,
  }
  return layout.map((slice) => {
    const item = visibleItems.value[slice.index]
    const span = slice.endAngle - slice.startAngle
    return {
      ...item,
      startAngle: slice.startAngle,
      endAngle: slice.endAngle,
      padAngle: slice.padAngle,
      path: arcPath(slice, arcOpts),
      labelPos: arcCentroid(slice, arcOpts),
      percent: total.value > 0 ? (item.value / total.value) * 100 : 0,
      span,
    }
  })
})

function sliceLabel(slice: Slice): string {
  switch (props.labelType) {
    case 'value':
      return valueFormatter.value(slice.value, slice.index)
    case 'name':
      return slice.name
    case 'none':
      return ''
    default:
      return `${Math.round(slice.percent * 10) / 10}%`
  }
}

// --- legend / tooltip / layout ------------------------------------------
const legendCfg = computed(() => {
  const defaults = {
    show: true,
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
const legendBefore = computed(
  () => legendCfg.value.position === 'top' || legendCfg.value.position === 'left',
)

const tooltipCfg = computed(() => {
  const defaults = { show: true } as TooltipConfig
  const t = props.tooltip
  if (t === false) return { ...defaults, show: false }
  if (t == null || t === true) return defaults
  return { ...defaults, ...t }
})

function onSliceMove(event: PointerEvent, slice: Slice) {
  if (!tooltipCfg.value.show || !svgEl.value) return
  const rect = svgEl.value.getBoundingClientRect()
  tip.show({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    label: slice.name,
    dataIndex: slice.index,
    items: [
      {
        key: slice.key,
        name: valueFormatter.value(slice.value, slice.index),
        color: slice.color,
        value: slice.value,
        formattedValue: `${Math.round(slice.percent * 10) / 10}%`,
      },
    ],
  })
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

const ariaLabel = computed(
  () => props.ariaLabel ?? `${props.donut ? 'Donut' : 'Pie'} chart with ${visibleItems.value.length} slices`,
)
</script>

<template>
  <div
    class="ag-chart"
    :class="resolvedTheme.dark ? 'ag-theme-dark' : 'ag-theme-light'"
    :style="containerStyle"
  >
    <ChartLegend
      v-if="legendCfg.show && legendBefore"
      :items="legendItems"
      :align="legendCfg.align"
      :position="legendCfg.position"
      :symbol="legendCfg.symbol"
      :interactive="legendCfg.interactive"
      @toggle="toggle"
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
        @pointerleave="tip.hide()"
      >
        <g :transform="`translate(${cx}, ${cy})`">
          <g :transform="`scale(${progress})`" :style="{ opacity: progress }">
            <path
              v-for="slice in slices"
              :key="slice.key"
              class="ag-arc"
              :d="slice.path"
              :fill="slice.color"
              @pointermove="onSliceMove($event, slice)"
            />
            <template v-if="showLabels && labelType !== 'none'">
              <text
                v-for="slice in slices"
                v-show="slice.span > 0.22"
                :key="`l-${slice.key}`"
                class="ag-arc__label"
                :x="slice.labelPos[0]"
                :y="slice.labelPos[1]"
                text-anchor="middle"
                dominant-baseline="central"
              >
                {{ sliceLabel(slice) }}
              </text>
            </template>
          </g>
        </g>
      </svg>

      <ChartTooltip v-if="tooltipCfg.show" :state="tip.state" :width="width" />
    </div>

    <ChartLegend
      v-if="legendCfg.show && !legendBefore"
      :items="legendItems"
      :align="legendCfg.align"
      :position="legendCfg.position"
      :symbol="legendCfg.symbol"
      :interactive="legendCfg.interactive"
      @toggle="toggle"
    />
  </div>
</template>
