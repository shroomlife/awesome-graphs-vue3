import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

export interface ElementSize {
  width: Ref<number>
  height: Ref<number>
}

/**
 * Reactively track the content-box size of an element via `ResizeObserver`.
 * Falls back to a one-off measurement when `ResizeObserver` is unavailable
 * (e.g. during SSR or in older environments).
 */
export function useElementSize(
  target: Ref<HTMLElement | null | undefined>,
  initial: { width: number; height: number } = { width: 0, height: 0 },
): ElementSize {
  const width = ref(initial.width)
  const height = ref(initial.height)
  let observer: ResizeObserver | null = null

  function cleanup() {
    observer?.disconnect()
    observer = null
  }

  function observe(el: HTMLElement) {
    cleanup()
    if (typeof ResizeObserver === 'undefined') {
      const rect = el.getBoundingClientRect()
      width.value = rect.width
      height.value = rect.height
      return
    }
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
      }
    })
    observer.observe(el)
  }

  onMounted(() => {
    if (target.value) observe(target.value)
  })

  watch(target, (el) => {
    if (el) observe(el)
    else cleanup()
  })

  onBeforeUnmount(cleanup)

  return { width, height }
}
