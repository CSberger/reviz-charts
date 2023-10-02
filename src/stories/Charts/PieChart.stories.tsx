import {  Meta, StoryObj } from '@storybook/react';
import range from 'lodash.range';
import { randomNormal } from 'd3-random';

import Pie from '../../charts/Pie';

import Chance from 'chance';
const chance = new Chance();


const meta: Meta<typeof Pie> = {
    component: Pie,
    title: 'reviz-charts/charts/Pie',
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
    }
};

export default meta;
type Story = StoryObj<typeof Pie>;


const AXIS = [
    range(10).map((i) => String.fromCharCode(97 + i)),
    range(10).map((i) =>String.fromCharCode('Z'.charCodeAt(0) - i))
];

export const Random: Story = {
    args: {
        dataPoints: range(10).map(() => randomNormal(100, 15)()).map((v, idx) => ({value: v, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
    },
};
