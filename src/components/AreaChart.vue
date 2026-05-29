<script setup lang="ts">
import { computed } from 'vue'
import type { CurveType, SeriesConfig } from '../types'
import type { BaseCartesianProps, CartesianSlotProps } from './cartesian-types'
import { areaPath, linePath, type AreaPoint } from '../core/shape'
import { toNumber } from '../core/domain'
import { withAlpha } from '../core/color'
import { omitUndefined } from './forward'
import CartesianChart from './CartesianChart.vue'

interface AreaChartProps extends BaseCartesianProps {
  curve?: CurveType
  /** Stack the areas on top of each other. */
  stacked?: boolean
  /** Fill opacity (also the top stop opacity when `gradient` is on). */
  fillOpacity?: number
  /** Render the fill as a vertical gradient fading to transparent. */
  gradient?: boolean
  /** Draw the top outline stroke. */
  line?: boolean
  strokeWidth?: number
}

const props = withDefaults(defineProps<AreaChartProps>(), {
  curve: 'monotone',
  stacked: false,
  fillOpacity: 0.3,
  gradient: true,
  line: true,
  strokeWidth: 2,
  // Concrete defaults so absent boolean props are not cast to false.
  legend: true,
  tooltip: true,
  grid: true,
  animate: true,
  accessibleTable: true,
})

const base = computed(() =>
  omitUndefined({
    data: props.data,
    x: props.x,
    series: props.series,
    xType: props.xType,
    width: props.width,
    height: props.height,
    aspectRatio: props.aspectRatio,
    margin: props.margin,
    theme: props.theme,
    palette: props.palette,
    xAxis: props.xAxis,
    yAxis: props.yAxis,
    grid: props.grid,
    legend: props.legend,
    tooltip: props.tooltip,
    animate: props.animate,
    ariaLabel: props.ariaLabel,
    accessibleTable: props.accessibleTable,
  }),
)

const configByKey = computed(() => {
  const map = new Map<string, SeriesConfig>()
  for (const s of props.series) {
    if (typeof s === 'string') map.set(s, { key: s })
    else map.set(s.key, s)
  }
  return map
})

function valueAt(key: string, i: number): number | null {
  const v = toNumber(props.data[i]?.[key])
  return Number.isFinite(v) ? v : null
}
function curveFor(key: string): CurveType {
  return configByKey.value.get(key)?.curve ?? props.curve
}
function fillOpacityFor(key: string): number {
  return configByKey.value.get(key)?.fillOpacity ?? props.fillOpacity
}
function gradientFor(key: string): boolean {
  return configByKey.value.get(key)?.gradient ?? props.gradient
}

function areaPoints(ctx: CartesianSlotProps, key: string): (AreaPoint | null)[] {
  if (ctx.stacked) {
    const seg = ctx.stacks.get(key)
    if (!seg) return []
    return props.data.map((_, i) => {
      const pair = seg[i]
      return pair ? { x: ctx.xPositions[i], y0: ctx.yScale(pair[0]), y1: ctx.yScale(pair[1]) } : null
    })
  }
  return props.data.map((_, i) => {
    const v = valueAt(key, i)
    return v == null ? null : { x: ctx.xPositions[i], y0: ctx.baseline, y1: ctx.yScale(v) }
  })
}

function buildArea(ctx: CartesianSlotProps, key: string): string {
  return areaPath(areaPoints(ctx, key), curveFor(key))
}

function buildTopLine(ctx: CartesianSlotProps, key: string): string {
  const pts = areaPoints(ctx, key).map((p) => (p ? ([p.x, p.y1] as [number, number]) : null))
  return linePath(pts, curveFor(key))
}

function fillFor(ctx: CartesianSlotProps, key: string, color: string): string {
  return gradientFor(key) ? `url(#${ctx.uid}-grad-${key})` : withAlpha(color, fillOpacityFor(key))
}
</script>

<template>
  <CartesianChart
    v-bind="base"
    category-scale="point"
    :y-baseline="true"
    :stacked="stacked"
  >
    <template #default="ctx">
      <defs>
        <clipPath :id="`${ctx.uid}-clip`">
          <rect
            :x="ctx.bounds.left"
            :y="ctx.bounds.top"
            :width="ctx.bounds.width * ctx.progress"
            :height="ctx.bounds.height"
          />
        </clipPath>
        <linearGradient
          v-for="s in ctx.series"
          :id="`${ctx.uid}-grad-${s.key}`"
          :key="`grad-${s.key}`"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" :stop-color="s.color" :stop-opacity="fillOpacityFor(s.key)" />
          <stop offset="100%" :stop-color="s.color" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g :clip-path="`url(#${ctx.uid}-clip)`">
        <path
          v-for="s in ctx.series"
          :key="`area-${s.key}`"
          class="ag-area"
          :d="buildArea(ctx, s.key)"
          :fill="fillFor(ctx, s.key, s.color)"
        />
        <path
          v-for="s in ctx.series"
          v-show="line"
          :key="`line-${s.key}`"
          class="ag-line"
          :d="buildTopLine(ctx, s.key)"
          :stroke="s.color"
          :stroke-width="strokeWidth"
        />
      </g>

      <g v-if="ctx.hoveredIndex >= 0">
        <template v-for="s in ctx.series" :key="`hover-${s.key}`">
          <circle
            v-if="!ctx.stacked && valueAt(s.key, ctx.hoveredIndex) !== null"
            class="ag-point"
            :cx="ctx.xPositions[ctx.hoveredIndex]"
            :cy="ctx.yScale(valueAt(s.key, ctx.hoveredIndex) ?? 0)"
            :r="5"
            :fill="s.color"
            stroke="var(--ag-tooltip-bg, #fff)"
            stroke-width="2"
          />
        </template>
      </g>
    </template>
  </CartesianChart>
</template>
