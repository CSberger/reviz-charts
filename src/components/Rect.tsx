import React from 'react';
import { DPFigure } from '../dataseries/types';

interface IRect extends DPFigure, React.SVGProps<SVGRectElement> {
    x: number
    y: number
    width: number
    height: number
    fill?: string
    stroke?: string
};

export default function Rect ({ x, y, width, height, dataPointProps, ...otherProps}: IRect) {
    return (
        <rect 
            x={x}
            y={y}
            width={width}
            height={height}
            {...otherProps}
        />
    );
}
