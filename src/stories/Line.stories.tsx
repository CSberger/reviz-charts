import { ComponentStory, ComponentMeta } from '@storybook/react';

import Line from '../dataseries/Line';
import Canvas from '../components/Canvas/Canvas.svg.client';
import withAxis from '../dataseries/modifiers/withAxis';
import { ScaleType } from '../dataseries/utils/makeScale';
import withPadding from '../dataseries/modifiers/withPadding';


const AxisLine = withPadding(withAxis(Line));
export default {
    title: 'reviz-charts/dataseries/Line',
    component: Line,
    parameters: {
        dataPoints: [],
        width: 200,
        height: 100,
        padding: {top: 10, right: 10, left: 10, bottom: 10},
        axis: {
        }
    },
    argTypes: {
        curveType: {
            control: {
                type: 'radio',
            },
            options: [
                'curveBasis',
                'curveStepAfter',
                'curveStepBefore',
                'curveBasis',
                'curveCardinal',
                'curveMonotoneX',
                'curveMonotoneY',
                'curveNatural',
                'curveLinear'
            ],
        },
    }
} as ComponentMeta<typeof Line>;


const Template: ComponentStory<typeof Line> = ({axisDefinitions, width, height, ...args}) => {
    return (
        <>
            <h4>Line</h4>
            <Canvas
                height={height}
                width={width}
            >
                <AxisLine
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
    width: 400,
    height: 400,
    padding: {top: 10, right: 10, left: 10, bottom: 10},
    axisDefinitions: {
        x: { domain: [0, 3], scale: ScaleType.Linear },
        y: { domain: [0, 3], scale: ScaleType.Linear },
    },    
    dataPoints: [
        {x: 1, y: 1},
        {x: 2, y: 3},
        {x: 3, y: 2}
    ],
}

export const Samples10 = Template.bind({});
Samples10.args = {
    axisDefinitions: {
        x: { domain: [0, 3], scale: ScaleType.Linear },
        y: { domain: [0, 3], scale: ScaleType.Linear },
    },    
    dataPoints: [
        {x: 1, y: 1},
        {x: 2, y: 3},
        {x: 3, y: 2}
    ],
    width: 400,
    height: 400,
    padding: {top: 10, right: 10, left: 10, bottom: 10}
}
