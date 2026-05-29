/**
 * Core public type definitions for awesome-graphs-vue3.
 *
 * These types describe the data and configuration contract shared across all
 * chart components. They are intentionally framework-agnostic so they can be
 * reused by the headless `core/` layer, the composables and the components.
 */

/** A single row of chart data, e.g. `{ month: 'Jan', sales: 120, profit: 30 }`. */
export type DataRecord = Record<string, unknown>

/** The tabular data shape consumed by cartesian charts. */
export type ChartData = DataRecord[]

/** Inner/outer spacing around the plotting area, in pixels. */
export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

/** A partial margin where any side may be omitted (merged with defaults). */
export type MarginInput = Partial<Margin> | number

/** The computed rectangular plotting area (everything inside the margins). */
export interface Bounds {
  /** Distance from the SVG left edge to the inner area. */
  left: number
  /** Distance from the SVG top edge to the inner area. */
  top: number
  /** Distance from the SVG left edge to the inner area's right edge. */
  right: number
  /** Distance from the SVG top edge to the inner area's bottom edge. */
  bottom: number
  /** Inner width in pixels. */
  width: number
  /** Inner height in pixels. */
  height: number
}

/**
 * Curve interpolation used to connect points in line and area charts.
 * Maps onto the d3-shape curve factories.
 */
export type CurveType =
  | 'linear'
  | 'smooth'
  | 'monotone'
  | 'natural'
  | 'step'
  | 'stepBefore'
  | 'stepAfter'
  | 'basis'
  | 'cardinal'
  | 'catmullRom'

/** The kind of scale used for an axis. */
export type ScaleType = 'linear' | 'log' | 'time' | 'band' | 'point'

/** How the x values should be interpreted by cartesian charts. */
export type XAxisType = 'category' | 'linear' | 'time'

/** A value that can be formatted on an axis or in a tooltip. */
export type Primitive = string | number | Date | null | undefined

/** A function that turns a raw value into a display string. */
export type ValueFormatter = (value: Primitive, index: number) => string

/** Either a d3-format/d3-time-format string or a custom formatter function. */
export type FormatInput = string | ValueFormatter

/**
 * Configuration for a single data series in a cartesian chart
 * (line / area / bar). Each series reads one numeric `key` from every row.
 */
export interface SeriesConfig {
  /** The data key this series reads its numeric value from. */
  key: string
  /** Human readable name shown in the legend & tooltip (defaults to `key`). */
  name?: string
  /** Explicit color; falls back to the theme palette by index. */
  color?: string
  /** Curve interpolation for line/area series. */
  curve?: CurveType
  /** Stroke width in px for line/area outlines. */
  strokeWidth?: number
  /** Dashed stroke: `true` for a default dash, or an explicit dash array. */
  dashed?: boolean | number[]
  /** Show point markers: always, never, or only on hover. */
  showPoints?: boolean | 'hover'
  /** Marker radius in px. */
  pointRadius?: number
  /** Fill opacity for area series (0–1). */
  fillOpacity?: number
  /** Render the area fill as a vertical gradient. */
  gradient?: boolean
  /** Stack id; series sharing an id are stacked together. `true` => 'default'. */
  stack?: string | boolean
  /** Hide this series from the initial render (still listed in the legend). */
  hidden?: boolean
}

/** Configuration for a cartesian axis (x or y). */
export interface AxisConfig {
  /** Whether the axis (line, ticks, labels) is rendered. */
  show?: boolean
  /** A title rendered alongside the axis. */
  label?: string
  /** Suggested number of ticks (d3 chooses nice values near this count). */
  tickCount?: number
  /** Explicit tick values, overriding automatic tick generation. */
  tickValues?: Primitive[]
  /** Format for tick labels: a d3 format string or a function. */
  tickFormat?: FormatInput
  /** Lower bound of the domain; `'auto'` derives it from the data. */
  min?: number | 'auto'
  /** Upper bound of the domain; `'auto'` derives it from the data. */
  max?: number | 'auto'
  /** Extend the domain to nice round numbers. */
  nice?: boolean
  /** Draw the axis baseline. */
  line?: boolean
  /** Draw tick marks. */
  ticks?: boolean
  /** Length of tick marks in px. */
  tickSize?: number
  /** Inner padding (0–1) for band scales used by bar charts. */
  padding?: number
}

/** Where the legend is positioned relative to the plotting area. */
export type LegendPosition = 'top' | 'right' | 'bottom' | 'left'

/** Horizontal/vertical alignment of legend items. */
export type LegendAlign = 'start' | 'center' | 'end'

/** Configuration for the chart legend. */
export interface LegendConfig {
  show?: boolean
  position?: LegendPosition
  align?: LegendAlign
  /** Shape of the color swatch. */
  symbol?: 'circle' | 'square' | 'line'
  /** Allow toggling series visibility by clicking legend items. */
  interactive?: boolean
}

/** Configuration for the hover tooltip. */
export interface TooltipConfig {
  show?: boolean
  /** Format applied to series values inside the tooltip. */
  valueFormat?: FormatInput
  /** Format applied to the x label / header inside the tooltip. */
  labelFormat?: FormatInput
  /** Draw a crosshair / indicator line at the hovered position. */
  crosshair?: boolean
  /** Sort tooltip entries by value descending. */
  sort?: boolean
}

/** A resolved entry describing one series, used by legend & tooltip. */
export interface SeriesMeta {
  key: string
  name: string
  color: string
  hidden: boolean
  index: number
}

/** A single item shown in the tooltip for the hovered x position. */
export interface TooltipItem {
  key: string
  name: string
  color: string
  value: number | null
  formattedValue: string
}

/** The reactive payload exposed while a tooltip is active. */
export interface TooltipState {
  visible: boolean
  /** Pixel coordinates within the SVG. */
  x: number
  y: number
  /** The x label/header for the hovered position. */
  label: string
  /** The resolved per-series entries. */
  items: TooltipItem[]
  /** Index of the hovered data row, if applicable. */
  dataIndex: number
}

/** A fully resolved color theme used by every chart. */
export interface ChartTheme {
  /** Theme name (used for the wrapper css class, e.g. `ag-theme-light`). */
  name: string
  /** Whether this is a dark theme (affects default gradients/opacities). */
  dark: boolean
  /** Categorical color palette for series. */
  palette: string[]
  /** Plot background (transparent by default). */
  background: string
  /** Primary text color. */
  foreground: string
  /** Secondary / muted text color (axis labels, ticks). */
  muted: string
  /** Grid line color. */
  grid: string
  /** Axis line & tick color. */
  axis: string
  /** Default font family. */
  fontFamily: string
  /** Base font size in px. */
  fontSize: number
  /** Tooltip styling. */
  tooltip: {
    background: string
    color: string
    border: string
    radius: number
    shadow: string
  }
}

/** A partial theme override that is merged onto a base theme. */
export type ThemeInput = string | Partial<ChartTheme>
