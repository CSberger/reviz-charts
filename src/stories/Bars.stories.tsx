import { ComponentStory, ComponentMeta } from '@storybook/react';
import range from 'lodash.range';

import Bars from '../dataseries/Bars/BarDataSeries';
import withPadding from '../dataseries/modifiers/withPadding';

import withAxis from '../dataseries/modifiers/withAxis';

import { ScaleType } from '../dataseries/utils/makeScale';
import Chart from '../components/Chart/chart.client';
import React, { useEffect } from 'react';
import Modal from '../contextproviders/Modal';

const SAMPLE_DATA_POINTS = [1, 4, 3, 5, 2];

const AXIS_DEFINITIONS = {
    x: { domain: range(5), scale: ScaleType.Band },
    y: { domain: [0, 5], scale: ScaleType.Linear },
};
export default {
    title: 'reviz-charts/dataseries/Bars',
    component: Bars,
    parameters: {
        dataPoints: [],
        width: 200,
        height: 100,
        orientation: 'vertical',
    }
} as ComponentMeta<typeof Bars>;


const PaddedBars = withPadding(Bars);
const AxisBars = withPadding(withAxis(Bars));

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

const Template: ComponentStory<typeof Bars> = ({width, height, dataPoints, ...args}) => {
    console.log(dataPoints);
    const [active, setActive] = React.useState(null);
    return (
        <>
            <h4>Bars</h4>
            <Modal.Provider value={{setToolTip: setActive}}>
                <Chart
                    height={height}
                    width={width}
                >          
                    <Bars
                        width={width}
                        height={height}
                        frame={{
                            x: 0.0,
                            y: 0.0,
                            width,
                            height,
                        }}
                        {...args}
                        dataPoints={dataPoints.map((v) => ({value: v}))}

                    />
                </Chart>
            </Modal.Provider>
        </>
    )
};

const AxisTemplate: ComponentStory<typeof Bars> = ({
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
        numTicks: 5,
        scale: ScaleType.Linear,
        domain: [0, 5],
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
            <h4>Bars</h4>
            <Modal.Provider value={{setToolTip: setActive}}>
                <Chart
                    height={height}
                    width={width}
                >          
                    <AxisBars
                        axis={axis}
                        axisDefinitions={axisDefinitions}
                        width={width}
                        height={height}
                        frame={{
                            x: 0.0,
                            y: 0.0,
                            width,
                            height,
                        }}
                        innerPadding={innerPadding}
                        outerPadding={outerPadding}
                        dataPoints={dataPoints.map((v) => ({value: v}))}
                        orientation={orientation}
                        {...args}

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
    dataPoints: SAMPLE_DATA_POINTS,
    width: 400,
    height: 400,
    padding: {top: 0, right: 0, left: 0, bottom: 0},
    size: 10,
    innerPadding: 0,
    outerPadding: 0
}

export const withAxisEx = AxisTemplate.bind({});
withAxisEx.args = {
    dataPoints: SAMPLE_DATA_POINTS,
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
    dataPoints: SAMPLE_DATA_POINTS,
    width: 400,
    height: 400,
    orientation: 'horizontal',
    padding: {top: 10, right: 10, left: 10, bottom: 10},
    size: 10,
    innerPadding: 0,
    outerPadding: 0
}
