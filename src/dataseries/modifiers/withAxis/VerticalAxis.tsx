import React, { useContext } from 'react';

import Group from '../../../components/Group';
import Rect from '../../../components/Rect';
import Theme from '../../../contextproviders/Theme';
import { makeScale, ScaleType } from '../../utils/makeScale';
import { FONT_SIZE, TICK_LENGTH, TICK_WIDTH } from './constants';
import { AxisDefinitionProps, TickProps } from './types';


interface VerticalRangeTickProps extends TickProps {
}
function VerticalRangeTick ({
    height = 2,
    labelText,
    width = 2,
    x,
    y,
}: VerticalRangeTickProps) {
    const theme = useContext(Theme);
    return (
        <Group>
            <Rect
                className={"vertical-range-tick"}
                fill='none'
                height={height}
                width={width}
                x={x}
                y={y}
            />

            <text
                className={"horizontal-range-tick-label tick-label"}
                x={x + width / 2}
                y={y + height / 2}
                style={{
                    fontFamily: theme.fonts.tick,
                    fontSize: FONT_SIZE,
                    alignmentBaseline: 'middle'
                }}
                textAnchor='middle'
            >
                {labelText}
            </text>
        </Group>
    );
}

export function VerticalAxisTick ({
    height=TICK_WIDTH,
    labelText="",
    width=TICK_LENGTH,
    x,
    y,
}: TickProps) {
    const theme = useContext(Theme);
    return (
        <>
            <rect
                className={"vertical-axis-tick"}
                fill={theme.colors.tick}
                height={height}
                width={width}
                x={x}
                y={y - TICK_WIDTH / 2}
            />
            <text
                className={"vertical-axis-tick-label tick-label"}
                style={{
                    fontFamily: theme.fonts.tick,
                    fontSize: FONT_SIZE,
                    textAlign: 'center',
                    textAnchor: 'middle',
                    alignmentBaseline: 'middle'
                }}                
                x={x - TICK_LENGTH}
                y={y}
            >
                {labelText}
            </text>
        </>
    );
}

export default function VerticalAxis ({
    axisDefinition,
    frame,
    height,
    width,
    x,
    y,
    tickValues = [],
    ...otherProps
}: AxisDefinitionProps) {
    const theme = useContext(Theme);
    const axisScale = makeScale(axisDefinition.scale as ScaleType, axisDefinition.domain, axisDefinition?.innerPadding, axisDefinition?.outerPadding);
    axisScale.range([ y + height, y]);
    const Tick = axisDefinition.scale === ScaleType.Band ? VerticalRangeTick : VerticalAxisTick;
    return (
        <Group className={"vertical-axis"}>
            <rect
                fillOpacity={0.1}
                fill='none'
                height={height}
                width={width}
                x={x}
                y={y}
            />
            {tickValues.map((val) => {
                return (
                    <Tick 
                        key={val}
                        height={axisDefinition.scale === ScaleType.Band ? axisScale.bandwidth() : TICK_WIDTH}
                        labelText={val}
                        width={theme.axis.tickLength}
                        x={x + width - TICK_LENGTH}
                        y={axisScale(val)}                        
                    />
                )
            })}
        </Group>
    );
}
