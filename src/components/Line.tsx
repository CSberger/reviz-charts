import React from 'react';

interface DPFigure {
    dataPointProps?: any
};

interface DPLine extends DPFigure {
    className?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    path: [number, number][];
};

export default function Line ({className='', fill = 'none', stroke = 'black', strokeWidth=1, strokeDasharray='none', path = [], ...otherProps}: DPLine) {
    let pathString = '';
    if (path.length !== 0) {
        const firstPoint = path[0];
        const [firstX, firstY] = firstPoint;
        pathString += `M${firstX} ${firstY} `;
        for (let [x, y] of path.slice(1)) {
            pathString += `L${x} ${y} `;
        }
    }

    return (
        <path 
            d={pathString}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            {...otherProps}
        />
    );
}
