import { describe, it, expect } from 'vitest'
import { createSSRApp, type Component } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { LineChart, AreaChart, BarChart, ScatterChart, PieChart } from '../src'

/**
 * These tests render the components on the "server" (no DOM) to guarantee
 * compatibility with SSR frameworks such as Nuxt. The components must never
 * touch `window`, `document`, `ResizeObserver` etc. during render.
 */
async function ssr(component: Component, props: Record<string, unknown>): Promise<string> {
  const app = createSSRApp(component, props)
  return renderToString(app)
}

const data = [
  { month: 'Jan', a: 10, b: 5 },
  { month: 'Feb', a: 20, b: 8 },
  { month: 'Mar', a: 15, b: 12 },
]

describe('SSR / Nuxt compatibility', () => {
  it('renders a LineChart to a string with an explicit size', async () => {
    const html = await ssr(LineChart, { data, x: 'month', series: ['a', 'b'], width: 480, height: 300 })
    expect(html).toContain('ag-chart')
    expect(html).toContain('<svg')
    expect(html).toContain('ag-line')
  })

  it('renders AreaChart and BarChart without throwing', async () => {
    const area = await ssr(AreaChart, { data, x: 'month', series: ['a'], width: 480, height: 300 })
    const bar = await ssr(BarChart, { data, x: 'month', series: ['a', 'b'], width: 480, height: 300 })
    expect(area).toContain('ag-area')
    expect(bar).toContain('ag-bar')
  })

  it('renders a ScatterChart to a string', async () => {
    const html = await ssr(ScatterChart, {
      data: [
        { x: 1, y: 4 },
        { x: 2, y: 7 },
      ],
      x: 'x',
      series: ['y'],
      width: 480,
      height: 300,
    })
    expect(html).toContain('ag-point')
  })

  it('renders a PieChart to a string', async () => {
    const html = await ssr(PieChart, {
      data: [
        { name: 'A', value: 1 },
        { name: 'B', value: 2 },
      ],
      value: 'value',
      width: 300,
      height: 300,
    })
    expect(html).toContain('ag-arc')
  })

  it('renders responsive charts (no explicit size) without a browser', async () => {
    // Without a measured width the SVG is deferred to the client; the container
    // must still render server-side without errors.
    const html = await ssr(LineChart, { data, x: 'month', series: ['a'] })
    expect(html).toContain('ag-chart')
  })
})
