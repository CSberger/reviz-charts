import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import { CanvasProps } from "./types";

export default function NoContextCanvas ({
    children,
    className,
    height,
    width,
    xPos = 0,
    yPos = 0,
    ...otherProps
}: PropsWithChildren<CanvasProps>) {
    return (
        <svg
            {...otherProps}
            className={clsx([className, 'canvas'])}
            height={height}
            width={width}
            viewBox={`${xPos} ${yPos} ${xPos + width} ${yPos + height}`}
            xmlns={'http://www.w3.org/2000/svg'}
        >
            {children}
        </svg>
    );
}