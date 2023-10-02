import { DataSeriesFrame } from '../types'

interface PictogramProps {
  d: string
  x: number
  y: number
  width: number
  height: number
}

type PictorialDataPoint = {
  value: number
}

export interface PictorialDataSeriesProps {
  frame: DataSeriesFrame
  dataPoints: PictorialDataPoint[]
  columns: number
  rows: number
  Pictogram: React.FC<PictogramProps>
  stroke: string
  fill: string
  Component: any
}
