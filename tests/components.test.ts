import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { LineChart, AreaChart, BarChart, ScatterChart, PieChart } from '../src'

const data = [
  { month: 'Jan', sales: 30, profit: 10 },
  { month: 'Feb', sales: 50, profit: 20 },
  { month: 'Mar', sales: 40, profit: 25 },
]

// Explicit size + no animation => deterministic, fully-rendered geometry.
const common = { width: 480, height: 320, animate: false }

describe('LineChart', () => {
  it('renders one line path per series with a non-empty path', () => {
    const wrapper = mount(LineChart, {
      props: { data, x: 'month', series: ['sales', 'profit'], ...common },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    const lines = wrapper.findAll('path.ag-line')
    expect(lines).toHaveLength(2)
    expect(lines[0].attributes('d')).toBeTruthy()
    expect(lines[0].attributes('d')!.startsWith('M')).toBe(true)
  })

  it('renders axis tick labels and a legend for multiple series', () => {
    const wrapper = mount(LineChart, {
      props: { data, x: 'month', series: ['sales', 'profit'], ...common },
    })
    const labels = wrapper.findAll('text.ag-axis__label').map((n) => n.text())
    expect(labels).toContain('Jan')
    expect(wrapper.findAll('.ag-legend__item')).toHaveLength(2)
  })

  it('renders point markers when showPoints is enabled', () => {
    const wrapper = mount(LineChart, {
      props: { data, x: 'month', series: ['sales'], showPoints: true, ...common },
    })
    expect(wrapper.findAll('circle.ag-point').length).toBeGreaterThanOrEqual(3)
  })
})

describe('AreaChart', () => {
  it('renders an area fill per series', () => {
    const wrapper = mount(AreaChart, {
      props: { data, x: 'month', series: ['sales', 'profit'], ...common },
    })
    expect(wrapper.findAll('path.ag-area')).toHaveLength(2)
  })

  it('supports stacking', () => {
    const wrapper = mount(AreaChart, {
      props: { data, x: 'month', series: ['sales', 'profit'], stacked: true, ...common },
    })
    expect(wrapper.findAll('path.ag-area')).toHaveLength(2)
  })
})

describe('BarChart', () => {
  it('renders grouped bars (series x rows)', () => {
    const wrapper = mount(BarChart, {
      props: { data, x: 'month', series: ['sales', 'profit'], ...common },
    })
    const bars = wrapper.findAll('rect.ag-bar')
    expect(bars).toHaveLength(6)
    expect(Number(bars[0].attributes('height'))).toBeGreaterThan(0)
  })

  it('renders stacked bars', () => {
    const wrapper = mount(BarChart, {
      props: { data, x: 'month', series: ['sales', 'profit'], stacked: true, ...common },
    })
    expect(wrapper.findAll('rect.ag-bar')).toHaveLength(6)
  })
})

describe('ScatterChart', () => {
  const points = [
    { x: 1, y: 4, weight: 10 },
    { x: 2, y: 7, weight: 30 },
    { x: 3, y: 3, weight: 20 },
    { x: 4, y: 9, weight: 50 },
  ]

  it('renders one point per row', () => {
    const wrapper = mount(ScatterChart, {
      props: { data: points, x: 'x', series: ['y'], ...common },
    })
    expect(wrapper.findAll('circle.ag-point').length).toBeGreaterThanOrEqual(4)
  })

  it('scales bubble radius from a size key', () => {
    const wrapper = mount(ScatterChart, {
      props: { data: points, x: 'x', series: ['y'], size: 'weight', sizeRange: [5, 25], ...common },
    })
    const radii = wrapper
      .findAll('circle.ag-point')
      .map((c) => Number(c.attributes('r')))
      .filter((r) => !Number.isNaN(r))
    // The largest weight (50) should map to the max radius (25).
    expect(Math.max(...radii)).toBeCloseTo(25, 1)
  })
})

describe('PieChart', () => {
  const pieData = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 30 },
  ]

  it('renders one arc per slice', () => {
    const wrapper = mount(PieChart, {
      props: { data: pieData, value: 'value', label: 'name', ...common },
    })
    expect(wrapper.findAll('path.ag-arc')).toHaveLength(3)
  })

  it('renders as a donut when requested', () => {
    const wrapper = mount(PieChart, {
      props: { data: pieData, value: 'value', label: 'name', donut: true, ...common },
    })
    const arcs = wrapper.findAll('path.ag-arc')
    expect(arcs).toHaveLength(3)
    expect(arcs[0].attributes('d')).toBeTruthy()
  })
})

describe('theming', () => {
  it('applies the dark theme class and CSS variables', () => {
    const wrapper = mount(LineChart, {
      props: { data, x: 'month', series: ['sales'], theme: 'dark', ...common },
    })
    const root = wrapper.find('.ag-chart')
    expect(root.classes()).toContain('ag-theme-dark')
    expect(root.attributes('style')).toContain('--ag-foreground')
  })
})
