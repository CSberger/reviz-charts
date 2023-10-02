import React from "react";

import { arc } from 'd3-shape';

import Group from "../../components/Group";
import { PieDataPointProps } from "./types";

interface LabelledPieSliceProps extends PieDataPointProps{
    labelDistance?: number;
}

const LABEL_OFFSET = 10;
export default function LabelledPieSlice({
    cx,
    cy,
    dataPointProps,
    innerRadius=0,
    outerRadius=1,
    angleStart,
    angleEnd,
    labelDistance = 20,
    labelOffset = LABEL_OFFSET,
    labelStyle = {
    },
    ...otherProps
}: LabelledPieSliceProps) {
    const arcCoords = {
        innerRadius,
        outerRadius,
        startAngle: angleStart,
        endAngle: angleEnd,
    };
    const a = arc()
    const pa = a(arcCoords);
    
    const [x, y] = a.centroid(arcCoords);
    const labelAngle = (angleEnd + angleStart) / 2 - Math.PI / 2;
    const labelVector = [Math.cos( labelAngle ), Math.sin( labelAngle )];
    const [vx, vy] = labelVector;
    const labelPosition = {
        x: vx * (outerRadius + labelDistance),
        y: vy * (outerRadius + labelDistance),
    }
    const lineStartPosition = {
        x: vx * (outerRadius - 5),
        y: vy * (outerRadius - 5),
    }    
    const lineEndPosition = {
        x: vx * (outerRadius + labelDistance - 5),
        y: vy * (outerRadius + labelDistance - 5),
    }
    return (
        <Group>
            <path
                d={pa ?? ""}
                transform={`translate(${cx} ${cy})`}
                {...otherProps}
            />
            <text
                alignmentBaseline="middle"
                transform={`translate(${cx} ${cy})`}
                textAnchor={vx > 0.5 ? "start": "end"}
                x={labelPosition.x}
                y={labelPosition.y}
                dx = {LABEL_OFFSET * vx}
                dy = {LABEL_OFFSET * vy}
                style={labelStyle}
            >
                {`${dataPointProps.label}`}
            </text>
            <line
                transform={`translate(${cx} ${cy})`}
                x1={lineStartPosition.x}
                y1={lineStartPosition.y}
                x2={lineEndPosition.x}
                y2={lineEndPosition.y}
                stroke={"black"}
                strokeWidth={1}
            />
        </Group>
    )
}