import { PropsWithChildren } from "react";
import range from "lodash.range";


import Chart from '../components/Chart/chart.client';
import Bars from '../dataseries/Bars/BarDataSeries';
import { ScaleType } from "../reviz-charts";
import { OrientationEnum } from "../dataseries/types";
import withAxis from "../dataseries/modifiers/withAxis";
import withPadding from "../dataseries/modifiers/withPadding";


interface BarDataPoint {
    value: number;
}

interface IBarChartProps {
    axisDefinitions?: {
        value: {
            scale: ScaleType;
            domain?: [number, number];
        },
        position: {
            scale: ScaleType;
            domain?: [number, number];
        }
    };
    height: number;
    width: number;
    dataPoints: BarDataPoint[];
    fill?: string;
    innerPadding?: number;
    outerPadding?: number;
    stroke?: string;
    orientation?: OrientationEnum.vertical | OrientationEnum.horizontal;
    showAxes?: boolean;
}

const AxisBarsDS = withPadding(withAxis(Bars));
const BarsDS = withPadding(Bars);

export default function BarChart ({
    axisDefinitions: localAxisDefinitions = {
        value: {
            scale: ScaleType.Linear,
        },
        position: {
            scale: ScaleType.Band,
        }
    },
    height,
    width,
    dataPoints,
    innerPadding=0.15,
    outerPadding=0.1,
    orientation = OrientationEnum.vertical,
    showAxes = true,
    ...otherProps
}: PropsWithChildren<IBarChartProps>) {
    const valueAxisDef = { 
        domain: localAxisDefinitions?.value?.domain ?? [0, Math.max(...dataPoints.map(({ value }) => value))],
        scale:  localAxisDefinitions.value.scale
    };
    const positionAxisDef = { 
        domain: localAxisDefinitions?.position?.domain ?? range(dataPoints.length), 
        scale: localAxisDefinitions.position.scale,
        innerPadding,
        outerPadding
    };
    let axisDefinitions;
    switch (orientation) {
        case OrientationEnum.horizontal:
            axisDefinitions = {
                x: valueAxisDef,
                y: positionAxisDef,
            };
            break;
        case OrientationEnum.vertical:
            axisDefinitions = {
                x: positionAxisDef,
                y: valueAxisDef,
            };
            break;
    }

    const axisProps = {
        bottom: orientation == OrientationEnum.vertical ? positionAxisDef : valueAxisDef,
        left: orientation == OrientationEnum.vertical ? valueAxisDef : positionAxisDef
    }
    axisProps.bottom = {
        ...axisProps.bottom,
        axisWidth: 50,
        numTicks: 5
    };
    axisProps.left = {
        ...axisProps.left,
        axisWidth: 50,
        numTicks: 5
    };
    const Bars = showAxes ? AxisBarsDS : BarsDS;
    return (
        <Chart
            height={height}
            width={width}
            {...otherProps}
        >
            <Bars
                axis={axisProps}
                axisDefinitions={axisDefinitions}
                dataPoints={dataPoints}
                frame={{
                    x: 0.0,
                    y: 0.0,
                    width,
                    height,
                }}
                innerPadding={innerPadding}
                orientation={orientation}
                outerPadding={outerPadding}
                padding={{top: 10, bottom: 10, left: 10, right: 10}}
            />
        </Chart>
    );
}
