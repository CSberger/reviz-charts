import React from "react";

import Group from "../../components/Group";
import Theme from "../../contextproviders/Theme";
import PieSlice from "./PieSlice";
import { PieDataSeriesProps } from "./types";


export default function PieDataSeries ({
    DataPointComponent = PieSlice,
    dataPoints,
    frame,
    startAngle = 0,
    innerRadiusPercent = 0,
    backgroundCircleStyle = {
        'fill': "rgba(200, 200, 200, 1)",
        'stroke': "rgba(0, 0, 0, 1)"
    }
}: PieDataSeriesProps) {
    const theme = React.useContext(Theme);
    
    const minDim = Math.min(frame.width, frame.height);
    const center = {
        x: frame.x + frame.width / 2,
        y: frame.y + frame.height / 2
    };
    const dataPointValues = dataPoints.map(({ value }) => value);
    const sumValues = dataPointValues.reduce((a, b) => a + b, 0);

    let prev = startAngle;
    const angleStarts = dataPoints.map(({ value }) => {
        const fraction = value / sumValues;

        const arcObj = {
            fraction,
            start: prev,
            end:  prev + fraction*Math.PI*2,
        };
        prev =  arcObj.end;
        return arcObj;
    });
    const outerRadius = minDim / 2;
    return (
        <Group>
            <circle
                cx={center.x}
                cy={center.y}
                r={outerRadius}
                style={backgroundCircleStyle}
            />
            <Group>
                {angleStarts.map((a, idx) => {
                    return (
                        <DataPointComponent
                            cx={center.x}
                            cy={center.y}
                            dataPointProps={dataPoints[idx]}
                            key={idx}
                            innerRadius={innerRadiusPercent * outerRadius}
                            outerRadius={outerRadius}
                            angleEnd={a.end}
                            angleStart={a.start}
                            fill={theme.colorScale.category[idx % theme.colorScale.category.length]}
                            stroke={'rgba(0, 0, 0, 1)'}
                        />
                    )
                })
                }
            </Group>
        </Group>
    )
}
