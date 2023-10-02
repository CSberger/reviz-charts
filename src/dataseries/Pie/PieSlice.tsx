import React from "react";

import { arc } from 'd3-shape';

import Group from "../../components/Group";
import { PieDataPointProps } from "./types";


export default function PieSlice({
    cx,
    cy,
    dataPointProps,
    innerRadius=0,
    outerRadius=1,
    angleStart,
    angleEnd,
    ...otherProps
}: PieDataPointProps) {
    const a = arc()
    const pa = a({
        innerRadius,
        outerRadius,
        startAngle: angleStart,
        endAngle: angleEnd,
    });
    return (
        <Group>
            <path
              d={pa ?? ""}
              transform={`translate(${cx} ${cy})`}
              {...otherProps}
            />
        </Group>
    )
}
