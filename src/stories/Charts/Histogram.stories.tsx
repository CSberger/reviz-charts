import {  Meta, StoryObj } from '@storybook/react';
import range from 'lodash.range';
import { randomNormal } from 'd3-random';

import Histogram from '../../charts/Histogram';

import { OrientationEnum } from '../../dataseries/types';


const meta: Meta<typeof Histogram> = {
    component: Histogram,
    title: 'reviz-charts/charts/Histogram',
    argTypes: {
        orientation: {
            control: {
                type: 'select',
                options: [OrientationEnum.vertical, OrientationEnum.horizontal]
            }
        },
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
type Story = StoryObj<typeof Histogram>;



export const Random: Story = {
    args: {
        orientation: OrientationEnum.vertical,
        dataPoints: range(1000).map(() => randomNormal(100, 15)()),
        width: 400,
        height: 400,
        innerPadding: 0,
        outerPadding: 0,
        showAxes: false,
    },
};
