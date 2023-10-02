import React from 'react';

import range from 'lodash.range';
import { HexOrientation } from './types';

export default function Hex ({
    borderWidth = 0.8,
    radius,
    x,
    y,
    fill = 'none',
    stroke = 'none',
    dataPointProps = {},
}: {
    borderWidth: number,
    radius: number,
    x: number,
    y: number,
    fill?: string,
    stroke?: string,
    dataPointProps: any
}) {
    const r = radius - borderWidth;
    const points = range(6).map(i => {
        var angle_deg = 60 * i - 30;
        var angle_rad = Math.PI / 180 * angle_deg;
    
        return ({
            x: x + r * Math.cos(angle_rad),
            y: y + r * Math.sin(angle_rad),
        });
    });
    const pointString = points.map(p => `${p.x},${p.y}`).join(' ');
    return (
        <polygon
            points={pointString}
            style={{
                fill,
                stroke,
                strokeWidth: borderWidth
            }}
        />
    );
}
