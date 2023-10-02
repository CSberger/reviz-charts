import React from 'react'

import { extent, range } from 'd3-array';
import { scaleQuantize } from 'd3-scale';
import Chart from '../components/Chart/chart.client';

import {  DataSeriesCartesian2D, DataSeriesFrame, OrientationEnum } from '../dataseries/types';
import BarChart from './Bar';
import { ScaleType } from '../reviz-charts';
import { baseTheme } from '../Theme';
import PictorialDataseries from '../dataseries/Pictorial/DataSeries';
import Rect from '../components/Rect';
import { makeScale } from '../dataseries/utils/makeScale';
import Group from '../components/Group';


interface HeatmapProps extends ChartProps {
    axisDefinitions?: {
        horizontal: {
            domain: string[];
            scale: ScaleType;
        },
        vertical: {
            domain: string[];
            scale: ScaleType;
        }
    };
    colorMapper?: (dataPoint: any, theme: any) => string;
    aggregationFunction?: (dataPoints: any[], numBins?: number, domain?: [number, number]) => IDataPoint[],
    dataPoints: any[],
    numBins?: number,
    orientation?: OrientationEnum;
    theme: any;
}

export function binHeatmap(dataPoints: any[], numBins: number, domain: [number, number]) {
    const dataExtent = domain ?? extent(dataPoints) as [number, number];
        const scale = scaleQuantize().domain(dataExtent).range(range(numBins));
        const bins = range(numBins).map(() => 0)
        dataPoints.forEach((dataPoint) => {
            bins[scale(dataPoint)] += 1;
        });
        return bins.map((binValue: number) => ({value: binValue}));
}

interface HeatmapDataPoint {
    i: string;
    j: string;
    value: number;
}

interface IHeatmapDSProps extends DataSeriesCartesian2D {
    colorMapper?: (dataPoint: any, theme: any) => string;
    dataPoints: HeatmapDataPoint[];
}

function HeatmapDataSeries ({
    axisDefinitions = {
        horizontal: {
            scale: ScaleType.Band,
            domain: []
        },
        vertical: {
            scale: ScaleType.Band,
            domain: []
        }
    },
    dataPoints,
    frame
}: IHeatmapDSProps) {
    const hScale = makeScale(axisDefinitions.horizontal.scale, axisDefinitions.horizontal.domain);
    const vScale = makeScale(axisDefinitions.vertical.scale, axisDefinitions.vertical.domain);
    hScale.range([0, frame.width]);
    vScale.range([0, frame.height]);
    return (
        <Group>
            {dataPoints.map((dataPoint: any, idx: number) => {
                const x = hScale(dataPoint.i);
                const y = vScale(dataPoint.j);
                const width = hScale.bandwidth();
                const height = vScale.bandwidth();
                return (
                    <Rect
                        key={idx}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={dataPoint.style.fill}
                        stroke={dataPoint.style.stroke}
                        strokeWidth={dataPoint.style.strokeWidth}
                    />
                )
            })}
        </Group>
    )
}


export default function Heatmap ({
    axisDefinitions = {
        horizontal: {
            domain: []
        },
        vertical: {
            domain: []
        }
    },
    colorMapper = (dataPoint: any, theme: any) => theme.colors.primary,
    dataPoints,
    height,
    width,
    orientation = OrientationEnum.vertical,
    theme = baseTheme,
    ...otherProps
}: HeatmapProps) {
    const localAxisDefinitions = {
        horizontal: {
            ...axisDefinitions.horizontal,
            scale: axisDefinitions.horizontal.scale ?? ScaleType.Band
        },
        vertical: {
            ...axisDefinitions.vertical,
            scale: axisDefinitions.vertical.scale ?? ScaleType.Band
        }
    };
    const valueExtents = extent(dataPoints.map(({value}) => value)) as [number, number];
    const scaleLinear = makeScale(ScaleType.Linear, valueExtents);
    scaleLinear.range([0, 1]);
    const colorScale = theme.colorScale.primary;
    return (
        <Chart
            height={height}
            width={width}
            {...otherProps}
        >
            <Rect 
                className="bar h-bar"
                fill='lightgrey'
                width={width}
                height={height}
                x={0}
                y={0}
            />
            <HeatmapDataSeries
                axisDefinitions={localAxisDefinitions}
                dataPoints={dataPoints.map((dataPoint: any) => ({
                    ...dataPoint,
                    style: {
                        fill: colorScale(scaleLinear(dataPoint.value)),
                    }
                }))}
                frame={{
                    x: 0,
                    y: 0,
                    width,
                    height
                }}

            />
        </Chart>
    );
}