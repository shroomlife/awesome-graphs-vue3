/**
 * Built-in categorical color palettes. These are carefully chosen to be
 * vivid, distinguishable and pleasant on both light and dark backgrounds.
 */
export const palettes: Record<string, string[]> = {
  // The signature "awesome" palette — modern, balanced, high contrast.
  awesome: [
    '#6366f1', // indigo
    '#06b6d4', // cyan
    '#f59e0b', // amber
    '#ef4444', // red
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#3b82f6', // blue
  ],
  vivid: [
    '#ff4d4f',
    '#ffa940',
    '#ffec3d',
    '#73d13d',
    '#36cfc9',
    '#40a9ff',
    '#9254de',
    '#f759ab',
  ],
  pastel: [
    '#a5b4fc',
    '#67e8f9',
    '#fcd34d',
    '#fca5a5',
    '#6ee7b7',
    '#c4b5fd',
    '#f9a8d4',
    '#5eead4',
  ],
  cool: ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6'],
  warm: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#ec4899', '#d946ef', '#fb7185', '#fbbf24'],
  monochromeBlue: ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'],
}

/** The default palette used when none is specified. */
export const DEFAULT_PALETTE = palettes.awesome

/** Pick a color from a palette by index, wrapping around when out of range. */
export function colorAt(palette: string[], index: number): string {
  if (palette.length === 0) return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
  return palette[((index % palette.length) + palette.length) % palette.length]
}

/**
 * Convert a hex color (`#rgb` / `#rrggbb`) to an `rgba()` string with the
 * given alpha. Used for gradient fills and translucent areas. Non-hex inputs
 * are returned unchanged (e.g. CSS variables or named colors).
 */
export function withAlpha(color: string, alpha: number): string {
  const hex = color.trim()
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex)
  if (!match) return color
  let r: number
  let g: number
  let b: number
  if (match[1].length === 3) {
    r = parseInt(match[1][0] + match[1][0], 16)
    g = parseInt(match[1][1] + match[1][1], 16)
    b = parseInt(match[1][2] + match[1][2], 16)
  } else {
    r = parseInt(match[1].slice(0, 2), 16)
    g = parseInt(match[1].slice(2, 4), 16)
    b = parseInt(match[1].slice(4, 6), 16)
  }
  const a = Math.max(0, Math.min(1, alpha))
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
