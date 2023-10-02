import React from 'react';

interface DPFigure {
    x: number,
    y: number,
    dataPointProps?: any
};

interface DPCircle extends DPFigure {
    fill?: string,
    stroke?: string,
    radius: number
};

export default function Circle ({fill = 'none', stroke = 'black', x, y, radius = 1.4}: DPCircle) {
    return (
        <circle 
            cx={x}
            cy={y}
            r={radius}
            fill={fill}
            stroke={stroke}
        />
    );
}
