<script setup lang="ts">
import { computed } from 'vue'
import type { CartesianSlotProps, BaseCartesianProps } from './cartesian-types'
import { toNumber } from '../core/domain'
import { omitUndefined } from './forward'
import CartesianChart from './CartesianChart.vue'

interface BarChartProps extends BaseCartesianProps {
  /** Stack bars instead of grouping them side by side. */
  stacked?: boolean
  /** Corner radius in px. */
  radius?: number
  /** Gap between grouped bars as a fraction of the per-series slot (0–1). */
  groupPadding?: number
}

const props = withDefaults(defineProps<BarChartProps>(), {
  stacked: false,
  radius: 3,
  groupPadding: 0.15,
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

function valueAt(key: string, i: number): number | null {
  const v = toNumber(props.data[i]?.[key])
  return Number.isFinite(v) ? v : null
}

interface Bar {
  key: string
  color: string
  x: number
  y: number
  width: number
  height: number
  rx: number
}

function bars(ctx: CartesianSlotProps): Bar[] {
  const out: Bar[] = []
  const n = Math.max(1, ctx.series.length)
  const p = ctx.progress
  const baseline = ctx.baseline

  ctx.series.forEach((s, j) => {
    props.data.forEach((_, i) => {
      let yTop: number
      let yBottom: number
      let x: number
      let w: number

      if (ctx.stacked) {
        const seg = ctx.stacks.get(s.key)?.[i]
        if (!seg) return
        yTop = ctx.yScale(seg[1])
        yBottom = ctx.yScale(seg[0])
        w = Math.max(0, ctx.bandwidth)
        x = ctx.xPositions[i] - ctx.bandwidth / 2
      } else {
        const v = valueAt(s.key, i)
        if (v == null) return
        yTop = ctx.yScale(v)
        yBottom = baseline
        const step = ctx.bandwidth / n
        w = Math.max(0, step * (1 - props.groupPadding))
        x = ctx.xPositions[i] - ctx.bandwidth / 2 + j * step + (step - w) / 2
      }

      const top = baseline + (yTop - baseline) * p
      const bot = baseline + (yBottom - baseline) * p
      const y = Math.min(top, bot)
      const height = Math.max(0, Math.abs(bot - top))
      const rx = Math.max(0, Math.min(props.radius, w / 2, height / 2))
      out.push({ key: `${s.key}-${i}`, color: s.color, x, y, width: w, height, rx })
    })
  })
  return out
}
</script>

<template>
  <CartesianChart
    v-bind="base"
    x-type="category"
    category-scale="band"
    :y-baseline="true"
    :stacked="stacked"
  >
    <template #default="ctx">
      <g>
        <rect
          v-for="bar in bars(ctx)"
          :key="bar.key"
          class="ag-bar"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          :rx="bar.rx"
          :fill="bar.color"
        />
      </g>
    </template>
  </CartesianChart>
</template>
