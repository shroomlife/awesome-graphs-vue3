import {
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  curveStepBefore,
  curveStepAfter,
  curveBasis,
  curveCardinal,
  curveCatmullRom,
  type CurveFactory,
} from 'd3-shape'
import type { CurveType } from '../types'

const CURVES: Record<CurveType, CurveFactory> = {
  linear: curveLinear,
  smooth: curveCatmullRom,
  monotone: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
  stepBefore: curveStepBefore,
  stepAfter: curveStepAfter,
  basis: curveBasis,
  cardinal: curveCardinal,
  catmullRom: curveCatmullRom,
}

/** Resolve a friendly {@link CurveType} name to its d3-shape curve factory. */
export function resolveCurve(curve: CurveType = 'linear'): CurveFactory {
  return CURVES[curve] ?? curveLinear
}
