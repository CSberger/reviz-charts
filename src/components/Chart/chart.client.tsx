"use client";
import { PropsWithChildren } from 'react';

import Theme from '../../contextproviders/Theme';
import Canvas from '../Canvas/Canvas.svg.client';
import { baseTheme } from '../../Theme';


export default function ClientsideChart ({
    children,
    height,
    width,
    xPos = 0,
    yPos = 0 
}: PropsWithChildren<ChartProps>) {
    return (
        <Canvas
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
