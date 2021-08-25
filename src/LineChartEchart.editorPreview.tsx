import { Component, ReactNode } from "react";
// import { HelloWorldSample } from "./components/HelloWorldSample";
import { LineChartEchartPreviewProps } from "../typings/LineChartEchartProps";
// import EChartsReact from "echarts-for-react";
declare function require(name: string): string;

export class preview extends Component<LineChartEchartPreviewProps> {
    
  
    render(): ReactNode {
  
       
        return '';
    }
}

export function getPreviewCss(): string {
    return require("./ui/LineChartEchart.css");
}
