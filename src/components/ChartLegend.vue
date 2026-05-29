<script setup lang="ts">
import { computed } from 'vue'
import type { LegendAlign, LegendPosition, SeriesMeta } from '../types'

const props = withDefaults(
  defineProps<{
    items: SeriesMeta[]
    align?: LegendAlign
    position?: LegendPosition
    symbol?: 'circle' | 'square' | 'line'
    interactive?: boolean
  }>(),
  { align: 'center', position: 'bottom', symbol: 'circle', interactive: true },
)

const emit = defineEmits<{ toggle: [key: string] }>()

const classes = computed(() => [
  'ag-legend',
  `ag-legend--${props.align}`,
  `ag-legend--${props.position}`,
])

function onSelect(item: SeriesMeta) {
  if (props.interactive) emit('toggle', item.key)
}
</script>

<template>
  <div :class="classes" role="list">
    <component
      :is="interactive ? 'button' : 'span'"
      v-for="item in items"
      :key="item.key"
      role="listitem"
      :type="interactive ? 'button' : undefined"
      :class="[
        'ag-legend__item',
        {
          'ag-legend__item--interactive': interactive,
          'ag-legend__item--hidden': item.hidden,
        },
      ]"
      :aria-pressed="interactive ? String(!item.hidden) : undefined"
      @click="onSelect(item)"
    >
      <span
        class="ag-legend__symbol"
        :class="`ag-legend__symbol--${symbol}`"
        :style="{ background: item.color }"
      />
      <span class="ag-legend__label">{{ item.name }}</span>
    </component>
  </div>
</template>
