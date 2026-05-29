export { default as CartesianChart } from './CartesianChart.vue'
export { default as LineChart } from './LineChart.vue'
export { default as AreaChart } from './AreaChart.vue'
export { default as BarChart } from './BarChart.vue'
export { default as ScatterChart } from './ScatterChart.vue'
export { default as PieChart } from './PieChart.vue'

// Primitives (compose your own charts).
export { default as Axis } from './Axis.vue'
export { default as CartesianGrid } from './CartesianGrid.vue'
export { default as ChartLegend } from './ChartLegend.vue'
export { default as ChartTooltip } from './ChartTooltip.vue'

export type {
  BaseCartesianProps,
  CartesianSlotProps,
  CartesianXScale,
  XScaleKind,
} from './cartesian-types'
