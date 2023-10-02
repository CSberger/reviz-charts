export type PathType =
  | 'line'
  | 'area'
  | 'step'
  | 'curveStepAfter'
  | 'curveStepBefore'
  | 'curveBasis'
  | 'curveCardinal'
  | 'curveMonotoneX'
  | 'curveMonotoneY'
  | 'curveNatural'
  | 'curveLinear'

export enum CurveEnum {
  LINE = 'line',
  AREA = 'area',
  STEP = 'step',
  STEP_AFTER = 'curveStepAfter',
  STEP_BEFORE = 'curveStepBefore',
  BASIS = 'curveBasis',
  CARDINAL = 'curveCardinal',
  MONOTONE_X = 'curveMonotoneX',
  MONOTONE_Y = 'curveMonotoneY',
  NATURAL = 'curveNatural',
  LINEAR = 'curveLinear'
}
