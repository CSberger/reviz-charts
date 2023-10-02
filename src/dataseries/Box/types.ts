import { Frame } from '../types'

export type BoxProps = Frame & {
  dataPointProps: any
  medianPosition?: number
  q1Position?: number
  q3Position?: number
  upperFencePosition?: number
  lowerFencePosition?: number
  meanPosition?: number
  maxValuePosition?: number
  minValuePosition?: number
  outlierPositions?: number[]
  valuesPositions?: number[]
  boxWidthFraction?: number
  whiskerWidthFraction?: number
}
