import { computed, type App, type Plugin } from 'vue'
import type { ThemeInput } from './types'
import { resolveTheme } from './theme/themes'
import { themeInjectionKey } from './composables/useTheme'
import CartesianChart from './components/CartesianChart.vue'
import LineChart from './components/LineChart.vue'
import AreaChart from './components/AreaChart.vue'
import BarChart from './components/BarChart.vue'
import ScatterChart from './components/ScatterChart.vue'
import PieChart from './components/PieChart.vue'
import Axis from './components/Axis.vue'
import CartesianGrid from './components/CartesianGrid.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'

const components = {
  CartesianChart,
  LineChart,
  AreaChart,
  BarChart,
  ScatterChart,
  PieChart,
  Axis,
  CartesianGrid,
  ChartLegend,
  ChartTooltip,
}

export interface AwesomeGraphsOptions {
  /** A theme name or partial theme applied to every chart in the app. */
  theme?: ThemeInput
  /** Prefix for globally registered components, e.g. `'Ag'` -> `<AgLineChart>`. */
  prefix?: string
}

/**
 * Vue plugin that globally registers every chart component and, optionally,
 * provides an app-wide default theme.
 *
 * ```ts
 * import { createApp } from 'vue'
 * import AwesomeGraphs from 'awesome-graphs-vue3'
 * import 'awesome-graphs-vue3/style.css'
 *
 * createApp(App).use(AwesomeGraphs, { theme: 'dark' }).mount('#app')
 * ```
 */
export const AwesomeGraphs: Plugin = {
  install(app: App, options: AwesomeGraphsOptions = {}) {
    const prefix = options.prefix ?? ''
    for (const [name, component] of Object.entries(components)) {
      app.component(`${prefix}${name}`, component)
    }
    if (options.theme != null) {
      app.provide(
        themeInjectionKey,
        computed(() => resolveTheme(options.theme)),
      )
    }
  },
}

export default AwesomeGraphs
