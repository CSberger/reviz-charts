import { AxisDefinition, DataSeriesFrame, Frame } from '../../types'

export type AxisDefinitionWithTicks = AxisDefinition & {
  numTicks: number
  axisWidth: number
}

export interface AxisDefinitionProps {
  axisDefinition: AxisDefinitionWithTicks
  Component?: React.ComponentType
  frame?: DataSeriesFrame
  height: number
  width: number
  x: number
  y: number
  tickValues: any[]
}

export interface TickProps extends Frame {
  labelText?: string
}
