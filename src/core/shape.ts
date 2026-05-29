import { line as d3line, area as d3area, arc as d3arc, pie as d3pie } from 'd3-shape'
import { resolveCurve } from './curves'
import type { CurveType } from '../types'

/** A line vertex in pixel space, or `null` to create a gap in the line. */
export type LinePoint = [number, number] | null

/** Build an SVG path string for a poly-line through the given pixel points. */
export function linePath(points: LinePoint[], curve: CurveType = 'linear'): string {
  const generator = d3line<LinePoint>()
    .defined((p) => p != null)
    .x((p) => (p as [number, number])[0])
    .y((p) => (p as [number, number])[1])
    .curve(resolveCurve(curve))
  return generator(points) ?? ''
}

/** An area vertex with a baseline (`y0`) and top (`y1`) in pixel space. */
export interface AreaPoint {
  x: number
  y0: number
  y1: number
}

/** Build an SVG path string for a filled area between `y0` and `y1`. */
export function areaPath(points: (AreaPoint | null)[], curve: CurveType = 'linear'): string {
  const generator = d3area<AreaPoint | null>()
    .defined((p) => p != null)
    .x((p) => (p as AreaPoint).x)
    .y0((p) => (p as AreaPoint).y0)
    .y1((p) => (p as AreaPoint).y1)
    .curve(resolveCurve(curve))
  return generator(points) ?? ''
}

/** Input datum for the pie layout. */
export interface PieDatum {
  key: string
  value: number
}

/** A resolved pie/donut slice with its angular extent. */
export interface PieSliceLayout {
  data: PieDatum
  index: number
  startAngle: number
  endAngle: number
  padAngle: number
}

export interface PieOptions {
  startAngle?: number
  endAngle?: number
  padAngle?: number
  /** When false (default) slices keep input order; true sorts by value desc. */
  sort?: boolean
}

/** Compute slice angles for a pie/donut chart. Negative values are clamped. */
export function computePie(data: PieDatum[], options: PieOptions = {}): PieSliceLayout[] {
  const generator = d3pie<PieDatum>()
    .value((d) => (d.value > 0 ? d.value : 0))
    .startAngle(options.startAngle ?? 0)
    .endAngle(options.endAngle ?? 2 * Math.PI)
    .padAngle(options.padAngle ?? 0)
  if (options.sort) generator.sort((a, b) => b.value - a.value)
  else generator.sort(null)
  return generator(data).map((slice) => ({
    data: slice.data,
    index: slice.index,
    startAngle: slice.startAngle,
    endAngle: slice.endAngle,
    padAngle: slice.padAngle,
  }))
}

export interface ArcOptions {
  innerRadius: number
  outerRadius: number
  cornerRadius?: number
  padAngle?: number
}

interface ArcInput {
  startAngle: number
  endAngle: number
  padAngle?: number
}

/** Build an SVG path string for a single arc/slice. */
export function arcPath(slice: ArcInput, options: ArcOptions): string {
  const generator = d3arc<ArcInput>()
    .innerRadius(options.innerRadius)
    .outerRadius(options.outerRadius)
    .cornerRadius(options.cornerRadius ?? 0)
    .padAngle(options.padAngle ?? slice.padAngle ?? 0)
  return generator(slice) ?? ''
}

/** The `[x, y]` centroid of an arc, useful for positioning slice labels. */
export function arcCentroid(slice: ArcInput, options: ArcOptions): [number, number] {
  const generator = d3arc<ArcInput>()
    .innerRadius(options.innerRadius)
    .outerRadius(options.outerRadius)
  return generator.centroid(slice)
}
