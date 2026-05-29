import { format as d3Format } from 'd3-format'
import { timeFormat } from 'd3-time-format'
import type { FormatInput, Primitive, ValueFormatter } from '../types'

/** Default numeric formatter: grouped thousands, up to 3 trimmed decimals. */
export const defaultNumberFormat: ValueFormatter = (value) => {
  if (value == null || value === '') return ''
  if (value instanceof Date) return value.toLocaleDateString()
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return String(value)
  if (Number.isInteger(n)) return n.toLocaleString('en-US')
  return n.toLocaleString('en-US', { maximumFractionDigits: 3 })
}

/** Identity formatter that simply stringifies the value. */
export const identityFormat: ValueFormatter = (value) =>
  value == null ? '' : value instanceof Date ? value.toISOString() : String(value)

function safeNumberFormat(specifier: string): (n: number) => string {
  try {
    return d3Format(specifier)
  } catch {
    return (n) => String(n)
  }
}

function safeTimeFormat(specifier: string): (d: Date) => string {
  try {
    return timeFormat(specifier)
  } catch {
    return (d) => d.toISOString()
  }
}

/**
 * Resolve a {@link FormatInput} into a concrete formatter function.
 *
 * - A function is used as-is.
 * - A string containing `%` is treated as a d3 *time* format specifier.
 * - Any other string is treated as a d3 *number* format specifier.
 * - `undefined` falls back to the provided default formatter.
 */
export function resolveFormatter(
  input: FormatInput | undefined,
  fallback: ValueFormatter = defaultNumberFormat,
): ValueFormatter {
  if (input == null) return fallback
  if (typeof input === 'function') return input

  // Time format directives are `%` followed by an optional pad flag and a
  // letter (e.g. `%Y`, `%-m`, `%B`). A trailing `%` (the percent number type,
  // e.g. `.0%`) is NOT a time format, so we must not match on `%` alone.
  const isTimeSpec = /%[-_0^#]?[a-zA-Z]/.test(input)
  if (isTimeSpec) {
    const fmt = safeTimeFormat(input)
    return (value: Primitive) => {
      if (value == null || value === '') return ''
      const date = value instanceof Date ? value : new Date(value as never)
      return Number.isNaN(date.getTime()) ? String(value) : fmt(date)
    }
  }

  const fmt = safeNumberFormat(input)
  return (value: Primitive) => {
    if (value == null || value === '') return ''
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? fmt(n) : String(value)
  }
}
