import React, { useContext } from "react";

import Group from "../../../components/Group";
import Rect from "../../../components/Rect";
import Theme from "../../../contextproviders/Theme";
import { makeScale, ScaleType } from "../../utils/makeScale";
import { FONT_SIZE, TICK_LENGTH, TICK_WIDTH } from "./constants";
import { AxisDefinitionProps, TickProps } from "./types";


function HorizontalAxisTick ({
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
                className={"horizontal-axis-tick"}
                fill={theme.colors.tick}
                height={height}
                width={width}
                x={x - width / 2}
                y={y}
            />
            <text
                className={"horizontal-axis-tick-label tick-label"}
                style={{
                    fontFamily: theme.fonts.tick,
                    fontSize: FONT_SIZE,
                    alignmentBaseline: 'middle'
                }}
                textAnchor='middle'
                x={x - width / 2}
                y={y + height + 6}
            >
                {labelText}
            </text>  
        </>
    );
}

function HorizontalRangeTick ({
    height,
    labelText,
    width,
    x,
    y,
}: TickProps) {
    const theme = useContext(Theme);
    let P = `M ${x} ${y}  C ${x + width/2} ${y + height}  ${x + width/2} ${y}  ${x + width/2} ${y + height}  
                      C  ${x + width/2} ${y} ${x + width/2} ${y + height}  ${x + width} ${y}`;

    return (
        <Group>
            <Rect
                className={"horizontal-range-tick"}
                fill='none'
                height={height}
                width={width}
                x={x}
                y={y}
            />
            <path
                d={P}
                fill={'none'}
                stroke={'black'}
            />
            <text
                className={"horizontal-range-tick-label tick-label"}
                x={x + width / 2}
                y={y + height + FONT_SIZE}
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

export default function HorizontalAxis ({
    axisDefinition,
    height,
    width,
    x,
    y,
    tickValues = [],
}: AxisDefinitionProps) {
    const theme = useContext(Theme);
    const axisScale = makeScale(axisDefinition.scale as ScaleType, axisDefinition.domain, axisDefinition?.innerPadding, axisDefinition?.outerPadding);
    axisScale.range([x, x + width]);
    if (axisDefinition.scale === ScaleType.Log && tickValues[0] === 0) {
        tickValues[0] = 1;
    }
    if (axisDefinition.scale === ScaleType.Band) {
        axisScale.paddingInner(axisDefinition.innerPadding ?? 0);
        axisScale.paddingOuter(axisDefinition.outerPadding ?? 0);
    }
    const Tick = axisDefinition.scale === ScaleType.Band ? HorizontalRangeTick : HorizontalAxisTick;
    return (
        <Group className={"horizontal-axis"}>
            {tickValues.map((val) => {
                let labelText = "";
                switch (axisDefinition.scale) {
                    case ScaleType.Band:
                        labelText = val;
                        break;
                    default:
                        labelText = axisDefinition.scale == ScaleType.Linear || Number.isInteger(Math.log10(val)) ? val.toString() : "";
                }
                return (
                    <Tick
                        key={val}
                        labelText={labelText}
                        height={TICK_LENGTH}
                        width={axisDefinition.scale === ScaleType.Band ? axisScale.bandwidth() : TICK_WIDTH}
                        x={axisScale(val) }
                        y={y}
                    />
                )
            })}
        </Group>
    );
}
