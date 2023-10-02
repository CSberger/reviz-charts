import React from 'react';
import clsx from 'clsx';
import { curveLinear, curveStepAfter, curveStepBefore, curveBasis, curveCardinal, line, curveMonotoneX, curveMonotoneY, curveNatural } from 'd3-shape';

import Circle from '../../components/Circle';
import Group from '../../components/Group';
import makeDefaultDomain from '../utils/makeDefaultDomain';
import { AxisDefinition, DataSeriesCartesian2D, DP2D } from '../types';
import { makeScale, ScaleType } from '../utils/makeScale';
//import Theme from '../../contextproviders/Theme';
import { CurveEnum, PathType } from './types';
import { baseTheme } from '../../Theme';


export function makePath (points: DP2D[], pathType: CurveEnum =CurveEnum.LINEAR): string {
    const pointArray = points.map(({x, y}) => [x, y]) as [number, number][];
    let curve = null;
    switch (pathType) {
        case CurveEnum.STEP_AFTER:
            curve = curveStepAfter;
            break;
        case CurveEnum.STEP_BEFORE:
            curve = curveStepBefore;
            break;
        case CurveEnum.BASIS:
            curve = curveBasis;
            break;
        case CurveEnum.CARDINAL:
            curve = curveCardinal;
            break;
        case CurveEnum.MONOTONE_X:
            curve = curveMonotoneX;
            break;
        case CurveEnum.MONOTONE_Y:
            curve = curveMonotoneY;
            break;
        case CurveEnum.NATURAL:
            curve = curveNatural;
            break;
        case CurveEnum.LINEAR:
            curve = curveLinear;
            break;
        default:
            curve = curveBasis
    }
    return line().curve(curve)(pointArray) as string;
}

interface LineDSParams extends Omit<DataSeriesCartesian2D, 'axisDefinitions'> {
    DataPointComponent: React.ComponentType<any>,
    axisDefinitions: {
        x: AxisDefinition,
        y: AxisDefinition
    } | null
    className?: string,
    pointProps: any,
    lineProps: any,
    curveType?: CurveEnum,
    stroke: string
    theme?: any
};

interface LineParams {
    dataPoints: {x: number, y: number}[],
    stroke: string,
    curveType: CurveEnum,
    fill: string,
};

function LineComponent ({curveType, dataPoints, stroke = "black", fill="none", ...lineProps}: LineParams) {
    const startX = dataPoints[0].x;
    const startY = dataPoints[0].y;
    let path = makePath(dataPoints, curveType) as string;

    return (
        <path
          d={path}
          fill={fill}
          stroke={stroke}
          {...lineProps}
        />
    );
}

function LineDataSeries ({
    axisDefinitions,
    className,
    curveType = CurveEnum.LINEAR,
    DataPointComponent = Circle,
    dataPoints,
    frame = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    pointProps = {},
    lineProps = {},
    theme={baseTheme},
    ...otherProps
} : LineDSParams) {
    if (!axisDefinitions) {
        const {x: domainX, y: domainY} = makeDefaultDomain(dataPoints);
        axisDefinitions = {
            x: {domain: domainX, scale: ScaleType.Linear},
            y: {domain: domainY, scale: ScaleType.Linear}
        };
        axisDefinitions.x.domain = domainX;
        axisDefinitions.y.domain = domainY;
    }
    if (!axisDefinitions.x.scale) {
        axisDefinitions.x.scale = ScaleType.Linear;
    }
    if (!axisDefinitions.y.scale) {
        axisDefinitions.y.scale = ScaleType.Linear;
    }
    const horizontalScale = makeScale(axisDefinitions.x.scale, axisDefinitions.x.domain)
        .range([frame.x, frame.x + frame.width]);
    const verticalScale = makeScale(axisDefinitions.y.scale, axisDefinitions.y.domain)
        .range([frame.y + frame.height, frame.y]);
    return (
        <Group className={clsx([className])}>
            <LineComponent
                curveType={curveType}
                dataPoints={dataPoints.map(({x, y}) => ({
                    x: horizontalScale(x),
                    y: verticalScale(y)
                }))}
                {...lineProps}
            />
            {DataPointComponent && dataPoints.map(({x, y}, index) => {
                return (
                    <DataPointComponent
                        {...pointProps}
                        key={index}
                        x={horizontalScale(x)}
                        y={verticalScale(y)}
                    />
                );
            })}
        </Group>
    )
};

export default LineDataSeries;

