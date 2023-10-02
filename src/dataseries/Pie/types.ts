import PieDataSeries from '.'
import { DataSeriesFrame } from '../types'

export interface PieDataPointProps {
  cx: number
  cy: number
  dataPointProps: any
  innerRadius: number
  outerRadius: number
  angleStart: number
  angleEnd: number
  fill: string
  stroke: string
}

export interface PieDataSeriesProps {
  dataPoints: { value: number; label: string }[]
  frame: DataSeriesFrame
  DataPointComponent?: React.ComponentType<PieDataPointProps>
  startAngle?: number
  innerRadiusPercent?: number
  backgroundCircleStyle?: React.CSSProperties
}
