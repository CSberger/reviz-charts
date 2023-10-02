import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import range from 'lodash.range';

import BarChart from '../../charts/Bar';
import withPadding from '../../dataseries/modifiers/withPadding';

import withAxis from '../../dataseries/modifiers/withAxis';

import { ScaleType } from '../../dataseries/utils/makeScale';
import Chart from '../../components/Chart/chart.client';
import Modal from '../../contextproviders/Modal';
import { randomUniform } from 'd3-random';
import { OrientationEnum } from '../../dataseries/types';

const SAMPLE_DATA_POINTS = [1, 4, 3, 5, 2];

const AXIS_DEFINITIONS = {
    x: { domain: range(5), scale: ScaleType.Band },
    y: { domain: [0, 5], scale: ScaleType.Linear },
};


const meta: Meta<typeof BarChart> = {
    component: BarChart,
    title: 'reviz-charts/charts/Bar',
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
        }
    }
};

export default meta;
type Story = StoryObj<typeof BarChart>;



export const Random: Story = {
    args: {
        orientation: OrientationEnum.vertical,
        dataPoints: range(12).map(() => randomUniform(1, 10)()).map(v => ({value: v})),
        width: 400,
        height: 400,
        innerPadding: 0.15,
        outerPadding: 0.1,
        showAxes: false,
    },
};

export const Horizontal: Story = {
    args: {
        orientation: OrientationEnum.horizontal,
        dataPoints: range(12).map(() => randomUniform(1, 10)()).map(v => ({value: v})),
        width: 400,
        height: 400,
        innerPadding: 0.15,
        outerPadding: 0.1,
        showAxes: false,
    },
};

export const WithAxis: Story = {
    args: {
        orientation: OrientationEnum.horizontal,
        dataPoints: range(12).map(() => randomUniform(1, 10)()).map(v => ({value: v})),
        width: 400,
        height: 400,
        innerPadding: 0.15,
        outerPadding: 0.1,
        showAxes: true,
    },
};
