let counter = 0

/**
 * Generate a unique, DOM-safe id for SVG `<defs>` entries (gradients, clip
 * paths, masks). A module-level counter keeps ids stable and collision-free
 * across multiple chart instances on the same page.
 */
export function useUid(prefix = 'ag'): string {
  counter += 1
  return `${prefix}-${counter}`
}
