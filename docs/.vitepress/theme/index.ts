import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
// Use the library source directly so the docs always reflect the latest code.
import AwesomeGraphs from '../../../src'
import '../../../src/styles/base.css'
import './custom.css'
import Demo from './Demo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AwesomeGraphs)
    app.component('Demo', Demo)
  },
} satisfies Theme
