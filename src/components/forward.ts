/**
 * Return a shallow copy of `obj` without keys whose value is `undefined`.
 *
 * Used when a wrapper chart forwards props to the internal `CartesianChart`
 * via `v-bind`. Passing an explicit `undefined` for a prop whose type includes
 * `Boolean` (e.g. `legend`, `tooltip`, `grid`) triggers Vue's boolean casting
 * and turns it into `false`, suppressing the default. Omitting the key keeps
 * the child component's own default behaviour intact.
 */
export function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = {} as T
  for (const key in obj) {
    if (obj[key] !== undefined) out[key] = obj[key]
  }
  return out
}
