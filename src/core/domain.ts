import { stack as d3stack, stackOrderNone, stackOffsetNone, type Series } from 'd3-shape'
import type { ChartData, DataRecord } from '../types'

/** Coerce an unknown cell value to a finite number, or `NaN` when invalid. */
export function toNumber(value: unknown): number {
  if (value == null || value === '') return NaN
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : NaN
}

/** The numeric min/max across every given key in the data (ignoring NaN). */
export function numericExtent(data: ChartData, keys: string[]): [number, number] {
  let lo = Infinity
  let hi = -Infinity
  for (const row of data) {
    for (const key of keys) {
      const n = toNumber(row[key])
      if (Number.isNaN(n)) continue
      if (n < lo) lo = n
      if (n > hi) hi = n
    }
  }
  if (lo === Infinity) return [0, 1]
  if (lo === hi) return lo === 0 ? [0, 1] : [Math.min(0, lo), Math.max(0, hi)]
  return [lo, hi]
}

/**
 * Build d3 stacks for the given keys. Returns one {@link Series} per key, each
 * being an array of `[y0, y1]` baseline/top pairs aligned with `data`.
 */
export function createStack(data: ChartData, keys: string[]): Series<DataRecord, string>[] {
  return d3stack<DataRecord, string>()
    .keys(keys)
    .value((row, key) => {
      const n = toNumber(row[key])
      return Number.isNaN(n) ? 0 : n
    })
    .order(stackOrderNone)
    .offset(stackOffsetNone)(data)
}

/** The combined `[min, max]` extent across all stacked series tops/baselines. */
export function stackedExtent(series: Series<DataRecord, string>[]): [number, number] {
  let lo = 0
  let hi = 0
  for (const layer of series) {
    for (const point of layer) {
      if (point[0] < lo) lo = point[0]
      if (point[1] > hi) hi = point[1]
    }
  }
  return [lo, hi]
}

/**
 * Resolve a final numeric domain from a computed extent plus user overrides.
 * `min`/`max` may be explicit numbers or `'auto'`. When `baseline` is true the
 * domain is extended to include zero (sensible for bar/area charts).
 */
export function resolveNumericDomain(
  extent: [number, number],
  options: { min?: number | 'auto'; max?: number | 'auto'; baseline?: boolean } = {},
): [number, number] {
  let [lo, hi] = extent
  if (options.baseline) {
    lo = Math.min(0, lo)
    hi = Math.max(0, hi)
  }
  if (typeof options.min === 'number') lo = options.min
  if (typeof options.max === 'number') hi = options.max
  if (lo === hi) hi = lo + 1
  return [lo, hi]
}
