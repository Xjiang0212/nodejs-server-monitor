export const dialOptions = {
    grid: {
        top: '4%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    series: [
        {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 10,
            radius: '100%', // 调整仪表盘的半径
            center: ['50%', '50%'], // 调整仪表盘的位置
            itemStyle: {
                color: [
                        [0.2, 'yellow'],
                        [0.8, 'green'],
                        [1, 'green']
                    ],
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            progress: {
                show: true,
                roundCap: true,
                width: 10
            },
            pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '60%',
                width: 10,
                offsetCenter: [0, '5%'],
                itemStyle: {
                    color: 'auto'
                }
            },
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 10,
                    color: [
                        [0.2, '#67e0e3'],
                        [0.8, 'green'],
                        [1, 'red']
                    ]
                }
            },
            // 短标
            axisTick: {
                distance: 0,
                splitNumber: 2,
                lineStyle: {
                    width: 2,
                    color: '#999'
                },
                show: false
            },
            // 长标
            splitLine: {
                distance: 0,
                length: 12,
                lineStyle: {
                    width: 3,
                    color: '#999'
                }
            },
            // 序号
            axisLabel: {
                distance: 15,
                color: '#999',
                fontSize: 14
            },
            title: {
                show: false
            },
            detail: {
                width: '100%',
                lineHeight: 40,
                height: 30,
                borderRadius: 8,
                offsetCenter: [0, '35%'],
                valueAnimation: true,
                formatter: function (value) {
                    return '{value|' + value.toFixed(2) + '}{unit|%}';
                },
                color: 'auto',
                rich: {
                    value: {
                        fontSize: 25,
                        fontWeight: 'bolder',
                        color: '#fff'
                    },
                    unit: {
                        fontSize: 20,
                        color: '#aaa',
                        padding: [0, 0, 0, 10]
                    }
                }
            },
            data: [
                {
                    value: 90
                }
            ]
        }
    ]

}

export const lineOptions = {
    grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '20%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    legend: {
        data: ['上传', '下载'],
        textStyle: {
            color: '#fff'
        },
        // right:10,
        top: 0
    },
    title: {
        left: 'center'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '50%'],
        axisTick: {
            show: false
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 50,
            end: 100
        },
        {
            start: 50,
            end: 100
        }
    ],
    series: [
        {
            name: '上传',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
                color: '#0072ff'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: '#0072ff80'
                    },
                    {
                        offset: 1,
                        color: '#0072ff54'
                    }
                ])
            },
            data: []
        },
        {
            name: '下载',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
                color: '#00ffc4'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: '#00ffc480'
                    },
                    {
                        offset: 1,
                        color: '#00ffc454'
                    }
                ])
            },
            data: []
        }
    ]
};