import { onMounted, onScopeDispose, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

/** Easing functions mapping a normalized time `t` in [0,1] to eased progress. */
export const easing = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutBack: (t: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
}

export type EasingFn = (t: number) => number

const hasRaf = typeof requestAnimationFrame !== 'undefined'

export interface EnterProgressOptions {
  duration?: number
  easing?: EasingFn
  /** When false, the animation is skipped and progress jumps straight to 1. */
  enabled?: MaybeRefOrGetter<boolean>
}

/**
 * Drive a one-shot entrance animation. Returns a ref that eases from 0 to 1
 * once on mount. Charts multiply geometry by this value so bars grow, lines
 * draw and arcs sweep into view. Respects `prefers-reduced-motion`.
 */
export function useEnterProgress(options: EnterProgressOptions = {}): Ref<number> {
  const duration = options.duration ?? 700
  const ease = options.easing ?? easing.easeOutCubic
  const progress = ref(0)
  let raf = 0
  let startTime = 0

  function prefersReducedMotion() {
    return (
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }

  function step(now: number) {
    if (!startTime) startTime = now
    const t = Math.min(1, (now - startTime) / duration)
    progress.value = ease(t)
    if (t < 1) raf = requestAnimationFrame(step)
    else raf = 0
  }

  onMounted(() => {
    const enabled = options.enabled == null ? true : toValue(options.enabled)
    if (!enabled || !hasRaf || prefersReducedMotion() || duration <= 0) {
      progress.value = 1
      return
    }
    raf = requestAnimationFrame(step)
  })

  onScopeDispose(() => {
    if (raf) cancelAnimationFrame(raf)
  })

  return progress
}

export interface TweenOptions {
  duration?: number
  easing?: EasingFn
  disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Smoothly tween a scalar toward a reactive source value whenever it changes.
 * Useful for animating between data updates.
 */
export function useTween(source: MaybeRefOrGetter<number>, options: TweenOptions = {}): Ref<number> {
  const duration = options.duration ?? 600
  const ease = options.easing ?? easing.easeOutCubic
  const output = ref(toValue(source))
  let raf = 0
  let startTime = 0
  let from = output.value
  let to = output.value

  function step(now: number) {
    if (!startTime) startTime = now
    const t = Math.min(1, (now - startTime) / duration)
    output.value = from + (to - from) * ease(t)
    if (t < 1) raf = requestAnimationFrame(step)
    else raf = 0
  }

  watch(
    () => toValue(source),
    (next) => {
      if (!hasRaf || toValue(options.disabled)) {
        output.value = next
        return
      }
      if (raf) cancelAnimationFrame(raf)
      from = output.value
      to = next
      startTime = 0
      raf = requestAnimationFrame(step)
    },
  )

  onScopeDispose(() => {
    if (raf) cancelAnimationFrame(raf)
  })

  return output
}
