import { describe, it, expect } from 'vitest'
import {
  resolveMargin,
  getBounds,
  DEFAULT_MARGIN,
  numericExtent,
  resolveNumericDomain,
  createStack,
  stackedExtent,
  colorAt,
  withAlpha,
  resolveFormatter,
  defaultNumberFormat,
  createLinearScale,
  createBandScale,
  generateTicks,
  linePath,
  areaPath,
  computePie,
} from '../src/core'

describe('bounds', () => {
  it('resolves number, partial and undefined margins', () => {
    expect(resolveMargin(10)).toEqual({ top: 10, right: 10, bottom: 10, left: 10 })
    expect(resolveMargin({ left: 60 })).toEqual({ ...DEFAULT_MARGIN, left: 60 })
    expect(resolveMargin()).toEqual(DEFAULT_MARGIN)
  })

  it('computes a non-negative inner rectangle', () => {
    const b = getBounds(400, 300, { top: 20, right: 20, bottom: 40, left: 50 })
    expect(b.width).toBe(330)
    expect(b.height).toBe(240)
    expect(b.right).toBe(380)
    expect(b.bottom).toBe(260)
  })

  it('clamps to zero for tiny containers', () => {
    const b = getBounds(10, 10, DEFAULT_MARGIN)
    expect(b.width).toBe(0)
    expect(b.height).toBe(0)
  })
})

describe('domain', () => {
  const data = [
    { m: 'Jan', a: 10, b: 5 },
    { m: 'Feb', a: 30, b: 15 },
    { m: 'Mar', a: 20, b: 25 },
  ]

  it('finds the numeric extent across keys', () => {
    expect(numericExtent(data, ['a', 'b'])).toEqual([5, 30])
  })

  it('ignores non-numeric values', () => {
    expect(numericExtent([{ a: 'x' }, { a: 4 }], ['a'])).toEqual([0, 4])
  })

  it('respects explicit min/max and baseline', () => {
    expect(resolveNumericDomain([5, 30], { baseline: true })).toEqual([0, 30])
    expect(resolveNumericDomain([5, 30], { min: 0, max: 50 })).toEqual([0, 50])
  })

  it('stacks series and reports the combined extent', () => {
    const stacked = createStack(data, ['a', 'b'])
    expect(stacked).toHaveLength(2)
    // First row: a stacks 0->10, b stacks 10->15
    expect(stacked[0][0][1]).toBe(10)
    expect(stacked[1][0][1]).toBe(15)
    expect(stackedExtent(stacked)).toEqual([0, 45])
  })
})

describe('color', () => {
  it('wraps palette indices', () => {
    const p = ['#a', '#b', '#c']
    expect(colorAt(p, 0)).toBe('#a')
    expect(colorAt(p, 4)).toBe('#b')
  })

  it('converts hex to rgba', () => {
    expect(withAlpha('#ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)')
    expect(withAlpha('#000', 0.2)).toBe('rgba(0, 0, 0, 0.2)')
  })

  it('leaves non-hex colors untouched', () => {
    expect(withAlpha('var(--c)', 0.5)).toBe('var(--c)')
  })
})

describe('format', () => {
  it('formats numbers by default', () => {
    expect(defaultNumberFormat(1000, 0)).toBe('1,000')
    expect(defaultNumberFormat(3.14159, 0)).toBe('3.142')
  })

  it('resolves d3 number specifiers', () => {
    const fmt = resolveFormatter('.0%')
    expect(fmt(0.42, 0)).toBe('42%')
  })

  it('resolves d3 time specifiers', () => {
    const fmt = resolveFormatter('%Y')
    expect(fmt(new Date('2026-05-29T00:00:00Z'), 0)).toBe('2026')
  })

  it('uses custom formatter functions', () => {
    const fmt = resolveFormatter((v) => `<${v}>`)
    expect(fmt(7, 0)).toBe('<7>')
  })
})

describe('scales & ticks', () => {
  it('maps a linear domain to a range', () => {
    const scale = createLinearScale({ domain: [0, 100], range: [0, 200] })
    expect(scale(50)).toBe(100)
  })

  it('centers band ticks within the band', () => {
    const scale = createBandScale({ domain: ['a', 'b'], range: [0, 200], padding: 0 })
    const ticks = generateTicks(scale)
    expect(ticks.map((t) => t.value)).toEqual(['a', 'b'])
    // band width 100, first band centered at 50
    expect(ticks[0].offset).toBe(50)
  })

  it('generates ~count ticks for continuous scales', () => {
    const scale = createLinearScale({ domain: [0, 10], range: [0, 100] })
    const ticks = generateTicks(scale, 5)
    expect(ticks.length).toBeGreaterThan(2)
    expect(ticks[0].value).toBe(0)
  })
})

describe('shape', () => {
  it('builds a line path', () => {
    const d = linePath([[0, 0], [10, 10], [20, 5]], 'linear')
    expect(d.startsWith('M')).toBe(true)
    expect(d.length).toBeGreaterThan(5)
  })

  it('skips gaps in a line', () => {
    const d = linePath([[0, 0], null, [20, 5]], 'linear')
    expect(d).toContain('M')
  })

  it('builds an area path', () => {
    const d = areaPath([
      { x: 0, y0: 100, y1: 50 },
      { x: 10, y0: 100, y1: 20 },
    ])
    expect(d.startsWith('M')).toBe(true)
  })

  it('computes pie slices spanning a full circle', () => {
    const slices = computePie([
      { key: 'a', value: 1 },
      { key: 'b', value: 3 },
    ])
    expect(slices).toHaveLength(2)
    const total = slices[slices.length - 1].endAngle - slices[0].startAngle
    expect(total).toBeCloseTo(2 * Math.PI, 5)
    // value 1 of 4 => quarter circle
    expect(slices[0].endAngle - slices[0].startAngle).toBeCloseTo(Math.PI / 2, 5)
  })
})
