import React, { ComponentProps, ComponentPropsWithoutRef } from 'react';
import { DataSeriesFrame } from '../../types';

interface PaddingProps {
    top: number,
    right: number,
    bottom: number,
    left: number
}
interface WithPaddingProps extends ComponentPropsWithoutRef<any> {
    frame: DataSeriesFrame,
    padding?: PaddingProps
}

const withPadding = (Component: any) => ({
    padding = {top: 10, right: 10, left: 10, bottom: 10},
    frame,
    ...otherProps
}: WithPaddingProps) => {
    return (
        <Component
            frame={{
                x: frame.x + padding.left,
                y: frame.y + padding.top,
                height: frame.height - padding.top - padding.bottom,
                width: frame.width - padding.left - padding.right
            }}
            {...otherProps}
        />
    );
}

export default withPadding;
