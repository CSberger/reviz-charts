import { PropsWithChildren } from "react";
import { extent } from "d3-array";

import { AxisDefinition, DP2D } from "../dataseries/types";
import { ScaleType } from "../reviz-charts";

import Chart from '../components/Chart/chart.client';

import LineDataSeries from "../dataseries/Line";
import withAxis from "../dataseries/modifiers/withAxis";
import withPadding from "../dataseries/modifiers/withPadding";
import { CurveEnum } from "../dataseries/Line/types";

interface ILineChartProps extends ChartProps {
    axisDefinitions?: {
        x: AxisDefinition,
        y: AxisDefinition
    };
    curveType?: CurveEnum;
    dataPoints: DP2D[];
    showAxes?: boolean;
}

const LineDS = withPadding(LineDataSeries);
const LineDSWithAxis = withPadding(withAxis(LineDataSeries));

export default function LineChart ({
    axisDefinitions: localAxisDefinitions = {
        x: {
            scale: ScaleType.Linear,
        },
        y: {
            scale: ScaleType.Linear,
        }
    },
    curveType = CurveEnum.LINEAR,
    height,
    width,
    dataPoints,
    showAxes = false,
    ...otherProps
}: PropsWithChildren<ILineChartProps>) {
    const xDomain = localAxisDefinitions.x.domain ?? extent(dataPoints.map(({x}) => x)) as [number, number];
    const yDomain = localAxisDefinitions.y.domain ?? extent(dataPoints.map(({y}) => y)) as [number, number];
    const xAxis = {
        ...localAxisDefinitions.x,
        domain: xDomain,
        axisWidth: 50,
        numTicks: 5
    };
    const yAxis = {
        ...localAxisDefinitions.y,
        domain: yDomain,
        axisWidth: 50,
        numTicks: 5
    };
    debugger;
    const LineDataSeries = showAxes ? LineDSWithAxis : LineDS;
    return (
        <Chart
            height={height}
            width={width}
            {...otherProps}
        >
            <LineDataSeries
                axis={{
                    left: yAxis,
                    bottom: xAxis,
                }}
                axisDefinitions={{
                    x: xAxis,
                    y: yAxis,
                }}
                curveType={curveType}
                dataPoints={dataPoints}
                frame={{
                    x: 0.0,
                    y: 0.0,
                    width,
                    height,
                }}
                padding={{
                    top: 10, bottom: 10, left: 10, right: 10
                }}
            />
        </Chart>
    );
}