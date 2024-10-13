import React from 'react';
import { ticks } from 'd3-array';
import { DataSeriesCartesian2D, Domain2D } from '../../types';
import { ScaleType, makeScale } from '../../utils/makeScale';

import { AxisDefinitionWithTicks } from './types';
import HorizontalAxis from './HorizontalAxis';
import VerticalAxis from './VerticalAxis';
import { DEFAULT_NUM_TICKS } from './constants';

const DEFAULT_AXIS = {
    left: {
        axisWidth: 50,
        Component: VerticalAxis,
        domain: [], 
        scale: ScaleType.Linear, 
        numTicks: DEFAULT_NUM_TICKS
    },
    bottom: {
        axisWidth: 50,
        Component: HorizontalAxis, 
        domain: [],
        scale: ScaleType.Linear,
        numTicks: DEFAULT_NUM_TICKS
    }
};

interface withAxisDefinition extends AxisDefinitionWithTicks{
    Component: React.FC<any>
}


interface WithAxisProps {
    axis: {
        top?: withAxisDefinition,
        left?: withAxisDefinition,
        right?: withAxisDefinition,
        bottom?: withAxisDefinition
    },
    domain: Domain2D,
    frame: any
}

interface BackgroundGridProps {
    axis: {
        left: AxisDefinitionWithTicks,
        bottom: AxisDefinitionWithTicks
    },
    frame: any,
    leftTicks: any[],
    bottomTicks: any[]

}

function BackgroundGrid({
    axis,
    frame,
    leftTicks,
    bottomTicks
}: BackgroundGridProps) {
    const leftAxisScale = makeScale(axis.left.scale as ScaleType, axis.left.domain, axis.left?.innerPadding, axis.left?.outerPadding);
    leftAxisScale.range([frame.y + frame.height, frame.y]);
    const bottomAxisScale = makeScale(axis.bottom.scale as ScaleType, axis.bottom.domain, axis.bottom?.innerPadding, axis.bottom?.outerPadding);
    bottomAxisScale.range([frame.x, frame.x + frame.width]);
    const [bs1, bs2] = bottomAxisScale.range()
    const r = (bs2-bs1) / bottomAxisScale.domain().length
    const minorGridColor = 'lightgrey'
    return (
        <>
            <g className='gridlines left-gridlines'>
                {leftTicks.map((tick, i) => {
                    const startX = frame.x
                    const startY = leftAxisScale(tick)
                    // let startY;
                    // if (axis.left.scale == ScaleType.Band) {
                    //     const scaleWithoutBandwidth = leftAxisScale.copy().paddingInner(0)
                    //     startY = scaleWithoutBandwidth(tick)
                    // } else {
                    //     startY = leftAxisScale(tick)
                    // }
                    //+ (leftAxisScale.bandwidth() * 0.01)
                    return (
                        <line
                            key={i}
                            x1={startX}
                            x2={startX + frame.width}
                            y1={startY}
                            y2={startY}
                            textAnchor="end"
                            alignmentBaseline="middle"
                            stroke={minorGridColor}
                            strokeWidth={1}
                        />
                    )           
                })}
            </g>
            <g className='gridlines bottom-gridlines'>
                {bottomTicks.map((tick, i) => {
                    debugger;
                    // const paddingWidth = 0 + bottomAxisScale.paddingInner() //* bottomAxisScale.bandwidth() / 2
                    const paddingWidth =  r * bottomAxisScale.paddingInner / 2 ;
                    if (axis.bottom.scale == ScaleType.Band) {
                        const scaleWithoutBandwidth = bottomAxisScale.copy().paddingInner(0)
                        const startX = scaleWithoutBandwidth(tick) + paddingWidth
                        const startY = frame.y + frame.height
                        return (
                            <line
                                key={i}
                                x1={startX}
                                x2={startX }
                                y1={startY}
                                y2={startY - frame.height}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                stroke={minorGridColor}
                                strokeWidth={1}
                            />
                        )           
                    } else {
                        const startX = bottomAxisScale(tick)
                        const startY = frame.y + frame.height
                        return (
                            <line
                                key={i}
                                x1={startX}
                                x2={startX}
                                y1={startY}
                                y2={startY - frame.height}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                stroke={minorGridColor}
                                strokeWidth={1}
                            />
                        )
                    }
                })}
            </g>
        </>
    )
}
const withAxis = (Component:  React.FC<any>) => ({
    axis = {
        left: DEFAULT_AXIS.left,
        bottom: DEFAULT_AXIS.bottom
    },
    domain,
    frame,
    ...otherProps
}: WithAxisProps) => {
    const newFrame = {
        x: frame.x + (axis.left?.axisWidth ?? 0),
        y: frame.y + (axis.top?.axisWidth ?? 0),
        height: frame.height - (axis.bottom?.axisWidth ?? 0),
        width: frame.width - (axis.left?.axisWidth ?? 0) - (axis.right?.axisWidth ?? 0)
    };
    const bottomTicks = axis.bottom?.scale == ScaleType.Band ? axis.bottom.domain : ticks(axis.bottom?.domain[0] as number, axis.bottom?.domain[1] as number, axis.bottom?.numTicks ?? 0);
    const leftTicks = axis.left?.scale == ScaleType.Band ? axis.left?.domain : ticks(axis.left?.domain[0] as number, axis.left?.domain[1] as number, axis.left?.numTicks ?? 0);
    const LeftAxisComponent = axis.left?.Component ?? DEFAULT_AXIS.left.Component;
    const BottomAxisComponent = axis.bottom?.Component ?? DEFAULT_AXIS.bottom.Component;

    return (
        <>
            <BackgroundGrid 
                frame={newFrame}
                axis={{left: axis.left, bottom: axis.bottom}}
                leftTicks={leftTicks}
                bottomTicks={bottomTicks}

            />
            <Component
                frame={newFrame}
                {...otherProps}
            />
            {axis.bottom && (
                <BottomAxisComponent
                    height={axis.bottom?.axisWidth ?? 0}
                    width={newFrame.width}
                    x={newFrame.x}
                    y={newFrame.y + newFrame.height}
                    axisDefinition={axis.bottom}
                    tickValues={bottomTicks}
                />
            )
            }
            <LeftAxisComponent
                fill={'lightgrey'}
                frame={{ x: frame.x,
                     y: newFrame.y,
                     width: axis.left?.axisWidth,
                     height: newFrame.height }}
                height={newFrame.height}
                width={axis.left?.axisWidth}
                x={frame.x}
                y={newFrame.y}
                axisDefinition={axis.left}
                tickValues={leftTicks}
            />

        </>
    );
}

export default withAxis;
