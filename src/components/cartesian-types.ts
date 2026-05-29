import type { ScaleLinear, ScaleBand, ScalePoint, ScaleTime } from 'd3-scale'
import type {
  AxisConfig,
  Bounds,
  ChartData,
  ChartTheme,
  LegendConfig,
  MarginInput,
  Primitive,
  SeriesConfig,
  SeriesMeta,
  ThemeInput,
  TooltipConfig,
  XAxisType,
} from '../types'

/** The kind of x scale a cartesian chart uses. */
export type XScaleKind = 'band' | 'point' | 'continuous'

/** Any x scale a cartesian chart might build. */
export type CartesianXScale =
  | ScaleBand<string>
  | ScalePoint<string>
  | ScaleLinear<number, number>
  | ScaleTime<number, number>

/**
 * The reactive drawing context handed to the default slot of `CartesianChart`.
 * Series components (lines, areas, bars) use this to render their geometry,
 * so power users can compose entirely custom cartesian charts.
 */
export interface CartesianSlotProps {
  /** Inner plotting rectangle. */
  bounds: Bounds
  /** The resolved x scale (band / point / linear / time). */
  xScale: CartesianXScale
  /** The resolved y scale (always linear for now). */
  yScale: ScaleLinear<number, number>
  /** Visible series, each with a resolved color and palette index. */
  series: SeriesMeta[]
  /** The raw x value for each data row. */
  xValues: Primitive[]
  /** Pixel x position (band center for categorical scales) per data row. */
  xPositions: number[]
  /** Band width in px (0 for non-band scales). */
  bandwidth: number
  /** Pixel y of the zero baseline, clamped to the plot area. */
  baseline: number
  /** Whether the chart is stacking its series. */
  stacked: boolean
  /** For stacked charts: series key -> `[y0, y1]` baseline/top per row (data units). */
  stacks: Map<string, Array<[number, number]>>
  /** Index of the currently hovered data row, or -1. */
  hoveredIndex: number
  /** Entrance animation progress in [0, 1]. */
  progress: number
  /** The resolved theme. */
  theme: ChartTheme
  /** A unique id prefix for this chart's `<defs>` entries. */
  uid: string
}

/**
 * The user-facing props shared by all cartesian charts (line, area, bar).
 * Concrete charts extend this with their own options and forward the base
 * props to the internal `CartesianChart`.
 */
export interface BaseCartesianProps {
  /** Tabular data: one object per row. */
  data: ChartData
  /** Data key holding the x value of each row. */
  x: string
  /** Series to plot. A plain string is shorthand for `{ key }`. */
  series: (SeriesConfig | string)[]
  /** How x values are interpreted: category (default), linear or time. */
  xType?: XAxisType
  /** Explicit pixel width; omit for a responsive width. */
  width?: number
  /** Plot height in pixels (legend is added on top). */
  height?: number
  /** Lock height to `width / aspectRatio` for responsive charts. */
  aspectRatio?: number
  /** Plot margins (number for all sides, or per-side overrides). */
  margin?: MarginInput
  /** Theme name or partial theme override. */
  theme?: ThemeInput
  /** Palette name or explicit color array for the series. */
  palette?: string | string[]
  /** X axis configuration. */
  xAxis?: AxisConfig
  /** Y axis configuration. */
  yAxis?: AxisConfig
  /** Grid lines: `true`/`false`, or per-direction `{ x, y }`. */
  grid?: boolean | { x?: boolean; y?: boolean }
  /** Legend: `true`/`false`, or a {@link LegendConfig}. */
  legend?: boolean | LegendConfig
  /** Tooltip: `true`/`false`, or a {@link TooltipConfig}. */
  tooltip?: boolean | TooltipConfig
  /** Play the entrance animation (respects prefers-reduced-motion). */
  animate?: boolean
  /** Accessible label for the chart's `role="img"` SVG. */
  ariaLabel?: string
  /** Render a visually-hidden data table for screen readers (default true). */
  accessibleTable?: boolean
}
