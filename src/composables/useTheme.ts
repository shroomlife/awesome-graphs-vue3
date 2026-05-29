import {
  computed,
  inject,
  provide,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'
import type { ChartTheme, ThemeInput } from '../types'
import { lightTheme, resolveTheme } from '../theme/themes'

/** Injection key used to share a resolved theme down the component tree. */
export const themeInjectionKey: InjectionKey<ComputedRef<ChartTheme>> = Symbol('awesome-graphs-theme')

/**
 * Provide a theme to all descendant charts. Used by the `AwesomeGraphs` plugin
 * (app-level default) and by any wrapper component that wants to theme a subtree.
 */
export function provideTheme(
  theme: MaybeRefOrGetter<ThemeInput | undefined>,
): ComputedRef<ChartTheme> {
  const resolved = computed(() => resolveTheme(toValue(theme)))
  provide(themeInjectionKey, resolved)
  return resolved
}

/**
 * Resolve the effective theme for a chart.
 *
 * Precedence: local override (component prop) merged onto the injected theme
 * (or the default light theme when none is provided).
 */
export function useTheme(
  local?: MaybeRefOrGetter<ThemeInput | undefined>,
): ComputedRef<ChartTheme> {
  const injected = inject(themeInjectionKey, null)
  return computed(() => {
    const base = injected ? injected.value : lightTheme
    const localValue = toValue(local)
    return localValue == null ? base : resolveTheme(localValue, base)
  })
}
