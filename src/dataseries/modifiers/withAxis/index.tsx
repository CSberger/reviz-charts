import React from 'react';
import { ticks } from 'd3-array';
import { DataSeriesCartesian2D, Domain2D } from '../../types';
import { ScaleType } from '../../utils/makeScale';

import { AxisDefinitionWithTicks } from './types';
import HorizontalAxis from './HorizontalAxis';
import VerticalAxis from './VerticalAxis';
import { DEFAULT_NUM_TICKS } from './constants';

const DEFAULT_AXIS = {
    left: {
        axisWidth: 50,
        Component: VerticalAxis,
        domain: [], 
        scale: ScaleType.Linear, 
        numTicks: DEFAULT_NUM_TICKS
    },
    bottom: {
        axisWidth: 50,
        Component: HorizontalAxis, 
        domain: [],
        scale: ScaleType.Linear,
        numTicks: DEFAULT_NUM_TICKS
    }
};

interface withAxisDefinition extends AxisDefinitionWithTicks{
    Component: React.FC<any>
}


interface WithAxisProps {
    axis: {
        top?: withAxisDefinition,
        left?: withAxisDefinition,
        right?: withAxisDefinition,
        bottom?: withAxisDefinition
    },
    domain: Domain2D,
    frame: any
}

const withAxis = (Component:  React.FC<any>) => ({
    axis = {
        left: DEFAULT_AXIS.left,
        bottom: DEFAULT_AXIS.bottom
    },
    domain,
    frame,
    ...otherProps
}: WithAxisProps) => {
    const newFrame = {
        x: frame.x + (axis.left?.axisWidth ?? 0),
        y: frame.y + (axis.top?.axisWidth ?? 0),
        height: frame.height - (axis.bottom?.axisWidth ?? 0),
        width: frame.width - (axis.left?.axisWidth ?? 0) - (axis.right?.axisWidth ?? 0)
    };
    const bottomTicks = axis.bottom?.scale == ScaleType.Band ? axis.bottom.domain : ticks(axis.bottom?.domain[0] as number, axis.bottom?.domain[1] as number, axis.bottom?.numTicks ?? 0);
    const leftTicks = axis.left?.scale == ScaleType.Band ? axis.left?.domain : ticks(axis.left?.domain[0] as number, axis.left?.domain[1] as number, axis.left?.numTicks ?? 0);
    const LeftAxisComponent = axis.left?.Component ?? DEFAULT_AXIS.left.Component;
    const BottomAxisComponent = axis.bottom?.Component ?? DEFAULT_AXIS.bottom.Component;
    return (
        <>
            <Component
                frame={newFrame}
                {...otherProps}
            />
            {axis.bottom && (
                <BottomAxisComponent
                    height={axis.bottom?.axisWidth ?? 0}
                    width={newFrame.width}
                    x={newFrame.x}
                    y={newFrame.y + newFrame.height}
                    axisDefinition={axis.bottom}
                    tickValues={bottomTicks}
                />
            )
            }
            <LeftAxisComponent
                fill={'lightgrey'}
                frame={{ x: frame.x,
                     y: newFrame.y,
                     width: axis.left?.axisWidth,
                     height: newFrame.height }}
                height={newFrame.height}
                width={axis.left?.axisWidth}
                x={frame.x}
                y={newFrame.y}
                axisDefinition={axis.left}
                tickValues={leftTicks}
            />
        </>
    );
}

export default withAxis;
