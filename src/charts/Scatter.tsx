import { PropsWithChildren } from "react";
import { extent } from "d3-array";

import { AxisDefinition, DP2D } from "../dataseries/types";
import { ScaleType } from "../reviz-charts";

import Chart from '../components/Chart/chart.client';

import ScatterDataSeries from "../dataseries/Scatter";
import HexScatter from "../dataseries/HexScatter";
import withAxis from "../dataseries/modifiers/withAxis";
import withPadding from "../dataseries/modifiers/withPadding";

interface IScatterChartProps extends ChartProps {
    axisDefinitions?: {
        x: AxisDefinition,
        y: AxisDefinition
    };
    dataPoints: DP2D[];
    aggregateToHexBins?: boolean;
    showAxes?: boolean;

}

const ScatterDS = withPadding(ScatterDataSeries);
const ScatterDSWithAxis = withPadding(withAxis(ScatterDataSeries));
const HexScatterDS = withPadding(HexScatter);
const HexScatterDSWithAxis = withPadding(withAxis(HexScatter));

HexScatter
export default function ScatterChart ({
    aggregateToHexBins = false,
    axisDefinitions: localAxisDefinitions = {
        x: {
            scale: ScaleType.Linear,
        },
        y: {
            scale: ScaleType.Linear,
        }
    },
    height,
    width,
    dataPoints,
    showAxes = false,
    ...otherProps
}: PropsWithChildren<IScatterChartProps>) {
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
    let ScatterDataSeries;
    if (aggregateToHexBins) {
        ScatterDataSeries = showAxes ? HexScatterDSWithAxis : HexScatterDS;

    } else {
        ScatterDataSeries = showAxes ? ScatterDSWithAxis : ScatterDS;

    }
   
    return (
        <Chart
            height={height}
            width={width}
            {...otherProps}
        >
            <ScatterDataSeries
                axis={{
                    left: yAxis,
                    bottom: xAxis,
                }}
                axisDefinitions={{
                    x: xAxis,
                    y: yAxis,
                }}
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