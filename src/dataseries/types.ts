import { ScaleType } from './utils/makeScale'

export enum OrientationEnum {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export type DP2D = {
  x: number
  y: number
}

export type Frame = {
  x: number
  y: number
  width: number
  height: number
}

export interface DataSeriesFrame extends Frame {}

export type Domain2D = {
  x: [number, number]
  y: [number, number]
}

export type Scale2D = {
  x: [number, number]
  y: [number, number]
}

export type AxisDefinition = {
  label?: string
  domain: number[] | string[]
  scale?: ScaleType
  innerPadding?: number
  outerPadding?: number
}

export interface DataSeriesCartesian2D {
  dataPoints: any[]
  frame: DataSeriesFrame
  DataPointComponent?: any
  axisDefinitions:
    | {
        x: AxisDefinition
        y: AxisDefinition
      }
    | {
        horizontal: AxisDefinition
        vertical: AxisDefinition
      }
    | {
        position: AxisDefinition
        value: AxisDefinition
      }
}

export interface DPFigure {
  x: number
  y: number
  dataPointProps?: any
}
