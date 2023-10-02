import React from 'react';
import Chart from '../components/Chart/chart.server';
import PieDataSeries from '../dataseries/Pie';
import LabelledPieSlice from '../dataseries/Pie/LabelledPieSlice';
import PieSlice from '../dataseries/Pie/PieSlice';
import withPadding from '../dataseries/modifiers/withPadding';

const PADDING_CONSTANT = 75;

const PaddedPieSeries = withPadding(PieDataSeries);

export default function PieChart({
    className='piechart',
    dataPoints,
    height,
    width,
    showLabels = true,
    ...otherProps
}) {
    return (
        <Chart
            className={className}
            height={height}
            width={width}
            {...otherProps}
        >
            <PaddedPieSeries
                backgroundCircleStyle={{fill: 'white'}}
                DataPointComponent={showLabels ? LabelledPieSlice : PieSlice}
                dataPoints={dataPoints}
                frame={{
                    x: 0,
                    y: 0,
                    width,
                    height,
                }}
                innerRadiusPercent={0.75}
                padding={{
                    top: showLabels ? PADDING_CONSTANT : 0,
                    right: showLabels ? PADDING_CONSTANT : 0,
                    bottom: showLabels ? PADDING_CONSTANT : 0,
                    left: showLabels ? PADDING_CONSTANT : 0,
                }}
            />
        </Chart>
    );
}