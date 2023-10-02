import { FC, PropsWithChildren, SVGLineElementAttributes } from "react";
import { extent, reverse, zip } from "d3-array";
import clsx from "clsx";
import flatten from 'lodash.flatten';
import first from 'lodash.first';
import last from 'lodash.last';

import { AxisDefinition, DP2D, DataSeriesCartesian2D } from "../dataseries/types";
import { ScaleType } from "../reviz-charts";

import Chart from '../components/Chart/chart.client';

import withAxis from "../dataseries/modifiers/withAxis";
import withPadding from "../dataseries/modifiers/withPadding";
import { CurveEnum } from "../dataseries/Line/types";
import { baseTheme } from "../Theme";
import makeDefaultDomain from "../dataseries/utils/makeDefaultDomain";
import { makeScale } from "../dataseries/utils/makeScale";
import Group from "../components/Group";
import { makePath } from "../dataseries/Line";
import { line } from "d3-shape";
import { connect } from "http2";

interface ILineChartProps extends ChartProps {
    axisDefinitions?: {
        x: AxisDefinition,
        y: AxisDefinition
    };
    curveType?: CurveEnum;
    dataPoints: DP2D[];
    showAxes?: boolean;
}

interface LinePointType extends DP2D {
    curveType?: CurveEnum
}

interface LineParams extends SVGLineElementAttributes<SVGLineElement> {
    closed?: boolean,
    dataPoints: LinePointType[],
    pointProps: any,
    lineProps: any,
    curveType?: CurveEnum,
    stroke: string,
    fill: string,
}

interface AreaDSParams extends Omit<DataSeriesCartesian2D, 'axisDefinitions'> {
    DataPointComponent?: (FC<any> | null),
    axisDefinitions: {
        x: AxisDefinition,
        y: AxisDefinition
    } | null;
    className?: string,
    curveType?: CurveEnum,
    connectEnds?: boolean,
    connectorStyle?: SVGLineElementAttributes<SVGLineElement>,
    lineProps: LineParams[]

    theme?: any
};

function splitArrayByValue(arr: any[], valueGetter = (val: any) => val) {
    let currentValue: any = null;
    const resultArrays = [];
    let currentArray: any[] = [];
    arr.forEach((val, idx) => {
        const newValue = valueGetter(val);
        
        if (newValue !== currentValue) {
            resultArrays.push(currentArray);
            currentArray = [];
            currentValue = newValue;
        }
        currentArray.push(val);
    })
    if (currentArray.length > 0) {
        resultArrays.push(currentArray);
    }
    return resultArrays;
}

function LineComponent ({
    className,
    curveType,
    dataPoints,
    stroke = "black",
    fill="none",
    closed=false,
    ...lineProps
}: LineParams) {

    const startX = dataPoints[0].x;
    const startY = dataPoints[0].y;
    let segments = [];
    if (className === 'area') {
        segments = splitArrayByValue(dataPoints, ({curveType}) => curveType);
    } else {
        segments = [dataPoints];
    }
    let path = '';
    segments.forEach(segment => {
        const segmentPath = makePath(segment, curveType) as string;
        if (segment.length == 2 && segment[0].curveType === CurveEnum.LINEAR) {
            path += `L${segment[0].x},${segment[0].y}L${segment[1].x},${segment[1].y}`;
        } else {
            path += segmentPath;
        }
    })
    if (closed) {
        path += ` L${startX},${startY} Z`;
    }
    return (
        <path
          d={path}
          fill={fill}
          stroke={stroke}
        />
    );
}

function AreaDS ({
    axisDefinitions,
    className,
    connectEnds = false,
    curveType: areaCurveType = CurveEnum.LINEAR,
    DataPointComponent = null,
    dataPoints,
    frame = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    lineProps = [],
    connectorStyle = {},
    theme={baseTheme},
    ...otherProps
} : AreaDSParams) {
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
    const linePairs = zip(...lineProps.map(({dataPoints}) => dataPoints));

    const liP = [first(linePairs), last(linePairs)].map(p => p?.map(({x, y}) => ({x, y, curveType: CurveEnum.LINEAR})));

    let areaPoints;
    if (connectEnds) {
        areaPoints = zip(lineProps.map(({dataPoints}, idx) => idx % 2 == 0 ? dataPoints : reverse(dataPoints) ), reverse(liP)).flat(2);
    }

    return (
        <Group className={clsx([className, 'area'])}>

            {lineProps && lineProps.map(({
                dataPoints,
                stroke,
                fill,
                curveType=areaCurveType,
                ...otherProps
            }, idx) => {
                return (
                    <LineComponent
                        curveType={curveType}
                        dataPoints={dataPoints.map(({x, y}) => ({
                            x: horizontalScale(x),
                            y: verticalScale(y)
                        }))}
                        key={`${idx}`}
                        stroke={stroke}
                        fill={fill}
                        {...otherProps}
                    />
                ); 
            })}
            {DataPointComponent && dataPoints.map(({x, y}, index) => {
                return (
                    <DataPointComponent
                        key={index}
                        x={horizontalScale(x)}
                        y={verticalScale(y)}
                    />
                );
            })}
            {connectEnds && [first(linePairs), last(linePairs)]
                .map(([start, end], idx) => {
                    return (
                        <LineComponent
                            curveType={CurveEnum.LINEAR}
                            dataPoints={[start, end].map(({x, y}) => ({
                                x: horizontalScale(x),
                                y: verticalScale(y)
                            }))}
                            key={`${idx}-connect`}
                            stroke={'black'}
                            fill={'none'}
                            pointProps={{}}
                            lineProps={{}}                            
                            {...connectorStyle}
                            {...otherProps}
                        />
                    );
            })}
            <LineComponent
                className={'area'}
                closed={true}
                curveType={areaCurveType}
                dataPoints={areaPoints.map(({x, y, curveType=null}) => ({
                    x: horizontalScale(x),
                    y: verticalScale(y),
                    curveType
                }))}
                key={`area`}
                pointProps={{}}
                lineProps={{}}
                stroke={'none'}
                fill={'pink'}
                {...otherProps}
            />
        </Group>
    )
};

export default function AreaChart ({
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
    lineProps = [],
    connectEnds = false,
    showAxes = false,
    ...otherProps
}: PropsWithChildren<ILineChartProps>) {
    const xDomain = localAxisDefinitions.x.domain ?? extent(flatten(lineProps.map(({dataPoints}) => dataPoints.map(({x}) => x ))))
        //dataPoints.map(({x}) => x)) as [number, number];
    //const yDomain = localAxisDefinitions.y.domain ?? extent(dataPoints.map(({y}) => y)) as [number, number];
    const yDomain = localAxisDefinitions.y.domain ?? extent(flatten(lineProps.map(({dataPoints}) => dataPoints.map(({y}) => y ))))
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
    const LineDataSeries = showAxes ? AreaDS : AreaDS;
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
                connectEnds={connectEnds}
                curveType={curveType}
                dataPoints={dataPoints}
                frame={{
                    x: 0.0,
                    y: 0.0,
                    width,
                    height,
                }}
                lineProps={lineProps}
                padding={{
                    top: 10, bottom: 10, left: 10, right: 10
                }}
            />
        </Chart>
    );
}
