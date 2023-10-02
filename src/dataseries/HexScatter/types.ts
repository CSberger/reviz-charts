import { DataSeriesFrame, Domain2D } from '../types'

export type HEX2D = {
  q: number
  r: number
}

export enum HexOrientation {
  FLAT,
  POINTY
}

interface HexPointMap {
  [key: string]: Object
}

export type HexScatterDSParams = {
  className?: string
  DataPointComponent?: any
  dataPointMap: HexPointMap
  domain: Domain2D | undefined
  frame: DataSeriesFrame
  hexOrientation?: HexOrientation
  size: number
}
