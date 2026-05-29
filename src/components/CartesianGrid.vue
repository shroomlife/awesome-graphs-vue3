<script setup lang="ts">
import type { Bounds } from '../types'

withDefaults(
  defineProps<{
    bounds: Bounds
    /** Absolute x pixel positions for vertical grid lines. */
    xLines?: number[]
    /** Absolute y pixel positions for horizontal grid lines. */
    yLines?: number[]
    showX?: boolean
    showY?: boolean
    /** Absolute y pixel of the zero baseline, emphasised when present. */
    zeroY?: number | null
  }>(),
  { xLines: () => [], yLines: () => [], showX: false, showY: true, zeroY: null },
)
</script>

<template>
  <g class="ag-grid" aria-hidden="true">
    <template v-if="showX">
      <line
        v-for="(x, i) in xLines"
        :key="`gx-${i}`"
        class="ag-grid__line"
        :x1="x"
        :x2="x"
        :y1="bounds.top"
        :y2="bounds.bottom"
      />
    </template>
    <template v-if="showY">
      <line
        v-for="(y, i) in yLines"
        :key="`gy-${i}`"
        class="ag-grid__line"
        :class="{ 'ag-grid__line--zero': zeroY != null && Math.abs(y - zeroY) < 0.5 }"
        :x1="bounds.left"
        :x2="bounds.right"
        :y1="y"
        :y2="y"
      />
    </template>
  </g>
</template>
