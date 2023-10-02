import { scalePoint } from 'd3-scale';


import Chart from '../components/Chart/chart.server';
import Group from '../components/Group';
import Line from '../dataseries/Line';
import withPadding from '../dataseries/modifiers/withPadding';
import { AxisDefinition, DP2D, DataSeriesFrame } from '../dataseries/types';
import { makeScale, ScaleType } from '../dataseries/utils/makeScale';
import Circle from '../components/Circle';
import { baseTheme } from '../Theme';

const PaddedLine = withPadding(Line);


interface ParallelCoordsChartProps {
    axisDefinitions: AxisDefinition[];
    data: any[];
    height: number;
    width: number;
    frame: DataSeriesFrame
    numTicks: number;
    theme: any;
}

const NUM_TICKS = 10;
function ParallelCoordsDataSeries ( {
    axisDefinitions = [],
    data = [],
    width = 400,
    height = 400,
    frame = {
        x: 0.0,
        y: 0.0,
        width,
        height,
    },
    numTicks = NUM_TICKS,
    theme = baseTheme,
    ...otherProps
}: ParallelCoordsChartProps) {
    //    const theme = useContext(Theme);

    const pointDomain = axisDefinitions.map((_: any, i: number) => String(i));
    const pointPositionScale = scalePoint()
        .range([frame.x, frame.x + frame.width])
        .domain(pointDomain);
    const scales = axisDefinitions.map((axisDefinition: AxisDefinition) => {
        const {domain, scale} = axisDefinition;
        const scaleFn = makeScale(scale as ScaleType, domain)
            .range([frame.x, frame.x + frame.width]);
        return scaleFn;
    });

    return (
        <Group>
            <Group>
                {axisDefinitions.map((axisDefinition: AxisDefinition, i: number) => {
                    const xPos = pointPositionScale(String(i)) as number;
                    const ticks = scales[i].ticks(numTicks);
                    return (
                        <Group key={i}>
                            <line
                                key={i}
                                x1={xPos}
                                x2={xPos}
                                y1={frame.y}
                                y2={frame.y + frame.height}
                                stroke="black"
                            />
                            <text
                                textAnchor={'middle'}
                                x={xPos}
                                y={frame.y + frame.height + 10}
                            >
                                {axisDefinition.domain[0]}
                            </text>
                            <text
                                textAnchor={'middle'}
                                x={xPos}
                                y={frame.y}
                            >
                                {axisDefinition.domain[1]}
                            </text>
                            <Group>
                                {ticks.map((tick: any, j: number) => {
                                    const yPos = scales[i](tick);
                                    return (
                                        <line
                                            key={j}
                                            x1={xPos - 5}
                                            x2={xPos + 5}
                                            y1={yPos}
                                            y2={yPos}
                                            stroke="black"
                                        />
                                    )
                                })}
                            </Group>                                  
                        </Group>
                    )
                })
                }
            </Group>
            <Group>
                {data.map(({dataPoints}: {dataPoints: number[]}, i: number) => {
                    const mappedPoints = dataPoints.map((dataPoint, j: number) => {
                        return {
                            x: pointPositionScale(String(j)),
                            y: scales[j](dataPoint),
                        }
                    });
                    return (
                        <Line 
                            axisDefinitions={null}
                            DataPointComponent={Circle}
                            lineProps={{
                                stroke: theme.colorScale.category[i],
                                fill: 'none',
                                strokeWidth: 2
                            }}
                            pointProps={{
                                stroke: theme.colorScale.category[i],
                                fill: 'none'
                            }}
                            stroke={theme.colorScale.category[i]}
                            frame={frame}
                            key={i}
                            dataPoints={mappedPoints as DP2D[]}
                        />
                    )
                })}
            </Group>
        </Group>
    );
}

const PaddedParallelCoords = withPadding(ParallelCoordsDataSeries);

export default function ParallelCoordsChart({
    axisDefinitions = [],
    data = [],
    height = 400,
    width = 400,
    ...otherProps
}: ParallelCoordsChartProps) {

    return (
        <Chart
            height={height}
            width={width}
        >
            <PaddedParallelCoords 
                axisDefinitions={axisDefinitions}
                data={data}
                frame={{
                    x: 0,
                    y: 0,
                    width,
                    height,
                }}
                padding={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            />
        </Chart>
    );
}