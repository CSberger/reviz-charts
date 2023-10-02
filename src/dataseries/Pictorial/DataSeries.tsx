import React from "react";
import Group from "../../components/Group";
import Rect from "../../components/Rect";
import type { PictorialDataSeriesProps } from "./types";
import { Frame } from "../types";


interface CheckBoxProps extends Frame {
    isChecked: boolean;
}

function CheckBox ({
    x,
    y,
    width,
    height,
    isChecked = true,
    ...otherProps
}: CheckBoxProps) {
    const PADDING = 5;
    const iconWidth = Math.min(width, height) - PADDING * 2;
    return (
        <>
            {isChecked && (
                <Rect
                    x={x + PADDING}
                    y={y + PADDING}
                    width={iconWidth}
                    height={iconWidth}
                    {...otherProps}
                />
            )}
        </>
    );
}


export default function PictorialDataseries ({
    frame,
    dataPoints,
    rows,
    columns,
    stroke="black",
    fill="red",
    Component=CheckBox,
}: PictorialDataSeriesProps) {
    const rowHeight = frame.height / rows;
    const colWidth = frame.width / columns;
    return (
        <Group>
            {dataPoints.map((dataPoint: any, i: number) => {
                const x = i % columns * colWidth;
                const y = Math.floor(i / columns) * rowHeight;
                return (
                    <Component
                        key={i}
                        x={x}
                        y={y}
                        width={colWidth}
                        height={rowHeight}
                        stroke={stroke}
                        fill={fill}
                        {...dataPoint}
                    />
                );
            })}            
        </Group>
    )
}
