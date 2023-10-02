import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import Canvas from "../components/Canvas/Canvas.svg.server";
import Theme from "../contextproviders/Theme";
import { baseTheme as theme } from "../Theme";
import withPadding from "../dataseries/modifiers/withPadding";
import PieDataSeries from "../dataseries/Pie";
import LabelledPieSlice from "../dataseries/Pie/LabelledPieSlice";
import PieSlice from "../dataseries/Pie/PieSlice";
import SAMPLE_DATA_POINTS from './fixtures/1dpoints_small';

const PieSeries = withPadding(PieDataSeries);

export default {
    title: 'Pie',
    component: PieDataSeries,
    parameters: {
        component: 'PieSlice',
        dataPoints: [],
        width: 200,
        height: 100,
        padding: {top: 10, right: 10, left: 10, bottom: 10},
    },
    argTypes: {
        component: {
                control: 'select', 
                options: ['PieSlice', 'LabelledPieSlice']
            }
        },
    
} as ComponentMeta<typeof PieDataSeries>;


const Template: ComponentStory<typeof React.Component> = ({
    axisDefinitions,
    component,
    dataPoints,
    width,
    height,
    padding,
    ...args
}) => {
    const DataPointComponent = component === 'LabelledPieSlice' ? LabelledPieSlice : PieSlice;
    return (
        <>
            <h4>Pie</h4>
            <Canvas
                height={height}
                width={width}
            >
                <Theme.Provider value={theme}>
                    <PieSeries
                        className="piechart"
                        DataPointComponent={DataPointComponent}
                        backgroundCircleStyle={{fill: 'white'}}
                        dataPoints={dataPoints.map((v, idx) => ({value: v, label: idx}))}
                        frame={{
                            x: 0.0,
                            y: 0.0,
                            width,
                            height,
                        }}
                        padding={padding}
                    />
                </Theme.Provider>
            </Canvas>
        </>
    )
}

export const Random = Template.bind({});
Random.args = {

    dataPoints: SAMPLE_DATA_POINTS,
    width: 400,
    height: 400,
    padding: {top: 10, right: 10, left: 10, bottom: 10},

}
