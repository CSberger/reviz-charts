import {  Meta, StoryObj } from '@storybook/react';
import range from 'lodash.range';
import { randomNormal } from 'd3-random';

import Scatter from '../../charts/Scatter';

import Chance from 'chance';
const chance = new Chance();


const meta: Meta<typeof Scatter> = {
    component: Scatter,
    title: 'reviz-charts/charts/Scatter',
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
type Story = StoryObj<typeof Scatter>;


const AXIS = [
    range(10).map((i) => String.fromCharCode(97 + i)),
    range(10).map((i) =>String.fromCharCode('Z'.charCodeAt(0) - i))
];

const NUMBER_OF_POINTS = 1000;

export const Random: Story = {
    args: {
        dataPoints: range(NUMBER_OF_POINTS).map(() => [randomNormal(100, 15)(), randomNormal(100, 15)()]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
        aggregateToHexBins: false,
    },
};
export const RandomHex: Story = {
    args: {
        dataPoints: range(NUMBER_OF_POINTS).map(() => [randomNormal(100, 15)(), randomNormal(100, 15)()]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
        aggregateToHexBins: true,
    },
};

export const Decreasing: Story = {
    args: {
        dataPoints: range(NUMBER_OF_POINTS).map((_, idx) => [idx * 10, 10-idx]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
        aggregateToHexBins: false,
    },
};

export const Increasing: Story = {
    args: {
        dataPoints: range(NUMBER_OF_POINTS).map((_, idx) => [idx * 10, idx]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
        aggregateToHexBins: false,
    },
};
