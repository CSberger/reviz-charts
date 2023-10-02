import {  Meta, StoryObj } from '@storybook/react';
import range from 'lodash.range';
import { randomNormal } from 'd3-random';
import product from 'fast-cartesian';

import Heatmap from '../../charts/Heatmap';

import { OrientationEnum } from '../../dataseries/types';


const meta: Meta<typeof Heatmap> = {
    component: Heatmap,
    title: 'reviz-charts/charts/Heatmap',
    argTypes: {
        width: {
            control: {
                type: 'number',
                range: [0, 1000]
            }
        },
        height: {
            control: {
                type: 'number',
                range: [0, 1000]
            }
        },
        innerPadding: {
            control: {
                type: 'number',
                range: [0, 1],
                step: 0.05
            }
        },
        outerPadding: {
            control: {
                type: 'number',
                range: [0, 1],
                step: 0.05
            }
        },
        numBins: {
            control: {
                type: 'range',
                range: [2, 20],
                step: 1
            }
        },
    }
};

export default meta;
type Story = StoryObj<typeof Heatmap>;


const AXIS = [
    range(10).map((i) => String.fromCharCode(97 + i)),
    range(10).map((i) =>String.fromCharCode('Z'.charCodeAt(0) - i))
]
export const Random: Story = {
    args: {
        axisDefinitions: {
            horizontal: {
                domain: AXIS[0]
            },
            vertical: {
                domain: AXIS[1]
            }
        },
        orientation: OrientationEnum.vertical,
        dataPoints: product([AXIS[0], AXIS[1]]).map(([i, j]) => ({i, j, value: randomNormal(100, 15)()})),
        width: 400,
        height: 400,
        innerPadding: 0,
        outerPadding: 0.1,
        showAxes: false,
    },
};
