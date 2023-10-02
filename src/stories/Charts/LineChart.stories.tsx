import {  Meta, StoryObj } from '@storybook/react';
import range from 'lodash.range';
import { randomNormal } from 'd3-random';

import Line from '../../charts/Line';

import Chance from 'chance';
import { CurveEnum } from '../../dataseries/Line/types';
const chance = new Chance();


const meta: Meta<typeof Line> = {
    component: Line,
    title: 'reviz-charts/charts/Line',
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
        curveType: {
            control: {
                type: 'radio',
            },
            options: Object.values(CurveEnum)
        },
    }
};

export default meta;
type Story = StoryObj<typeof Line>;


const AXIS = [
    range(10).map((i) => String.fromCharCode(97 + i)),
    range(10).map((i) =>String.fromCharCode('Z'.charCodeAt(0) - i))
];

export const Random: Story = {
    args: {
        dataPoints: range(10).map(() => [randomNormal(100, 15)(), randomNormal(100, 15)()]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
    },
};

export const Decreasing: Story = {
    args: {
        dataPoints: range(10).map((_, idx) => [idx * 10, 10-idx]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
    },
};

export const Increasing: Story = {
    args: {
        dataPoints: range(10).map((_, idx) => [idx * 10, idx]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        width: 400,
        height: 400,
    },
};
