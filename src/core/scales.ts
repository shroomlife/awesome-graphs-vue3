import {
  scaleLinear,
  scaleBand,
  scalePoint,
  scaleLog,
  scaleTime,
  type ScaleLinear,
  type ScaleBand,
  type ScalePoint,
  type ScaleTime,
  type ScaleLogarithmic,
} from 'd3-scale'

/**
 * A minimal structural interface satisfied by every d3 scale we use.
 * Accepting this instead of a big union keeps helper signatures simple.
 */
export interface ScaleLike {
  (value: never): number | undefined
  domain(): unknown[]
  range(): number[]
  bandwidth?: () => number
  step?: () => number
  ticks?: (count?: number) => unknown[]
}

export type ContinuousScale =
  | ScaleLinear<number, number>
  | ScaleTime<number, number>
  | ScaleLogarithmic<number, number>

export type CategoricalScale = ScaleBand<string> | ScalePoint<string>

export interface LinearScaleOptions {
  domain: [number, number]
  range: [number, number]
  nice?: boolean | number
  clamp?: boolean
}

export function createLinearScale(options: LinearScaleOptions): ScaleLinear<number, number> {
  const scale = scaleLinear().domain(options.domain).range(options.range)
  if (options.nice) scale.nice(typeof options.nice === 'number' ? options.nice : undefined)
  if (options.clamp) scale.clamp(true)
  return scale
}

export interface LogScaleOptions {
  domain: [number, number]
  range: [number, number]
  base?: number
  clamp?: boolean
}

export function createLogScale(options: LogScaleOptions): ScaleLogarithmic<number, number> {
  const scale = scaleLog().domain(options.domain).range(options.range)
  if (options.base != null) scale.base(options.base)
  if (options.clamp) scale.clamp(true)
  return scale
}

export interface TimeScaleOptions {
  domain: [Date, Date]
  range: [number, number]
  nice?: boolean
  clamp?: boolean
}

export function createTimeScale(options: TimeScaleOptions): ScaleTime<number, number> {
  const scale = scaleTime().domain(options.domain).range(options.range)
  if (options.nice) scale.nice()
  if (options.clamp) scale.clamp(true)
  return scale
}

export interface BandScaleOptions {
  domain: Iterable<string>
  range: [number, number]
  padding?: number
  paddingInner?: number
  paddingOuter?: number
  align?: number
}

export function createBandScale(options: BandScaleOptions): ScaleBand<string> {
  const scale = scaleBand<string>().domain(Array.from(options.domain)).range(options.range)
  if (options.padding != null) scale.padding(options.padding)
  if (options.paddingInner != null) scale.paddingInner(options.paddingInner)
  if (options.paddingOuter != null) scale.paddingOuter(options.paddingOuter)
  if (options.align != null) scale.align(options.align)
  return scale
}

export interface PointScaleOptions {
  domain: Iterable<string>
  range: [number, number]
  padding?: number
  align?: number
}

export function createPointScale(options: PointScaleOptions): ScalePoint<string> {
  const scale = scalePoint<string>().domain(Array.from(options.domain)).range(options.range)
  if (options.padding != null) scale.padding(options.padding)
  if (options.align != null) scale.align(options.align)
  return scale
}
