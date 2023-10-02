import {  Meta, StoryObj } from '@storybook/react';
import range from 'lodash.range';
import { randomNormal } from 'd3-random';

import Area from '../../charts/Area';

import Chance from 'chance';
import { CurveEnum } from '../../dataseries/Line/types';
const chance = new Chance();


const meta: Meta<typeof Area> = {
    component: Area,
    title: 'reviz-charts/charts/Area',
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
type Story = StoryObj<typeof Area>;


const AXIS = [
    range(10).map((i) => String.fromCharCode(97 + i)),
    range(10).map((i) =>String.fromCharCode('Z'.charCodeAt(0) - i))
];

export const Random: Story = {
    args: {
        dataPoints: range(10).map((_, idx) => [idx * 10, randomNormal(100, 15)() + idx * 10]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
        lineProps: [
            {
                dataPoints: range(10).map((_, idx) => [idx * 10, 20 - idx]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
                stroke: 'blue'
            },
            {
                dataPoints: range(10).map((_, idx) => [idx * 10, 10 - idx]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
                stroke: 'green'
            },

        ],
        width: 400,
        height: 400,
        connectEnds: true,
    },
};

export const Decreasing: Story = {
    args: {
        dataPoints: range(10).map((_, idx) => [idx * 10, 10 - idx]).map(([x, y], idx) => ({x, y, label: chance.word({syllables: 2})})),
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
