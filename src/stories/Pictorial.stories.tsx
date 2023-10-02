import { ComponentMeta, ComponentStory } from "@storybook/react";
import range from "lodash.range";
import React from "react";
import Canvas from "../components/Canvas/Canvas.svg.server";
import Theme from "../contextproviders/Theme";
import { baseTheme as theme } from "../Theme";
import SVG from 'react-inlinesvg';

import PictorialDataSeries from "../dataseries/Pictorial/DataSeries";


export default {
    title: 'reviz-charts/Pictorial',
    component: PictorialDataSeries,
    parameters: {
        dataPoints: [],
        width: 200,
        height: 200,
        padding: {top: 10, right: 10, left: 10, bottom: 10},
    },
} as ComponentMeta<typeof PictorialDataSeries>;


const Template: ComponentStory<typeof React.Component> = ({
    dataPoints,
    height,
    width,
    ...args
}) => {
    return (
        <>
            <h4>Pictogram</h4>
            <Canvas
                height={height}
                width={width}
            >
                <Theme.Provider value={theme}>
                    <PictorialDataSeries
                        Component={({
                            fill,
                            stroke,
                          height,
                          width,
                          x,
                          y,
                          title,
                          isChecked = true,
                        }) => {
                            return (
                                <g transform={`translate(${x} ${y})`}>
                                    <SVG
                                        baseURL="/home"
                                        cacheRequests={true}
                                        description="checkbox"
                                        loader={<span>Loading...</span>}
                                        onError={(error) => console.log(error.message)}
                                        onLoad={(src, hasCache) => console.log(src, hasCache)}
                                        preProcessor={(code) => {
                                            return code
                                                .replace(/fill=".*?"/g, `fill="${fill}"`)
                                                .replace(/stroke=".*?"/g, `stroke="${stroke}"`) 
                                            }
                                        }
                                        src="checkbox-filled.svg"
                                        title={title}
                                        uniqueHash="a1f8d1"
                                        uniquifyIDs={true}
                                        width={width}
                                        height={height}
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                </g>
                            );
                        }}
                        dataPoints={dataPoints}
                        frame={{
                            x: 0.0,
                            y: 0.0,
                            width,
                            height,
                        }}
                        rows={3}
                        columns={3}
                    />
                </Theme.Provider>
            </Canvas>
        </>
    )
}

export const Random = Template.bind({});
Random.args = {

    dataPoints: range(0, 9).map((v, idx) => ({
        value: v,
        label: idx,
        fill: idx % 3 == 0 ? "blue" : "red",
        title: `Title ${idx}`,
    })),
    width: 200,
    height: 100,

}
