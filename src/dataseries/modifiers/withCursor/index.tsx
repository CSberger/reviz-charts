import React, { useContext, useState } from 'react';
import Group from '../../../components/Group';
import SVGCanvas from '../../../contextproviders/SVGCanvas';
import Cursor from '../../../contextproviders/Cursor';
import { ScaleType, makeScale } from '../../utils/makeScale';
import Theme from '../../../contextproviders/Theme';
import { AxisDefinition, DataSeriesFrame } from '../../types';

const FONT_SIZE = 12;
const NUM_ROUNDING_DIGITS = 5;

interface CursorAxisDef extends Omit<AxisDefinition, 'scale'> {
    scale: ScaleType,
}

interface CursorAxisDefinitions {
    x: CursorAxisDef,
    y: CursorAxisDef
}
function CursorComponent (
    { axisDefinitions, coords, frame }:
    { axisDefinitions: CursorAxisDefinitions, coords: any, frame: any }) {
    const theme = useContext(Theme);
    const xScale = makeScale(axisDefinitions.x.scale, axisDefinitions.x.domain);
    const yScale = makeScale(axisDefinitions.y.scale, axisDefinitions.y.domain);
    xScale.range([frame.x, frame.x + frame.width]);
    yScale.range([frame.y + frame.height, frame.y]);
    const inLeftHalf = coords.x < frame.width / 2;
    const inTopHalf = coords.y < frame.height / 2;

    return (
            <Group pointerEvents={'none'}>
                        <line
                            stroke={theme.colors.tertiary}
                            x1={frame.x}
                            y1={coords.y}
                            x2={frame.x + frame.width}
                            y2={coords.y}
                        />
                        <line 
                            stroke={theme.colors.tertiary}
                            x1={coords.x}
                            y1={frame.y}
                            x2={coords.x}
                            y2={frame.y + frame.height}
                        />
                        <g transform={`translate(${coords.x},${ inLeftHalf ? frame.y : frame.height + frame.y})`}>
                            <text
                                alignmentBaseline={inLeftHalf ? 'hanging' : 'auto'}
                                fontFamily={theme.fonts.primary}
                                fontSize={theme.fontSizes.small}
                                textAnchor={inLeftHalf ? "end": 'start'}
                                transform={"rotate(-90)"}
                            >
                                {xScale.invert(coords?.x).toFixed(NUM_ROUNDING_DIGITS)}
                            </text>
                        </g>
                        <g transform={`translate(${!inTopHalf ? frame.x: frame.x + frame.width},${coords.y})`}>
                            <text
                                alignmentBaseline={inTopHalf ? 'hanging' : 'auto'}
                                fontFamily={theme.fonts.primary}
                                fontSize={theme.fontSizes.small}
                                textAnchor={!inTopHalf ? "start": 'end'}
                            >
                                {yScale.invert(coords?.y).toFixed(NUM_ROUNDING_DIGITS)}
                            </text>
                        </g>

            </Group>
    );
}

interface WithCursorProps {
    axisDefinitions: CursorAxisDefinitions,
    frame: DataSeriesFrame,
}
const withCursor = (Component: any) => ({ 
    axisDefinitions,
    frame,
    ...otherProps
}: WithCursorProps) => {
    const svgRef = useContext<any>(SVGCanvas);

    const [coords, setCoords] = useState({x: 10, y: 10});
    
    return (
        <Group
            className={'with-cursor'}
            onMouseMove={(evt: {clientX: number, clientY: number}) => {
                var pt = svgRef?.current?.createSVGPoint();
                pt.x = evt.clientX;
                pt.y = evt.clientY;
                const cursorpt =  pt.matrixTransform(svgRef?.current?.getScreenCTM().inverse());
                setCoords({
                    x: cursorpt.x,
                    y: cursorpt.y
                });
            }}
        >
            <Cursor.Provider
                value={coords}
            >
                <Component
                    axisDefinitions={axisDefinitions}
                    frame={frame}
                    {...otherProps}
                />
                <rect
                    cursor={'none'}
                    onMouseOut={() => setCoords({x: 10, y: 10})}
                    fill={"white"}
                    fillOpacity={0.0}
                    x={frame.x}
                    y={frame.y}
                    width={frame.width}
                    height={frame.height}
                />
                {coords && <CursorComponent
                    axisDefinitions={axisDefinitions}
                    coords={coords}
                    frame={frame}
                />
                }
            </Cursor.Provider>
        </Group>
    );
}

withCursor.displayName = 'withCursor';
export default withCursor;
