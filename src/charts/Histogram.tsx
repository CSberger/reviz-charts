import React from 'react'

import { extent, range } from 'd3-array';
import { scaleQuantize } from 'd3-scale';

import {  OrientationEnum } from '../dataseries/types';
import BarChart from './Bar';
import { ScaleType } from '../reviz-charts';
import { baseTheme } from '../Theme';
import { IDataPoint } from '../dataseries/Bars/BarDataSeries';


interface HistogramProps extends ChartProps {
    colorMapper?: (dataPoint: any, theme: any) => string;
    aggregationFunction?: (dataPoints: any[], numBins: number, domain: [number, number]) => IDataPoint[],
    dataPoints: any[],
    numBins: number,
    orientation?: OrientationEnum;
    theme: any;
}

export function binHistogram(dataPoints: any[], numBins: number, domain: [number, number]) {
    const dataExtent = domain ?? extent(dataPoints) as [number, number];
        const scale = scaleQuantize().domain(dataExtent).range(range(numBins));
        const bins = range(numBins).map(() => 0)
        dataPoints.forEach((dataPoint) => {
            bins[scale(dataPoint)] += 1;
        });
        return bins.map((binValue: number) => ({value: binValue}));
}

export default function Histogram ({
    colorMapper = (dataPoint: any, theme: any) => theme.colors.primary,
    dataPoints,
    height, 
    width, 
    aggregationFunction = binHistogram,
    numBins = 5,
    orientation = OrientationEnum.vertical,
    theme = baseTheme,

    ...otherProps
}: HistogramProps) {
    const domain = extent(dataPoints) as [number, number];

    const barDataPoints = aggregationFunction(dataPoints, numBins, domain);
    barDataPoints.forEach((dataPoint: any) => {
        dataPoint.style = {};
        dataPoint.style.fill = colorMapper(dataPoint, theme);
        dataPoint.style.stroke = 'none';
    });

    return (
        <BarChart 
            axisDefinitions={{
                value: {
                    scale: ScaleType.Linear
                },
                position: {
                    scale: ScaleType.Linear,
                    domain
                }
            }}
            dataPoints={barDataPoints}
            orientation={orientation}
            width={width}
            height={height}
            {...otherProps}

        />
    );
}