import { ComponentStory, ComponentMeta } from '@storybook/react';

import Scatter from '../dataseries/Scatter';
import Canvas from '../components/Canvas/Canvas.svg.server';
import withAxis from '../dataseries/modifiers/withAxis';
import SAMPLE_DATA_POINTS from './fixtures/2dpoints';
import { ScaleType } from '../dataseries/utils/makeScale';
import withPadding from '../dataseries/modifiers/withPadding';


const AxisScatter = withPadding(withAxis(Scatter));
export default {
    title: 'reviz-charts/dataseries/Scatter',
    component: Scatter,
    parameters: {
        dataPoints: [],
        width: 200,
        height: 100,
        padding: {top: 10, right: 10, left: 10, bottom: 10},
        axis: {
        }
    }
} as ComponentMeta<typeof Scatter>;


const Template: ComponentStory<typeof Scatter> = ({axisDefinitions, width, height, ...args}) => {
    return (
        <>
            <h4>scatter</h4>
            <Canvas
                height={height}
                width={width}
            >
                <AxisScatter
                    axisDefinitions={axisDefinitions}
                    width={width}
                    height={height}
                    axis={{
                        left: { axisWidth: 50, ...axisDefinitions?.y, numTicks: 5 },
                        bottom: { axisWidth: 50, ...axisDefinitions?.x, numTicks: 5 },
                    }}
                    frame={{
                        x: 0.0,
                        y: 0.0,
                        width,
                        height,
                    }}
                    {...args}
                />
            </Canvas>
        </>
    )
}

export const Random = Template.bind({});
Random.args = {
    dataPoints: SAMPLE_DATA_POINTS,
    width: 400,
    height: 400,
    padding: {top: 10, right: 10, left: 10, bottom: 10},
    axisDefinitions: {
        x: { domain: [0, 800], scale: ScaleType.Linear },
        y: { domain: [0, 10], scale: ScaleType.Linear },
    }
}

export const Samples10 = Template.bind({});
Samples10.args = {
    axisDefinitions: {
        x: { domain: [0, 800], scale: ScaleType.Linear },
        y: { domain: [0, 10], scale: ScaleType.Linear },
    },    
    dataPoints: [
        {x: 1, y: 1},
        {x: 1.4, y: 1.5},
        {x: 2, y: 2}
    ],
    width: 400,
    height: 400,
    padding: {top: 10, right: 10, left: 10, bottom: 10}
}
