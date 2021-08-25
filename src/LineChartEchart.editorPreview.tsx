import { Component, ReactNode, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { LineChartEchartPreviewProps } from "../typings/LineChartEchartProps";

declare function require(name: string): string;

export class preview extends Component<LineChartEchartPreviewProps> {
    render(): ReactNode {
        return <HelloWorldSample sampleText={this.props.ChartTitle} />;
    }
}

export function getPreviewCss(): string {
    return require("./ui/LineChartEchart.css");
}
