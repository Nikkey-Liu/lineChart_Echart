import React, { Component, ReactNode, createElement } from "react";
//import { HelloWorldSample } from "./components/HelloWorldSample";
import deepMerge from "deepmerge";


import EChartsReact from "echarts-for-react";
import { LineChartEchartContainerProps, MyObjectType } from "../typings/LineChartEchartProps";
import { ValueStatus } from "mendix";
import "./ui/LineChartEchart.css";

// const OarrayMerge = (_destinationArray: any[], sourceArray: any[]) => sourceArray;
export default class LineChartEchart extends Component<LineChartEchartContainerProps> {
    private echartsReact: any = undefined;
    private countSeries: number = 0;//计算多少个Series
    private datasetList: any[] = [];//存储json list 的dataset
    private seriesName: string[] = [];//存储seriesName
    private seriesList: any[] = [];//存储Series json list
    private legendType = "";
    private listFlag: boolean = false;
    private lineNameToAction=new Map();
    constructor(props: LineChartEchartContainerProps) {
        super(props);
        this.echartsReact = React.createRef();
   
        this.getOption = this.getOption.bind(this);
        this.getDataSetByDimension = this.getDataSetByDimension.bind(this);
        this.getSeriesItemOption = this.getSeriesItemOption.bind(this);
        this.onChartLegendselectchanged = this.onChartLegendselectchanged.bind(this);
        this.onChartClick = this.onChartClick.bind(this);
        // this.getSeriesAttributeData = this.getSeriesAttributeData.bind(this);

    }
    // getSeriesAttributeData(mylist: any[], item: MyObjectType, sortFlag: boolean, AtrributeX: boolean) {
    //     if (sortFlag) {
    //         if (item.seriesDataSource.status === ValueStatus.Available) {
    //             item.seriesDataSource.items?.forEach(Element => {
    //                 if (AtrributeX) {
    //                     const xValue = item.xValueAttribute.get(Element).value;
    //                     mylist.push(xValue);
    //                 }
    //                 else {
    //                     const yValue = item.yValueAttribute.get(Element).value?.toNumber();
    //                     mylist.push(yValue);
    //                 }
    //             });
    //         }
    //     }
    //     return mylist;
    // }

