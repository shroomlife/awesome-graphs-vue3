<script setup lang="ts">
import { computed } from 'vue'
import type { Bounds, Primitive, ValueFormatter } from '../types'
import { generateTicks, type Tick } from '../core/ticks'
import { defaultNumberFormat, identityFormat } from '../core/format'
import type { ScaleLike } from '../core/scales'

type Orientation = 'bottom' | 'left' | 'top' | 'right'

const props = withDefaults(
  defineProps<{
    orientation: Orientation
    scale: ScaleLike
    bounds: Bounds
    formatter?: ValueFormatter
    tickCount?: number
    tickValues?: Primitive[]
    showLine?: boolean
    showTicks?: boolean
    tickSize?: number
    title?: string
  }>(),
  { showLine: true, showTicks: true, tickSize: 6, formatter: undefined, title: '' },
)

const horizontal = computed(() => props.orientation === 'bottom' || props.orientation === 'top')

const format = computed<ValueFormatter>(
  () => props.formatter ?? (horizontal.value ? identityFormat : defaultNumberFormat),
)

const ticks = computed<Tick[]>(() =>
  generateTicks(props.scale, props.tickCount, props.tickValues),
)

const domainLine = computed(() => {
  const b = props.bounds
  switch (props.orientation) {
    case 'bottom':
      return { x1: b.left, y1: b.bottom, x2: b.right, y2: b.bottom }
    case 'top':
      return { x1: b.left, y1: b.top, x2: b.right, y2: b.top }
    case 'left':
      return { x1: b.left, y1: b.top, x2: b.left, y2: b.bottom }
    default:
      return { x1: b.right, y1: b.top, x2: b.right, y2: b.bottom }
  }
})

function groupTransform(offset: number): string {
  const b = props.bounds
  switch (props.orientation) {
    case 'bottom':
      return `translate(${offset},${b.bottom})`
    case 'top':
      return `translate(${offset},${b.top})`
    case 'left':
      return `translate(${b.left},${offset})`
    default:
      return `translate(${b.right},${offset})`
  }
}

const tickLine = computed(() => {
  const s = props.tickSize
  switch (props.orientation) {
    case 'bottom':
      return { x1: 0, y1: 0, x2: 0, y2: s }
    case 'top':
      return { x1: 0, y1: 0, x2: 0, y2: -s }
    case 'left':
      return { x1: 0, y1: 0, x2: -s, y2: 0 }
    default:
      return { x1: 0, y1: 0, x2: s, y2: 0 }
  }
})

const label = computed(() => {
  const s = props.tickSize
  switch (props.orientation) {
    case 'bottom':
      return { x: 0, y: s + 4, anchor: 'middle', baseline: 'hanging' }
    case 'top':
      return { x: 0, y: -(s + 4), anchor: 'middle', baseline: 'auto' }
    case 'left':
      return { x: -(s + 6), y: 0, anchor: 'end', baseline: 'central' }
    default:
      return { x: s + 6, y: 0, anchor: 'start', baseline: 'central' }
  }
})

const titleTransform = computed(() => {
  const b = props.bounds
  switch (props.orientation) {
    case 'bottom':
      return `translate(${(b.left + b.right) / 2}, ${b.bottom + 34})`
    case 'top':
      return `translate(${(b.left + b.right) / 2}, ${b.top - 28})`
    case 'left':
      return `translate(${b.left - 38}, ${(b.top + b.bottom) / 2}) rotate(-90)`
    default:
      return `translate(${b.right + 38}, ${(b.top + b.bottom) / 2}) rotate(90)`
  }
})
</script>

<template>
  <g class="ag-axis" :class="`ag-axis--${orientation}`" aria-hidden="true">
    <line
      v-if="showLine"
      class="ag-axis__domain"
      :x1="domainLine.x1"
      :y1="domainLine.y1"
      :x2="domainLine.x2"
      :y2="domainLine.y2"
    />
    <g v-for="(tick, i) in ticks" :key="`t-${i}`" :transform="groupTransform(tick.offset)">
      <line
        v-if="showTicks"
        class="ag-axis__tick-line"
        :x1="tickLine.x1"
        :y1="tickLine.y1"
        :x2="tickLine.x2"
        :y2="tickLine.y2"
      />
      <text
        class="ag-axis__label"
        :x="label.x"
        :y="label.y"
        :text-anchor="label.anchor"
        :dominant-baseline="label.baseline"
      >
        {{ format(tick.value, i) }}
      </text>
    </g>
    <text
      v-if="title"
      class="ag-axis__title"
      :transform="titleTransform"
      text-anchor="middle"
    >
      {{ title }}
    </text>
  </g>
</template>
