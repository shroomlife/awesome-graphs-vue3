import type { Bounds, Margin, MarginInput } from '../types'

/** Sensible default margins leaving room for axis ticks & labels. */
export const DEFAULT_MARGIN: Margin = { top: 16, right: 24, bottom: 32, left: 48 }

/**
 * Normalise a margin input into a full {@link Margin}.
 * Accepts a number (applied to all sides), a partial object, or nothing.
 */
export function resolveMargin(input?: MarginInput, base: Margin = DEFAULT_MARGIN): Margin {
  if (input == null) return { ...base }
  if (typeof input === 'number') {
    return { top: input, right: input, bottom: input, left: input }
  }
  return { ...base, ...input }
}

/**
 * Compute the inner plotting rectangle from the outer SVG size and margins.
 * Width/height are clamped to be non-negative so charts never crash on tiny
 * or zero-sized containers.
 */
export function getBounds(width: number, height: number, margin: Margin): Bounds {
  const innerWidth = Math.max(0, width - margin.left - margin.right)
  const innerHeight = Math.max(0, height - margin.top - margin.bottom)
  return {
    left: margin.left,
    top: margin.top,
    right: margin.left + innerWidth,
    bottom: margin.top + innerHeight,
    width: innerWidth,
    height: innerHeight,
  }
}
