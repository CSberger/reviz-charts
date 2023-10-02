import React, { PropsWithChildren, useContext, useRef } from 'react';
import clsx from 'clsx';

import SVGCanvas from '../../contextproviders/SVGCanvas';
import { CanvasProps } from './types';


export default function ClientsideSVGCanvas ({
    children,
    className,
    height,
    width,
    xPos = 0,
    yPos = 0,
    ...otherProps
}: PropsWithChildren<CanvasProps>) {
    const canvasRef = useRef<SVGSVGElement | null>(null);
    return (
        <svg
            {...otherProps}
            className={clsx([className, 'canvas'])}
            ref={canvasRef}
            height={height}
            width={width}
            viewBox={`${xPos} ${yPos} ${xPos + width} ${yPos + height}`}
            xmlns={'http://www.w3.org/2000/svg'}
        >
            <SVGCanvas.Provider value={canvasRef}>
                {children}
            </SVGCanvas.Provider>
        </svg>
    );
}

