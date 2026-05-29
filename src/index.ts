/**
 * awesome-graphs-vue3 — a highly customizable, SVG-first chart library for Vue 3.
 *
 * Public entry point: the headless core, composables, theme system, chart
 * components and the install plugin.
 */
import './styles/base.css'

export * from './types'
export * from './core'
export * from './composables'
export * from './theme'
export * from './components'

export { AwesomeGraphs, type AwesomeGraphsOptions } from './plugin'
export { default } from './plugin'
