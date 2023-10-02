import React, { useContext, useState } from 'react';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';

import range from 'lodash.range';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';


import Group from '../../components/Group';
import makeDefaultDomain from '../utils/makeDefaultDomain';
import Cursor from '../../contextproviders/Cursor';
import withCursor from '../modifiers/withCursor';
import { HEX2D, HexOrientation, HexScatterDSParams } from './types';
import Hex from './Hex';
import Scatter from '../Scatter';
import Theme from '../../contextproviders/Theme';
import clsx from 'clsx';
import Modal from '../../contextproviders/Modal';
import { DataSeriesFrame, DP2D } from '../types';
import { extent } from 'd3-array';


const BORDER_WIDTH = 0.1;
const HEX_SIZE = 20;
const DEFAULT_FILL = 'none';

interface HexPoint extends HEX2D {
    x: number
    y: number
    dataPointProps?: any
}

function hexToXY ({q, r}: HEX2D, size: number, frame: DataSeriesFrame) {
    return {
        x: size * (Math.sqrt(3) * q + ( r&1 ? Math.sqrt(3) / 2  : 0)) - BORDER_WIDTH,
        y: frame.height - size * (3./2 * r),
    };
}

function xyToHex({x, y}: DP2D, size: number, frame: DataSeriesFrame) {
    const r = Math.round((frame.height - y) / size / (3. / 2.));
    
    return {
        q: Math.round(((x + BORDER_WIDTH)/size -  (r&1 ? Math.sqrt(3.) / 2  : 0)) / Math.sqrt(3.)),
        r
    };
}

function makeHexIdx(q: number, r: number): string {
    return `${q}_${r}`;
}

function HexMap ({
    className,
    dataPointMap,
    DataPointComponent = Hex,
    frame = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    hexOrientation = HexOrientation.FLAT,
    size = HEX_SIZE
} : HexScatterDSParams) {
    const cursorCoords = useContext(Cursor);
    const theme = useContext(Theme);
    const { setToolTip } = useContext(Modal);
    const horizOffset = Math.sqrt(3) * size / 2;

    const hexHeight = Math.floor(frame.height / size / 3 * 2 + 2);
    const hexWidth = Math.floor(frame.width / horizOffset / 2) + 1;
    let hexPoints: HexPoint[] = [];
    range(hexHeight).forEach(r => {
        range(hexWidth).forEach(q => {
            let coords = {
                ...hexToXY({q, r}, size, frame),
                q,
                r
            };
            const hexIdx: string = makeHexIdx(q, r);
            const dataHex: any = dataPointMap[hexIdx];
            hexPoints.push({...coords, ...dataHex});
        })
    });

    const activeHex = cursorCoords ? xyToHex(cursorCoords, size, frame) : null;
    let activeDataHex = null
    if (activeHex) {
        const activeHexIdx = makeHexIdx(activeHex?.q, activeHex?.r);
        activeDataHex = dataPointMap[activeHexIdx];
        setToolTip({cursor: cursorCoords, payload: activeDataHex});
    }

    return (
        <Group
            className={clsx([className, 'hexmap'])}
        >
            {hexPoints.map(({ x, y, q, r, dataPointProps, ...rest }) => {
                const hexIR = makeHexIdx(q, r);
                const hexExists = dataPointMap[hexIR];
                return (
                     hexExists && (
                        <DataPointComponent
                            key={`${q}.${r}`}
                            borderWidth={BORDER_WIDTH}
                            dataPointProps={{q, r}}
                            fill={cursorCoords && q === activeHex?.q && r === activeHex?.r ? theme.colors.active: dataPointProps?.fill ?? 'black'}
                            radius={size}
                            x={frame.x + x - BORDER_WIDTH / 2}
                            y={y}
                            {...rest}
                        />
                    )
                )
            })}
        </Group>
    );
};

function HexScatter ({
    dataPoints,
    domain,
    frame,
    size=HEX_SIZE,
    showScatter = false,
   ...otherProps
}: {
    dataPoints: any[],
    domain: any,
    frame: any,
    size: number,
    showScatter?: boolean
    otherProps: any
}) {
    if (!domain) {
        domain = makeDefaultDomain(dataPoints);
    }
    const horizontalScale = scaleLinear()
        .domain(domain.x)
        .range([frame.x, frame.x + frame.width]);
    const verticalScale = scaleLinear()
        .domain(domain.y)
        .range([frame.y + frame.height, frame.y]);
    const mappedData: any = {};
    dataPoints.forEach(({x, y, ...rest}) => {
            const {x: scaledX, y: scaledY} = {
                x: horizontalScale(x),
                y: verticalScale(y)
            };
            const { q, r } =  xyToHex({x: scaledX, y: scaledY}, size, frame);
            const hexIdx = `${q}_${r}`;
            if (mappedData[hexIdx]) {
                mappedData[hexIdx].count = mappedData[hexIdx].count + 1;
                mappedData[hexIdx].dataPoints.push({x, y, scaledX, scaledY, ...rest});
            } else {
                mappedData[hexIdx] = {
                    'count': 1,
                    'dataPoints': [{x, y, scaledX, scaledY, ...rest}]
                };
            }
        }
    );
    const [ minCount, maxCount ] = extent(Object.values(mappedData), (d: any) => d.count);
    const heatmapScale = scaleSequential(interpolateBlues).domain([minCount, maxCount]);

    const mappedData2 = Object.fromEntries(
        Object.entries(mappedData)
            .map(([k, {count, ...otherProps}]: any) => ([k, {count, fill: heatmapScale(count), ...otherProps}]))
    );
    return (
        <>
            <HexMap
                dataPointMap={mappedData2}
                domain={domain}
                frame={frame}
                size={size}
                {...otherProps}
            />
            { showScatter && (
                <Scatter
                    dataPoints={dataPoints}
                    frame={frame}
                    {...otherProps}
                />
            )}
        </>
    );
}

export default HexScatter;
