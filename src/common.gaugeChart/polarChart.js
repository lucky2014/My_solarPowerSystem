define(function(require, exports, module) {
    var echarts = require("echarts");
    var polarApp = {
        init: function(startAngle){
            return {
                title: {
                    text: '极坐标双数值轴',
                    show: false
                },
                legend: {
                    data: ['line']
                },
                polar: {
                    center: ['50%', '58%']
                },
                color: ["#23f8fd","#f60"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    show: false
                },
                angleAxis: {
                    type: 'value',
                    startAngle: startAngle || 15,
                    show:false
                },
                radiusAxis: {
                    min: 0,
                    show:false
                },
                series: [{
                    coordinateSystem: 'polar',
                    name: 'graph',
                    type: 'effectScatter',
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            shadowBlur: 12,
                            shadowColor: 'rgba(69, 218, 224, 1)',
                            shadowOffsetY: 0,
                            color: new echarts.graphic.RadialGradient(0.1, 0.8, 1, [{
                                offset: 0,
                                color: '#45dfe4'
                            }, {
                                offset: 1,
                                color: '#23f8fd'
                            }])
                        }
                    },
                    rippleEffect: {
                        brushType: "fill",
                        scale: "2",
                        period: 1000
                    },
                    data: [[10,1]]
                }]
            }
        }
    };

    module.exports = polarApp;

});