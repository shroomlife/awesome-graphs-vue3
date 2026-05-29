import type { ChartTheme, ThemeInput } from '../types'
import { palettes } from '../core/color'

/** Default cross-platform UI font stack. */
export const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"

/** The built-in light theme. */
export const lightTheme: ChartTheme = {
  name: 'light',
  dark: false,
  palette: palettes.awesome,
  background: 'transparent',
  foreground: '#1f2937',
  muted: '#6b7280',
  grid: '#e5e7eb',
  axis: '#cbd5e1',
  fontFamily: FONT_STACK,
  fontSize: 12,
  tooltip: {
    background: '#ffffff',
    color: '#111827',
    border: '#e5e7eb',
    radius: 10,
    shadow: '0 6px 24px rgba(15, 23, 42, 0.12)',
  },
}

/** The built-in dark theme. */
export const darkTheme: ChartTheme = {
  name: 'dark',
  dark: true,
  palette: palettes.awesome,
  background: 'transparent',
  foreground: '#f3f4f6',
  muted: '#9ca3af',
  grid: '#334155',
  axis: '#475569',
  fontFamily: FONT_STACK,
  fontSize: 12,
  tooltip: {
    background: '#1e293b',
    color: '#f1f5f9',
    border: '#334155',
    radius: 10,
    shadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
  },
}

/** Registry of named themes available by string. */
export const themes: Record<string, ChartTheme> = {
  light: lightTheme,
  dark: darkTheme,
}

/**
 * Resolve a {@link ThemeInput} into a full {@link ChartTheme}.
 *
 * - A string selects a named theme (falling back to `base` if unknown).
 * - A partial object is deep-merged onto `base`.
 * - `undefined` returns `base` unchanged.
 */
export function resolveTheme(input?: ThemeInput, base: ChartTheme = lightTheme): ChartTheme {
  if (input == null) return base
  if (typeof input === 'string') return themes[input] ?? base
  return {
    ...base,
    ...input,
    tooltip: { ...base.tooltip, ...(input.tooltip ?? {}) },
  }
}
