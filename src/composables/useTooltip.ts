import { reactive } from 'vue'
import type { TooltipState } from '../types'

export interface UseTooltipReturn {
  state: TooltipState
  show: (payload: Partial<TooltipState>) => void
  move: (x: number, y: number) => void
  hide: () => void
}

/** Reactive tooltip state plus helpers to show, move and hide it. */
export function useTooltip(): UseTooltipReturn {
  const state = reactive<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    items: [],
    dataIndex: -1,
  })

  function show(payload: Partial<TooltipState>) {
    Object.assign(state, payload)
    state.visible = true
  }

  function move(x: number, y: number) {
    state.x = x
    state.y = y
  }

  function hide() {
    state.visible = false
  }

  return { state, show, move, hide }
}
