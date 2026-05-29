<script setup lang="ts">
import { computed } from 'vue'
import type { TooltipState } from '../types'

const props = withDefaults(
  defineProps<{
    /** Reactive tooltip state (position, label, items, visibility). */
    state: TooltipState
    /** Container width in px, used to flip the tooltip near the right edge. */
    width?: number
  }>(),
  { width: 0 },
)

const transform = computed(() => {
  const { x, y } = props.state
  const flipX = props.width > 0 && x > props.width * 0.6
  const anchorX = flipX ? '-100%' : '0'
  const nudgeX = flipX ? -12 : 12
  return `translate(${x}px, ${y}px) translate(${anchorX}, -50%) translate(${nudgeX}px, 0)`
})
</script>

<template>
  <div
    v-show="state.visible"
    class="ag-tooltip"
    role="tooltip"
    :style="{ transform }"
  >
    <div v-if="state.label" class="ag-tooltip__title">{{ state.label }}</div>
    <div v-for="item in state.items" :key="item.key" class="ag-tooltip__item">
      <span class="ag-tooltip__swatch" :style="{ background: item.color }" />
      <span class="ag-tooltip__name">{{ item.name }}</span>
      <span class="ag-tooltip__value">{{ item.formattedValue }}</span>
    </div>
  </div>
</template>
