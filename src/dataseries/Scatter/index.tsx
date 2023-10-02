import React from 'react';

import Circle from '../../components/Circle';
import Group from '../../components/Group';
import makeDefaultDomain from '../utils/makeDefaultDomain';
import { AxisDefinition, DataSeriesCartesian2D } from '../types';
import { makeScale, ScaleType } from '../utils/makeScale';
import Theme from '../../contextproviders/Theme';
import clsx from 'clsx';


interface ScatterDSParams extends Omit<DataSeriesCartesian2D, 'axisDefinitions'> {
    className?: string,
    axisDefinitions?: {
        x: AxisDefinition
        y: AxisDefinition
      }
};


function Scatter ({
    className,
    DataPointComponent = Circle,
    dataPoints,
    frame = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    axisDefinitions,
} : ScatterDSParams) {
    const theme = React.useContext(Theme);
    if (!axisDefinitions) {
        const {x: domainX, y: domainY} = makeDefaultDomain(dataPoints);
        axisDefinitions = {
            x: {domain: domainX, scale: ScaleType.Linear},
            y: {domain: domainY, scale: ScaleType.Linear}
        };
        axisDefinitions.x.domain = domainX;
        axisDefinitions.y.domain = domainY;
    }
    if (!axisDefinitions.x.scale) {
        axisDefinitions.x.scale = ScaleType.Linear;
    }
    if (!axisDefinitions.y.scale) {
        axisDefinitions.y.scale = ScaleType.Linear;
    }
    const horizontalScale = makeScale(axisDefinitions.x.scale, axisDefinitions.x.domain)
        .range([frame.x, frame.x + frame.width]);
    const verticalScale = makeScale(axisDefinitions.y.scale, axisDefinitions.y.domain)
        .range([frame.y + frame.height, frame.y]);
    return (
        <Group className={clsx([className, 'scatter'])}>
            {dataPoints.map(({x, y}, index) => {
                return (
                    <DataPointComponent
                        fill={theme.colors.primary}
                        stroke={theme.colors.primary}
                        key={index}
                        x={horizontalScale(x)}
                        y={verticalScale(y)}
                    />
                );
            })}
        </Group>
    )
};

export default Scatter;

