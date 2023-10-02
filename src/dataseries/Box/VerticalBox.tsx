import React from 'react';

import {format} from 'd3-format';

import Line from "../../components/Line";
import { BoxProps } from './types';
import Group from '../../components/Group';
import Rect from '../../components/Rect';
import Circle from '../../components/Circle';

const numberFormatter = format('.2f');

interface VerticalWhiskerProps {
    startPos: number
    endPos: number
    width?: number
    x: number
}

function VerticalWhisker({startPos, endPos, x, width=5}: VerticalWhiskerProps) {
    const whiskerOffset = width / 2;
    return (
        <>
            <Line
                className="box-whisker"
                fill="black"
                path={[[x, startPos], [x, endPos]]}
                stroke="black"
            />
            [[x, startPos], [x, endPos]]
            <Line
                className="box-whisker-h"
                fill="black"
                path={[[x - whiskerOffset, endPos], [x + whiskerOffset, endPos as number]]}
                stroke="black"
            />
        </>
    )
}

export default function VerticalBox ({
    x,
    y,
    width,
    height,
    dataPointProps,
    medianPosition,
    q1Position,
    q3Position,
    upperFencePosition,
    lowerFencePosition,
    meanPosition,
    maxValuePosition,
    minValuePosition,
    outlierPositions,
    valuesPositions,
    boxWidthFraction = 1.0,
    whiskerWidthFraction = 0.4
  }: BoxProps) {
    const boxHeight = (q1Position as number) - (q3Position as number);
    const boxWidthCenter = width * boxWidthFraction / 2 + x;
    console.warn(`boxWidthCenter: ${boxWidthCenter}, boxWidth: ${boxWidthFraction}, boxHeight: ${boxHeight}, width: ${width}, x: ${x}`);
    return (
        <Group>
            <Line
                className="box-median"
                fill="black"
                path={[[x, medianPosition as number], [x + boxWidthFraction, medianPosition as number]]}
                stroke="black"
                strokeWidth={2}
            />            
            <Rect
                className="box"
                dataPointProps={dataPointProps}
                width={width}
                height={height}
                x={x ?? 0}
                y={y ?? 0}
                fill="blue"
                stroke="black"
            />
            <VerticalWhisker
                startPos={q3Position as number}
                endPos={maxValuePosition as number}
                width={whiskerWidthFraction * width}
                x={boxWidthCenter}
            />
            <VerticalWhisker
                startPos={q1Position as number}
                endPos={minValuePosition as number}
                width={whiskerWidthFraction * width}
                x={boxWidthCenter}
            />            
            
            <text alignmentBaseline={'after-edge'} textAnchor={'middle'} fontSize={8} x={boxWidthCenter} y={maxValuePosition}>{`${numberFormatter(dataPointProps.maxValue)}`}</text>
            <text alignmentBaseline={'before-edge'} textAnchor={'middle'} fontSize={8} x={boxWidthCenter} y={minValuePosition}>{`${numberFormatter(dataPointProps.minValue)}`}</text>
            <Rect
                className="box-iqr"
                width={width * boxWidthFraction}
                height={boxHeight}
                x={x ?? 0}
                y={q3Position ?? 0}
                fill="lightblue"
                stroke="black"
            />
            <Line
                className={"box-median"}
                fill="black"
                path={[[x, medianPosition as number], [x + width*boxWidthFraction, medianPosition as number]]}
                stroke="black"
                strokeWidth={1}
                strokeDasharray="1,1"
            />
            {outlierPositions?.map((valuePosition, i) => {
                return (
                    <Circle 
                        x={boxWidthCenter}
                        y={valuePosition}
                        radius={1.5}
                        stroke={'red'}
                        fill={'white'}
                    />
                )})}
            <text alignmentBaseline={'after-edge'} textAnchor={'middle'} fontSize={8} x={boxWidthCenter} y={medianPosition}>{`${numberFormatter(dataPointProps.medianVal)}`}</text>
        </Group>
      )    
}