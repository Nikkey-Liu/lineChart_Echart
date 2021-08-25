/**
 * This file was generated from LineChartEchart.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, ListValue, ListAttributeValue } from "mendix";
import { Big } from "big.js";

export type LinemodeEnum = "lines" | "arealine";

export interface MyObjectType {
    seriesName: string;
    seriesDataSource: ListValue;
    xValueAttribute: ListAttributeValue<string | Big | Date>;
    yValueAttribute: ListAttributeValue<Big>;
    Linemode: LinemodeEnum;
    SmoothLine: boolean;
    stackline: boolean;
    LineColor: string;
    LineWidth: number;
    onLineClick?: ActionValue;
    LineJsondata: string;
}

export type ChartThemeEnum = "default" | "light" | "dark";

export type ShowLegendWayEnum = "horizontal" | "vertical";

export type WidthUnitEnum = "percentage" | "pixels";

export type HeightUnitEnum = "percentageOfWidth" | "pixels" | "percentageOfParent";

export interface MyObjectPreviewType {
    seriesName: string;
    seriesDataSource: {} | { type: string } | null;
    xValueAttribute: string;
    yValueAttribute: string;
    Linemode: LinemodeEnum;
    SmoothLine: boolean;
    stackline: boolean;
    LineColor: string;
    LineWidth: number | null;
    onLineClick: {} | null;
    LineJsondata: string;
}

export interface LineChartEchartContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    ChartTitle: string;
    mysubtitle: string;
    myObject: MyObjectType[];
    ChartTheme: ChartThemeEnum;
    XLabel: string;
    YLabel: string;
    ShowLegend: boolean;
    ShowLegendWay: ShowLegendWayEnum;
    showDatazoom: boolean;
    showLoading: boolean;
    loadingTime: number;
    Jsondata: string;
    onChartLegendselectchanged?: ActionValue;
    widthUnit: WidthUnitEnum;
    width: number;
    heightUnit: HeightUnitEnum;
    height: number;
}

export interface LineChartEchartPreviewProps {
    class: string;
    style: string;
    ChartTitle: string;
    mysubtitle: string;
    myObject: MyObjectPreviewType[];
    ChartTheme: ChartThemeEnum;
    XLabel: string;
    YLabel: string;
    ShowLegend: boolean;
    ShowLegendWay: ShowLegendWayEnum;
    showDatazoom: boolean;
    showLoading: boolean;
    loadingTime: number | null;
    Jsondata: string;
    onChartLegendselectchanged: {} | null;
    widthUnit: WidthUnitEnum;
    width: number | null;
    heightUnit: HeightUnitEnum;
    height: number | null;
}
