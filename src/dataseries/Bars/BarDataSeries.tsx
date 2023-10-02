import React from "react";
import { scaleBand } from "d3-scale";
import range from "lodash.range";

import Group from "../../components/Group";
import Rect from "../../components/Rect";
import { ScaleType, makeScale } from "../utils/makeScale";
import { AxisDefinition, DataSeriesFrame, Frame, OrientationEnum } from "../types";
import { baseTheme } from "../../Theme";

export interface IDataPoint {
    value: number;
}

interface IBarDataSeries {
    dataPoints?: IDataPoint[];
    axisDefinitions: {
        x: AxisDefinition,
        y: AxisDefinition
    };
    frame: DataSeriesFrame;
    innerPadding: number;
    outerPadding: number;
    orientation: OrientationEnum.vertical | OrientationEnum.horizontal;
    theme?: any;
}

type BarProps = Frame &  {
    dataPointProps: IDataPoint;
    value?: number;
    style?: React.CSSProperties;
}

function HorizontalBar ({
  value,
  x,
  y,
  width,
  height,
  style={},
  ...otherProps
}: BarProps) {
    return (
        <Rect
            className="bar h-bar"
            dataPointProps={{value, ...otherProps}}
            width={width}
            height={height}
            x={x ?? 0}
            y={y ?? 0}
            style={style}
        />
    )
}

function VerticalBar ({
    value,
    x,
    y,
    width,
    height,
    style={},
    ...otherProps
  }: BarProps) {
      return (
          <Rect
              className="bar v-bar"
              dataPointProps={{value, ...otherProps}}
              width={width}
              height={height}
              style={style}
              x={x ?? 0}
              y={y ?? 0}
          />
      )    
}


function BarDataSeries({
  dataPoints = [],
  axisDefinitions,
  frame,
  innerPadding,
  outerPadding,
  orientation,
  theme=baseTheme
}: IBarDataSeries) {
    let barValueScale: any = null;
    let barPositionScale = scaleBand();
    barPositionScale
        .domain(range(0, dataPoints.length).map((i) => i.toString()))
        .paddingInner(innerPadding)
        .paddingOuter(outerPadding);
    let positionRange: [number, number] = [0, 0];
    let valueScaleRange: [number, number] = [0, 0];
    switch (orientation) {
        case OrientationEnum.vertical:
            barValueScale = makeScale(axisDefinitions.y.scale as ScaleType, axisDefinitions.y.domain);
            positionRange = [frame.x, frame.x + frame.width];
            valueScaleRange = [0, frame.height];
            break;
        case OrientationEnum.horizontal:
            barValueScale = makeScale(axisDefinitions.x.scale as ScaleType, axisDefinitions.x.domain);
            positionRange = [ frame.y + frame.height, frame.y ];
            valueScaleRange = [0, frame.width];
            break;
    }
    barPositionScale.range(positionRange);
    barValueScale.range(valueScaleRange);
    const pscale = scaleBand(range(dataPoints.length), positionRange).round(true);
    pscale.paddingInner(innerPadding);
    pscale.paddingOuter(outerPadding);
    return (
        <Group className="bar-data-series">
            <Rect 
                width={frame.width}
                height={frame.height}
                x={frame.x}
                y={frame.y}
                fill="none"
            />
            {dataPoints.map(({value, ...otherProps}, i) => {
                const x = orientation === 'vertical' ? pscale(i) : frame.x;
                const width = orientation === 'vertical' ? pscale.bandwidth() : barValueScale(value);
                //console.assert(value == 4, `orientation == ${orientation} value is 5, domain is ${barValueScale.domain()}, range is ${barValueScale.range()}}`);
                const height = orientation === 'vertical' ? barValueScale(value) : pscale.bandwidth();
                const y = orientation === 'vertical' ? frame.height - height + frame.y : pscale(i);
                const Bar = orientation === 'vertical' ? VerticalBar : HorizontalBar;
                return (
                    <Bar
                        dataPointProps={{value, ...otherProps}}
                        key={i}
                        width={width}
                        height={height}
                        x={x ?? 0}
                        y={y ?? 0}
                        style={{
                            fill: otherProps?.style?.fill ?? theme.colorScale.category[i % 10],
                            stroke: otherProps?.style?.stroke ?? 'none',
                            strokeWidth: otherProps?.style?.strokeWidth ?? 1
                        }}
                    />
                );
            })}
        </Group>
    );
}

export default BarDataSeries;
