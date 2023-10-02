import React from 'react';

import {format} from 'd3-format';

import Line from "../../components/Line";
import { BoxProps } from './types';
import Group from '../../components/Group';
import Rect from '../../components/Rect';
import Circle from '../../components/Circle';

const numberFormatter = format('.2f');

interface HorizontalWhiskerProps {
    startPos: number
    endPos: number
    width?: number
    y: number
}

function HorizontalWhisker({startPos, endPos, y, width=5}: HorizontalWhiskerProps) {
    const whiskerOffset = width / 2;
    return (
        <Group>
            <Line
                className="box-whisker"
                fill="black"
                path={[[startPos, y], [endPos, y]]}
                stroke="black"
            />
            <Line
                className="box-whisker-h"
                fill="black"
                path={[[endPos, y - whiskerOffset], [endPos, y + whiskerOffset]]}
                stroke="black"
            />
        </Group>
    )
}

export default function HorizontalBox ({
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
    const boxLength = (q3Position as number) - (q1Position as number);
    
    const boxWidthCenter = height * boxWidthFraction / 2 + y;
    // console.warn(`boxWidthCenter: ${boxWidthCenter}, boxWidth: ${boxWidthFraction}, boxHeight: ${boxLength}, width: ${width}, x: ${x}`);
    return (
        <Group>

            <HorizontalWhisker
                startPos={q3Position as number}
                endPos={maxValuePosition as number}
                width={whiskerWidthFraction * height}
                y={boxWidthCenter}
            />
            <HorizontalWhisker
                startPos={q1Position as number}
                endPos={minValuePosition as number}
                width={whiskerWidthFraction * height}
                y={boxWidthCenter}
            />            
            
            <text alignmentBaseline={'before-edge'} textAnchor={'middle'} fontSize={8}
                x={maxValuePosition} y={boxWidthCenter}>{`${numberFormatter(dataPointProps.maxValue)}`}</text>
            <text alignmentBaseline={'before-edge'} textAnchor={'middle'} fontSize={8}
                x={minValuePosition} y={boxWidthCenter}>{`${numberFormatter(dataPointProps.minValue)}`}</text>
            <Rect
                className="box-iqr"
                width={boxLength}
                height={height * boxWidthFraction}
                x={q1Position ?? 0}
                y={y ?? 0}
                fill="lightblue"
                stroke="black"
            />
            <Line
                className="box-median"
                fill="black"
                path={[[medianPosition as number, y], [medianPosition as number, y + height*boxWidthFraction]]}
                stroke="black"
                strokeWidth={1}
                strokeDasharray="1,1"
            />
            {outlierPositions?.map((valuePosition, i) => {
                return (
                    <Circle 
                        x={valuePosition}
                        y={boxWidthCenter}
                        radius={1.5}
                        stroke={'red'}
                        fill={'white'}
                    />
            )})}
            <text
                alignmentBaseline={'after-edge'}
                textAnchor={'middle'}
                fontSize={8}
                x={medianPosition}
                y={y + height/2 + 6}
            >
                {`${numberFormatter(dataPointProps.medianVal)}`}
            </text>
        </Group>
      )    
}