import React, { useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import HexScatter from '../dataseries/HexScatter';
import withPadding from '../dataseries/modifiers/withPadding';

import SAMPLE_DATA_POINTS from './fixtures/2dpoints';
import { ScaleType } from '../dataseries/utils/makeScale';
import Chart from '../components/Chart/chart.client';
import Modal from '../contextproviders/Modal';
import withCursor from '../dataseries/modifiers/withCursor';


export default {
    title: 'reviz-charts/dataseries/HexScatter',
    component: HexScatter,
    parameters: {
        dataPoints: [],
        width: 200,
        height: 100,
    }
} as ComponentMeta<typeof HexScatter>;


const PaddedScatterHex = withPadding(withCursor(HexScatter));

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

const Template: ComponentStory<typeof HexScatter> = ({width, height, ...args}) => {
    const [active, setActive] = React.useState(null);
    return (
        <>
            <h4>hex scatter</h4>
            <Modal.Provider value={{setToolTip: setActive}}>
                <Tooltip
                    payload={active?.payload}
                    coords={active?.cursor}
                />
                <Chart
                    height={height}
                    width={width}
                >          
                    <PaddedScatterHex
                        width={width}
                        height={height}

                        {...args}
                        frame={{
                            x: 0.0,
                            y: 0.0,
                            width,
                            height,
                        }}                        
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
        y: { domain: [0, 10], scale: ScaleType.Linear },
    },      
    dataPoints: SAMPLE_DATA_POINTS,
    width: 400,
    height: 400,
    padding: {top: 0, right: 0, left: 0, bottom: 0},
    size: 10
}

export const withAxis = Template.bind({});
withAxis.args = {
    axisDefinitions: {
        x: { domain: [0, 800], scale: ScaleType.Linear },
        y: { domain: [0, 10], scale: ScaleType.Linear },
    },        
    dataPoints: SAMPLE_DATA_POINTS,
    width: 400,
    height: 400,
    padding: {top: 0, right: 0, left: 0, bottom: 0},
    size: 10
}

export const Samples10 = Template.bind({});
Samples10.args = {
    axisDefinitions: {
        x: { domain: [0, 800], scale: ScaleType.Linear },
        y: { domain: [0, 10], scale: ScaleType.Linear },
    },        
    dataPoints: [
        {x: 1, y: 1},
        {x: 1.4, y: 1.5},
        {x: 2, y: 2}
    ],
    width: 400,
    height: 400,
    padding: {top: 0, right: 0, left: 0, bottom: 0},
    size: 10
}
