import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import { ScaleType } from '../../dataseries/utils/makeScale';


import ParallelCoordsChart from '../../charts/ParallelCoords';

export default {
    title: 'reviz-charts/charts/ParallelCoords',
    component: ParallelCoordsChart,
    parameters: {
        data: [],
        width: 200,
        height: 100,
        padding: {top: 10, right: 10, left: 10, bottom: 10},
        axis: {
        }
    },
} as ComponentMeta<typeof ParallelCoordsChart>;


const Template: ComponentStory<typeof ParallelCoordsChart> = ({
    axisDefinitions,
    data,
    width,
    height,
    ...args}) => {
    return (
        <>
            <h4>Parallel Coords</h4>
            <ParallelCoordsChart
                data={data}
                height={height}
                width={width}
                axisDefinitions={axisDefinitions}
            />
        </>
    )
}

export const Random = Template.bind({});
Random.args = {
    width: 400,
    height: 400,
    padding: {top: 10, right: 10, left: 10, bottom: 10},
    axisDefinitions: [
        { domain: [0, 40], label: "Points", scale: ScaleType.Linear },
        { domain: [0, 20], label: "Rebounds", scale: ScaleType.Linear },
        { domain: [0, 20], label: "Assists", scale: ScaleType.Linear }
    ],
    data: [
        {dataPoints: [5, 10, 13]},
        {dataPoints: [10, 2, 3]},
        {dataPoints: [15, 14, 2]}
    ],
}

export const Samples10 = Template.bind({});
Samples10.args = {
    axisDefinitions: [
        { domain: [0, 40], label: "Points", scale: ScaleType.Linear },
        { domain: [0, 20], label: "Rebounds", scale: ScaleType.Linear },
        { domain: [0, 20], label: "Assists", scale: ScaleType.Linear }
    ],    
    data: [
        {dataPoints: [5, 10, 13]},
        {dataPoints: [10, 2, 3]},
        {dataPoints: [15, 14, 2]}
    ],
    width: 400,
    height: 400,
    padding: {top: 10, right: 10, left: 10, bottom: 10}
}
