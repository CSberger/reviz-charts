import { ComponentStory, ComponentMeta } from '@storybook/react';
import range from 'lodash.range';
import React, { useEffect } from 'react';
import { randomNormal, randomLcg } from 'd3-random';

import BoxDataSeries from '../dataseries/Box/BoxDataSeries';
import withPadding from '../dataseries/modifiers/withPadding';

import withAxis from '../dataseries/modifiers/withAxis';

import { ScaleType } from '../dataseries/utils/makeScale';
import Chart from '../components/Chart/chart.client';
import Modal from '../contextproviders/Modal';
import { extent } from 'd3-array';

const NUM_BOXES = 5;
const NUM_DATA_POINTS = 20;

const seed = 0.44871573888282423; // any number in [0, 1)
const random = randomNormal.source(randomLcg(seed));

const BOX_DATA_POINTS = range(NUM_BOXES).map((v) => ({values: range(NUM_DATA_POINTS).map(() => random(2.5, 2)())}));

const domainExtent = extent([...BOX_DATA_POINTS.map(v => v.values)].flat(1));
const [minValue, maxValue] = domainExtent;
const AXIS_DEFINITIONS = {
    x: { domain: range(NUM_BOXES), scale: ScaleType.Band },
    y: { domain: [minValue - 1, maxValue + 1], scale: ScaleType.Linear },
};

console.warn(`AXIS_DEFINITIONS: ${JSON.stringify(AXIS_DEFINITIONS)}`);
export default {
    title: 'reviz-charts/dataseries/Box',
    component: BoxDataSeries,
    parameters: {
        dataPoints: [],
        width: 200,
        height: 100,
        orientation: 'vertical',
    }
} as ComponentMeta<typeof BoxDataSeries>;


const PaddedBoxes  = withPadding(BoxDataSeries);
const AxisBoxes = withPadding(withAxis(BoxDataSeries));

function Tooltip ({coords, payload}) {
    const [showTooltip, setShowTooltip] = React.useState(false);
    useEffect(() => {
        setShowTooltip(false);
        console.log(`This will run after 1 second! ${JSON.stringify(coords)}`)

        const timer = setTimeout(() => {
          console.log('This will run after 1 second!')
          setShowTooltip(true);
        }, 500);
        return () => clearTimeout(timer);
      }, [coords?.x, coords?.y]);
    return (
        showTooltip && <div style={{
            backgroundColor: 'rgba(256, 256, 256, 0.90)',
            position: 'absolute',
            top:  coords?.y - 10 ?? 0 ,
            left: coords?.x + 30 ?? 0 ,
            zIndex: 1000,
            width: 400,
        }}>
            <div>
                <span>count: {payload?.count}</span>
                <ul>
                {payload?.dataPoints.map((dp) => {
                    return <li>{`(${dp.x}, ${dp.y})`}</li>
                })}
                </ul>
            </div>
        </div>
    );
}

const Template: ComponentStory<typeof BoxDataSeries> = ({width, height, dataPoints, ...args}) => {
    console.log(dataPoints);
    const [active, setActive] = React.useState(null);
    const [minValue, maxValue] = [0, 5];
    return (
        <>
            <h4>Boxes</h4>
            <Modal.Provider value={{setToolTip: setActive}}>
                <Chart
                    height={height}
                    width={width}
                >          
                    <BoxDataSeries
                        {...args}
                        frame={{
                            x: 0.0,
                            y: 0.0,
                            width,
                            height,
                        }}                        
                        dataPoints={dataPoints}
                    />
                </Chart>
            </Modal.Provider>
        </>
    )
};

const AxisTemplate: ComponentStory<typeof BoxDataSeries> = ({
    width,
    height,
    dataPoints,
    innerPadding,
    outerPadding,
    orientation,
    ...args
}) => {
    const [active, setActive] = React.useState(null);
    const valueAxisDef = {
        axisWidth: 50,
        numTicks: 10,
        scale: ScaleType.Linear,
        domain: AXIS_DEFINITIONS.y.domain,
    };
    const posAxisDef = {
        axisWidth: 50,
        numTicks: 5,
        innerPadding,
        outerPadding,
        domain: range(dataPoints.length),
        scale: ScaleType.Band,
    };

    const axis = {
        left: orientation == 'vertical' ? valueAxisDef: posAxisDef,
        bottom: orientation == 'vertical' ? posAxisDef: valueAxisDef,
    };

    const axisDefinitions = {
        x: orientation !== 'vertical' ? valueAxisDef: posAxisDef,
        y: orientation !== 'vertical' ? posAxisDef : valueAxisDef,
    };

    return (
        <>
            <h4>Axis Boxes</h4>
            <Modal.Provider value={{setToolTip: setActive}}>
                <Chart
                    height={height}
                    width={width}
                >          
                    <AxisBoxes
                        axis={axis}
                        width={width}
                        height={height}
                        innerPadding={innerPadding}
                        outerPadding={outerPadding}
                        dataPoints={dataPoints}
                        orientation={orientation}
                        {...args}
                        frame={{
                            x: 0.0,
                            y: 0.0,
                            width,
                            height,
                        }}                        
                        axisDefinitions={axisDefinitions}
                    />
                </Chart>
            </Modal.Provider>
        </>
    )
}

export const Random = Template.bind({});
Random.args = {
    axisDefinitions: {
        x: { domain: [0, 800], scale: ScaleType.Linear },
        y: { domain: [0, 5], scale: ScaleType.Linear },
    },      
    orientation: 'vertical',
    dataPoints: BOX_DATA_POINTS,
    width: 400,
    height: 400,
    padding: {top: 0, right: 0, left: 0, bottom: 0},
    size: 10,
    innerPadding: 0,
    outerPadding: 0
}

export const withAxisEx = AxisTemplate.bind({});
withAxisEx.args = {
    dataPoints: BOX_DATA_POINTS,
    width: 400,
    height: 400,
    orientation: 'vertical',
    padding: {top: 10, right: 10, left: 10, bottom: 10},
    size: 10,
    innerPadding: 0,
    outerPadding: 0
}

export const Horizontal = AxisTemplate.bind({});
Horizontal.args = {
    dataPoints: BOX_DATA_POINTS,
    width: 400,
    height: 400,
    orientation: 'horizontal',
    padding: {top: 10, right: 10, left: 10, bottom: 10},
    size: 10,
    innerPadding: 0,
    outerPadding: 0
}
