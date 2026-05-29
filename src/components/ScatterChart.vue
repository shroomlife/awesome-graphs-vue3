<script setup lang="ts">
import { computed } from 'vue'
import type { BaseCartesianProps } from './cartesian-types'
import { toNumber, numericExtent } from '../core/domain'
import { omitUndefined } from './forward'
import CartesianChart from './CartesianChart.vue'

interface ScatterChartProps extends BaseCartesianProps {
  /** Data key for bubble radius; omit for fixed-size points. */
  size?: string
  /** Min/max radius in px when `size` is used. */
  sizeRange?: [number, number]
  /** Radius in px when `size` is not used. */
  pointRadius?: number
  /** Fill opacity of the points (0–1). */
  fillOpacity?: number
}

const props = withDefaults(defineProps<ScatterChartProps>(), {
  // Scatter plots default to a numeric x axis.
  xType: 'linear',
  size: undefined,
  sizeRange: () => [4, 22],
  pointRadius: 5,
  fillOpacity: 0.7,
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

function yAt(key: string, i: number): number | null {
  const v = toNumber(props.data[i]?.[key])
  return Number.isFinite(v) ? v : null
}

const sizeExtent = computed<[number, number] | null>(() =>
  props.size ? numericExtent(props.data, [props.size]) : null,
)

function radiusAt(i: number): number {
  if (!props.size || !sizeExtent.value) return props.pointRadius
  const v = toNumber(props.data[i]?.[props.size])
  const [lo, hi] = sizeExtent.value
  const [rMin, rMax] = props.sizeRange
  if (!Number.isFinite(v) || hi <= lo) return (rMin + rMax) / 2
  // sqrt so that *area* (not radius) scales with the value.
  const t = Math.sqrt((v - lo) / (hi - lo))
  return rMin + (rMax - rMin) * t
}
</script>

<template>
  <CartesianChart v-bind="base" category-scale="point" :y-baseline="false">
    <template #default="ctx">
      <g v-for="s in ctx.series" :key="s.key">
        <template v-for="(_row, i) in data" :key="`${s.key}-${i}`">
          <circle
            v-if="yAt(s.key, i) !== null"
            class="ag-point"
            :cx="ctx.xPositions[i]"
            :cy="ctx.yScale(yAt(s.key, i) ?? 0)"
            :r="radiusAt(i) * ctx.progress"
            :fill="s.color"
            :fill-opacity="fillOpacity"
            :stroke="s.color"
          />
        </template>
      </g>

      <g v-if="ctx.hoveredIndex >= 0">
        <template v-for="s in ctx.series" :key="`hover-${s.key}`">
          <circle
            v-if="yAt(s.key, ctx.hoveredIndex) !== null"
            class="ag-point"
            :cx="ctx.xPositions[ctx.hoveredIndex]"
            :cy="ctx.yScale(yAt(s.key, ctx.hoveredIndex) ?? 0)"
            :r="radiusAt(ctx.hoveredIndex) + 2"
            :fill="s.color"
            stroke="var(--ag-tooltip-bg, #fff)"
            stroke-width="2"
          />
        </template>
      </g>
    </template>
  </CartesianChart>
</template>