    componentDidUpdate() {
        //this.componentWillUnmount();
        this.clearData();
        let numberObject = 0;
        //数据加载状态更新
        this.props.myObject.forEach(item => {
            if (item.seriesDataSource.status === ValueStatus.Available) {
                numberObject++;
                if (numberObject === this.props.myObject.length) {
                    this.listFlag = true;
                }
            }

        });
        //当数据状态为available的时候读取 防止多次读取
        if (this.listFlag) {
            this.props.myObject.forEach(item => {
                this.seriesName.push(item.seriesName === '' || item.seriesName === null ? 'series' + this.countSeries : item.seriesName);
                
                if(item.onLineClick!= null && item.onLineClick.canExecute){
                    this.lineNameToAction.set(item.seriesName === '' || item.seriesName === null ? 'series' + this.countSeries : item.seriesName, item.onLineClick)
                }
         
                if (this.countSeries == 0) {
                    if (item.seriesDataSource.status === ValueStatus.Available) {
                        this.datasetList[this.countSeries] = this.getDataSetByDimension(item, false);
                        this.seriesList[this.countSeries] = this.getSeriesItemOption(this.countSeries, item);
                    }
                } else {
                    if (item.seriesDataSource.status === ValueStatus.Available) {
                        this.datasetList.push(this.getDataSetByDimension(item, false));
                        this.seriesList.push(this.getSeriesItemOption(this.countSeries, item));
                    }
                }
                this.countSeries = this.countSeries + 1;
            });
        }

        this.legendType = this.countSeries < 5 ? "plain" : "scroll";

        // console.log(this.valueListofMyObject);
        if (this.datasetList !== null && this.seriesList !== null && this.seriesName !== null && this.countSeries != 0) {
            // 判断是否展示加载动画
            if (this.props.showLoading) {
                setTimeout(() => {
                    // 设置加载时间
                    this.echartsReact.getEchartsInstance().hideLoading();
                }, this.props.loadingTime * 1000);
            }
            console.log(this.getOption());
            this.echartsReact.getEchartsInstance().setOption(this.getOption());
            
        }
        this.countSeries = 0;//归零Line计数

    }
    clearData(){
        while (this.seriesName.length) {
            this.seriesName.pop();
        }
        while (this.seriesList.length){
            this.seriesList.pop();
        }
        while (this.datasetList.length){
            this.datasetList.pop();
        }
    }
    componentWillUnmount() {
       this.clearData();
    }
    //第一种方式dimension的方式设置dataset来解决不同x 轴line 的问题
    getDataSetByDimension(item: MyObjectType, sortFlag: boolean) {
        if (sortFlag) {
            return Error;
        }
        let mylist: any[] = [];
        let xValueType: string = "";
        if (item.seriesDataSource.status === ValueStatus.Available) {
            item.seriesDataSource.items?.forEach(Element => {
                const yValue = item.yValueAttribute.get(Element).value?.toNumber();
                const xValue = item.xValueAttribute.get(Element).value;
                xValueType = typeof (item.xValueAttribute.get(Element).value);
                const newpoint: any[] = [xValue, yValue];
                mylist.push(newpoint);
            });
        }

        const newDatasetItem = {
            dimensions: [xValueType, item.seriesName === '' || item.seriesName === null ? 'series' + this.countSeries : item.seriesName],
            source: mylist
        }
        return newDatasetItem;
    }
    getSeriesItemOption(indexOfDataset: number, Item: MyObjectType) {
        //可以选择line 样式。
        const lineStylecolorOption = {
            lineStyle: {
                width: Item.LineWidth,
                color: Item.LineColor
            }
        };
        //使用默认color 下的line style 设置。
        const LineStyleOption = {
            lineStyle: {
                width: Item.LineWidth
            }
        };
        // Area 模式的 line json data 配置
        let SeriesItemAreaOption = {
            name: Item.seriesName === '' || Item.seriesName === null ? 'series' + this.countSeries : Item.seriesName,
            type: 'line',
            smooth: Item.SmoothLine,
            datasetIndex: indexOfDataset,
            areaStyle: Item.LineColor==''?{}:{color:Item.LineColor},
            emphasis: { focus: 'series' }
        };
        //普通line 的json series 配置
        let SeriesItemLineOption = {
            name: Item.seriesName === '' || Item.seriesName === null ? 'series' + this.countSeries : Item.seriesName,
            type: 'line',
            smooth: Item.SmoothLine,
            datasetIndex: indexOfDataset,
            emphasis: { focus: 'series' }
        };
        //叠堆模式的json
        let stackOption={
           stack: '总量'
        }
        if (Item.LineColor != '') {//判断是否输入了LineCorlor
            SeriesItemLineOption= deepMerge(SeriesItemLineOption,lineStylecolorOption);
            SeriesItemAreaOption=deepMerge(SeriesItemAreaOption,lineStylecolorOption)
        }else{
            SeriesItemLineOption= deepMerge(SeriesItemLineOption,LineStyleOption);
            SeriesItemAreaOption=deepMerge(SeriesItemAreaOption,LineStyleOption);
        }
        if(Item.stackline){//判断是否为叠堆模式
            SeriesItemLineOption= deepMerge(SeriesItemLineOption,stackOption);
            SeriesItemAreaOption=deepMerge(SeriesItemAreaOption,stackOption);
        }
        if (Item.Linemode == 'lines') {
        return deepMerge.all(
            [
                SeriesItemLineOption,
                Item.LineJsondata !== null && this.props.Jsondata !== ""
                    ? JSON.parse(  Item.LineJsondata)
                    : {}
            ],
            { arrayMerge }
        );
        }
        return deepMerge.all(
            [
                SeriesItemAreaOption,
                Item.LineJsondata !== null && this.props.Jsondata !== ""
                    ? JSON.parse(  Item.LineJsondata)
                    : {}
            ],
            { arrayMerge }
        );
    
    }
    //getOption 获得最终图形配置json数据；
    getOption() {
        let option = {};
        const datazoomOption = {
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 1,
                    end: 35,
                    bottom: '2%'
                },

                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 1,
                    end: 35
                }

            ]
        }
        const basicOption = {
            title: {
                text: this.props.ChartTitle,
                subtext: this.props.mysubtitle
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                type: this.legendType,
                orient: this.props.ShowLegendWay,
                left: "left",
                show: this.props.ShowLegend,
                top: "8%"
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },

                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }
        };
        const datasetOption1 = {
            dataset: this.datasetList
        }
        const seriesOption = {
            series: this.seriesList
        }
        const dataOption = {
            // dataset: {
            //     source: [
            //         ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            //         ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            //         ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            //         ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            //         ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
            //     ]
            // },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    name: this.props.XLabel,
                    nameLocation: 'center'//后期开发可作为配置项
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    gridIndex: 0,
                    name: this.props.YLabel,
                    nameLocation: 'center'//后期开发可作为配置项
                }
            ]
            // series: [
            //     { type: 'line', smooth: true, seriesLayoutBy: 'row', areaStyle: {}, emphasis: { focus: 'series' } },
            //     { type: 'line', smooth: true, seriesLayoutBy: 'row', areaStyle: {}, emphasis: { focus: 'series' } },
            //     { type: 'line', smooth: true, seriesLayoutBy: 'row', areaStyle: {}, emphasis: { focus: 'series' } },
            //     { type: 'line', smooth: true, seriesLayoutBy: 'row', areaStyle: {}, emphasis: { focus: 'series' } }
            // ]
        };
        if (this.props.showDatazoom) {

            option = deepMerge.all([dataOption, basicOption, datasetOption1, seriesOption, datazoomOption]);
        } else {
            option = deepMerge.all([dataOption, basicOption, datasetOption1, seriesOption]);
        }


        // option = deepMerge.all([dataOption, basicOption]);
        return deepMerge.all(
            [
                option,
                this.props.Jsondata !== null && this.props.Jsondata !== ""
                    ? JSON.parse(this.props.Jsondata)
                    : {}
            ],
            { arrayMerge }
        );
    }
    renderSizeOfDiv() {
        const mysize = {
            // 声明一个div size对象
            width: "0",
            height: "0",
            widthUnit: "",
            heightUnit: "",
            paddingBottom: "0"
        };
        mysize.width = this.props.widthUnit === "percentage" ? `${this.props.width}%` : `${this.props.width}px`;
        if (this.props.heightUnit === "percentageOfWidth") {
            mysize.paddingBottom =
                this.props.widthUnit === "percentage" ? `${this.props.height}%` : `${this.props.width / 2}px`;
        } else if (this.props.heightUnit === "pixels") {
            mysize.height = `${this.props.height}px`;
        } else if (this.props.heightUnit === "percentageOfParent") {
            mysize.height = `${this.props.height}%`;
        }
        const myDivStyle = {
            height: mysize.height,
            width: mysize.width
        };
        if (mysize.paddingBottom !== "0") {
            const myDivStylep = {
                width: mysize.width,
                paddingBottom: mysize.paddingBottom
            };
            console.log(myDivStylep);
            return myDivStylep;
        }
        console.log(myDivStyle);
        return myDivStyle;
    }
    onChartClick(e:any) {
       
        console.log("echarts on click"+e.seriesName);
        if(this.lineNameToAction.has(e.seriesName)){
            
            
            this.lineNameToAction.get(e.seriesName).execute();
            //this.componentWillUnmount();
            console.log("echarts on click execute inform ：如果想点击显示的数据请在外部配置dataview来显示，目前widget执行微流不支持传递参数");
        }
 
      
    }
    onChartLegendselectchanged() {
        
        console.log("legendSlectchanged");
        if (this.props.onChartLegendselectchanged != null && this.props.onChartLegendselectchanged.canExecute) {
       
            this.props.onChartLegendselectchanged.execute();
           // this.componentWillUnmount();
        }
    }
    render(): ReactNode {
        return <EChartsReact
            ref={e => {
                this.echartsReact = e;
            }}
           
            option={this.getOption()}
            showLoading={this.props.showLoading} // 获得是否显示loading动画
            style={this.renderSizeOfDiv()}
            theme={this.props.ChartTheme === "default" ? "" : this.props.ChartTheme}
            onEvents={{
                'click': this.onChartClick.bind(this),
                'legendselectchanged': this.onChartLegendselectchanged
            }}
        />;
    }
}
// deep meger操作工具函数
const emptyTarget = (value: any) => (Array.isArray(value) ? [] : {});

const clone = (value: any, options: any) => deepMerge(emptyTarget(value), value, options);
const arrayMerge = (target: any[], source: any[], options: any) => {
    const destination = target.slice();

    source.forEach((e, i) => {
        if (typeof destination[i] === "undefined") {
            const cloneRequested = options.clone !== false;
            const shouldClone = cloneRequested && options.isMergeableObject(e);
            destination[i] = shouldClone ? clone(e, options) : e;
        } else if (options.isMergeableObject(e)) {
            destination[i] = deepMerge(target[i], e, options);
        } else if (target.indexOf(e) === -1) {
            destination.push(e);
        }
    });
    return destination;
};
