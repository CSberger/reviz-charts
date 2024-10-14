import React from "react";
import { scaleBand } from "d3-scale";
import { median, mean, quantile } from "d3-array"
import range from "lodash.range";

import Group from "../../components/Group";
import Rect from "../../components/Rect";
import { ScaleType, makeScale } from "../utils/makeScale";
import { AxisDefinition, DataSeriesFrame, Frame, OrientationEnum } from "../types";
import VerticalBox from "./VerticalBox";
import HorizontalBox from "./HorizontalBox";

interface IBarDataPoint {
    median: number;
    q1: number;
    q3: number;
    upperFence: number;
    lowerFence: number;
    mean: number;
    maxValue: number;
    minValue: number;
    outliers: number[];
    values: number[];
}

interface IBoxDataSeries {
    dataPoints: IBarDataPoint[];
    axisDefinitions: {
        x: AxisDefinition,
        y: AxisDefinition
    };
    frame: DataSeriesFrame;
    innerPadding: number;
    outerPadding: number;
    orientation: "vertical" | "horizontal";
    fillStats?: boolean;
}


function BoxDataSeries({
  dataPoints,
  axisDefinitions,
  frame,
  innerPadding,
  outerPadding,
  orientation,
  fillStats = true
}: IBoxDataSeries) {
    let BoxValueScale: any = null;
    let BoxPositionScale = scaleBand();
    BoxPositionScale
        .domain(range(0, dataPoints.length).map((i) => i.toString()))
        .paddingInner(innerPadding)
        .paddingOuter(outerPadding);
    let positionRange: [number, number] = [0, 0];
    let valueScaleRange: [number, number] = [0, 0];
    switch (orientation) {
        case OrientationEnum.vertical:
            BoxValueScale = makeScale(axisDefinitions.y.scale as ScaleType, axisDefinitions.y.domain);
            positionRange = [frame.x, frame.x + frame.width];
            valueScaleRange = [0, frame.height];
            break;
        case OrientationEnum.horizontal:
            BoxValueScale = makeScale(axisDefinitions.x.scale as ScaleType, axisDefinitions.x.domain);
            positionRange = [frame.y + frame.height, frame.y];
            valueScaleRange = [frame.x, frame.x + frame.width];
            break;
    }
    BoxPositionScale.range(positionRange);
    BoxValueScale.range(valueScaleRange);
    const pscale = scaleBand(range(dataPoints.length), positionRange).round(true);
    pscale.paddingInner(innerPadding);
    pscale.paddingOuter(outerPadding);
    const boxVerticalPositionScale = BoxValueScale.copy().range([frame.y + frame.height, frame.y]);
    const boxHorizontalPositionScale = BoxValueScale.copy().range([frame.x, frame.x + frame.width]);
    console.warn(`BoxValueScale.domain(): ${BoxValueScale.domain()} BoxValueScale.range(): ${BoxValueScale.range()}`)
    return (
        <Group>
            <Rect
                className={'bg-boxds'}
                width={frame.width}
                height={frame.height}
                x={frame.x}
                y={frame.y}
                fill="none"
            />
            {dataPoints.map(({ median : medianVal, q1, q3, upperFence, lowerFence, mean: meanVal, maxValue, minValue, outliers, values = [], ...otherProps}, i) => {
                const x = orientation === 'vertical' ? pscale(i) : frame.x;
                const width = orientation === 'vertical' ? pscale.bandwidth() : BoxValueScale(q3 - q1);
                //console.assert(value == 4, `orientation == ${orientation} value is 5, domain is ${BoxValueScale.domain()}, range is ${BoxValueScale.range()}}`);
                const height = orientation === 'vertical' ? BoxValueScale(q3 - q1) : pscale.bandwidth();

                const y = orientation === 'vertical' ? frame.height + frame.y : pscale(i);

                const Box = orientation === 'vertical' ? VerticalBox : HorizontalBox;
                
                medianVal = fillStats ? median(values) as number : medianVal ;
                q1 = fillStats ? quantile(values, 0.25) as number : q1;
                q3 = fillStats ? quantile(values, 0.75) as number : q3;
                const iqr = q3 - q1;
                upperFence = fillStats ? q3 + 1.5 * iqr : upperFence;
                lowerFence = fillStats ? q1 - 1.5 * iqr : lowerFence;
                meanVal = fillStats ? mean(values) as number : meanVal;
                maxValue = fillStats ? Math.max(...values.filter(v => v < upperFence)) : maxValue;
                minValue = fillStats ? Math.min(...values.filter(v => v > lowerFence)) : minValue;
                outliers = fillStats ? values.filter(v => v > upperFence || v < lowerFence) : outliers;
                const valuesInRange = values.filter(v => v < upperFence && v > lowerFence);
                const outlierPositions = orientation === 'vertical' ? outliers.map((outlier) => boxVerticalPositionScale(outlier)): outliers.map((outlier) => boxHorizontalPositionScale(outlier));
                console.assert(outliers.length > 0);
                const valuesPositions = fillStats ? valuesInRange.map((val) => boxVerticalPositionScale(val)) : values.map((val) => BoxValueScale(val));
                console.warn(`i: ${i}: minValue: ${minValue}, minValuePosition: ${BoxValueScale(minValue)} `)
                console.warn(`i: ${i}: median: ${medianVal}`)
                const [
                    medianPosition,
                    q1Position,
                    q3Position,
                    upperFencePosition,
                    lowerFencePosition,
                    meanPosition,
                    maxValuePosition,
                    minValuePosition,
 
                ] = [medianVal, q1, q3, upperFence, lowerFence, meanVal, maxValue, minValue].map((value) => {
                    return orientation == "vertical" ? boxVerticalPositionScale(value): BoxValueScale(value);
                });
                return (
                    <Box
                        dataPointProps={{
                          medianVal,
                          q1,
                          q3,
                          upperFence,
                          lowerFence,
                          meanVal,
                          maxValue,
                          minValue,
                          values,
                          outliers
                        }}
                        key={i}
                        width={orientation === 'vertical' ? pscale.bandwidth() : frame.width}
                        height={orientation === 'vertical' ? height : pscale.bandwidth()}
                        x={x ?? 0}
                        y={y ?? 0}
                        medianPosition={medianPosition}
                        q1Position={q1Position}
                        q3Position={q3Position}
                        upperFencePosition={upperFencePosition}
                        lowerFencePosition={lowerFencePosition}
                        meanPosition={meanPosition}
                        maxValuePosition={maxValuePosition}
                        minValuePosition={minValuePosition}
                        outlierPositions={outlierPositions}
                        valuesPositions={valuesPositions}
                    />
                );
            })}
        </Group>
    );
}

export default BoxDataSeries;
