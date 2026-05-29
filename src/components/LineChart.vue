<script setup lang="ts">
import { computed } from 'vue'
import type { CurveType, SeriesConfig } from '../types'
import type { BaseCartesianProps, CartesianSlotProps } from './cartesian-types'
import { linePath } from '../core/shape'
import { toNumber } from '../core/domain'
import { omitUndefined } from './forward'
import CartesianChart from './CartesianChart.vue'

interface LineChartProps extends BaseCartesianProps {
  /** Default curve interpolation (overridable per series). */
  curve?: CurveType
  /** Default stroke width in px. */
  strokeWidth?: number
  /** Show point markers on every vertex. */
  showPoints?: boolean | 'hover'
  /** Marker radius in px. */
  pointRadius?: number
}

const props = withDefaults(defineProps<LineChartProps>(), {
  curve: 'monotone',
  strokeWidth: 2,
  showPoints: false,
  pointRadius: 3,
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
function strokeFor(key: string): number {
  return configByKey.value.get(key)?.strokeWidth ?? props.strokeWidth
}
function dashFor(key: string): string | undefined {
  const d = configByKey.value.get(key)?.dashed
  if (d == null) return undefined
  if (Array.isArray(d)) return d.join(' ')
  return d ? '6 4' : undefined
}
function showPointsFor(key: string): boolean {
  return (configByKey.value.get(key)?.showPoints ?? props.showPoints) === true
}
function pointRadiusFor(key: string): number {
  return configByKey.value.get(key)?.pointRadius ?? props.pointRadius
}

function buildPath(ctx: CartesianSlotProps, key: string): string {
  const pts = props.data.map((_, i) => {
    const v = valueAt(key, i)
    return v == null ? null : ([ctx.xPositions[i], ctx.yScale(v)] as [number, number])
  })
  return linePath(pts, curveFor(key))
}
</script>

<template>
  <CartesianChart v-bind="base" category-scale="point" :y-baseline="false">
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
      </defs>

      <g :clip-path="`url(#${ctx.uid}-clip)`">
        <path
          v-for="s in ctx.series"
          :key="s.key"
          class="ag-line"
          :d="buildPath(ctx, s.key)"
          :stroke="s.color"
          :stroke-width="strokeFor(s.key)"
          :stroke-dasharray="dashFor(s.key)"
        />
        <template v-for="s in ctx.series" :key="`pts-${s.key}`">
          <template v-if="showPointsFor(s.key)">
            <circle
              v-for="(_row, i) in data"
              v-show="valueAt(s.key, i) !== null"
              :key="`${s.key}-${i}`"
              class="ag-point"
              :cx="ctx.xPositions[i]"
              :cy="ctx.yScale(valueAt(s.key, i) ?? 0)"
              :r="pointRadiusFor(s.key)"
              :fill="s.color"
            />
          </template>
        </template>
      </g>

      <g v-if="ctx.hoveredIndex >= 0">
        <template v-for="s in ctx.series" :key="`hover-${s.key}`">
          <circle
            v-if="valueAt(s.key, ctx.hoveredIndex) !== null"
            class="ag-point"
            :cx="ctx.xPositions[ctx.hoveredIndex]"
            :cy="ctx.yScale(valueAt(s.key, ctx.hoveredIndex) ?? 0)"
            :r="pointRadiusFor(s.key) + 2"
            :fill="s.color"
            stroke="var(--ag-tooltip-bg, #fff)"
            stroke-width="2"
          />
        </template>
      </g>
    </template>
  </CartesianChart>
</template>
