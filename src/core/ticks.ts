import type { Primitive } from '../types'
import type { ScaleLike } from './scales'

/** A single resolved tick with its data value and pixel offset along the axis. */
export interface Tick {
  value: Primitive
  /** Pixel offset along the axis (already centered for band scales). */
  offset: number
}

/**
 * Generate the ticks for any scale.
 *
 * - Band/point scales: one tick per domain entry, centered within the band.
 * - Continuous scales (linear/time/log): uses the scale's own `.ticks()`.
 * - `explicit` values, when provided, override automatic generation.
 */
export function generateTicks(
  scale: ScaleLike,
  count?: number,
  explicit?: Primitive[],
): Tick[] {
  const apply = scale as unknown as (value: Primitive) => number

  // Band & point scales expose `bandwidth()`. Point scales report bandwidth 0,
  // so the centering term naturally vanishes for them.
  if (typeof scale.bandwidth === 'function') {
    const halfBand = scale.bandwidth() / 2
    const domain = (explicit ?? (scale.domain() as Primitive[]))
    return domain.map((value) => ({ value, offset: apply(value) + halfBand }))
  }

  // Continuous scales.
  const values =
    explicit ??
    (typeof scale.ticks === 'function'
      ? (scale.ticks(count) as Primitive[])
      : (scale.domain() as Primitive[]))

  return values.map((value) => ({ value, offset: apply(value) }))
}
