"use client";
import { PropsWithChildren } from 'react';

import Theme from '../../contextproviders/Theme';
import Canvas from '../Canvas/Canvas.svg.server';
import { baseTheme } from '../../Theme';

export default function ServersideChart ({
    className,
    children,
    height,
    width,
    xPos = 0,
    yPos = 0 
}: PropsWithChildren<ChartProps>) {
    return (
        <Canvas
            className={className}
            height={height}
            width={width}
            xPos={xPos}
            yPos={yPos}
        >
            <Theme.Provider value={baseTheme}>
                {children}
            </Theme.Provider>
        </Canvas>
    );
}
