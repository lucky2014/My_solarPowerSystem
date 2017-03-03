define(function(require, exports, module) {
    var guageApp = {
        init: function(data, max){
            var option = {
                baseOption: {
                    tooltip : {
                        formatter: "{a} <br/>{b} : {c}%",
                        show: false
                    },
                    toolbox: {
                        feature: {
                            restore: {},
                            saveAsImage: {}
                        },
                        show: false
                    },
                    series: [
                        {
                            name: '业务指标',
                            type: 'gauge',
                            radius: '89%',
                            min:0,
                            max: max,
                            splitNumber: 14,
                            center: ['50%', '50%'],
                            //startAngle: 0,
                            //endAngle: 200,
                            axisLabel: {
                                show: false
                            },
                            title : {
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'normal',
                                    fontSize: 22,
                                    color: '#8698ae',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 0
                                }
                            },
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    width: 0,
                                    color: [[0.1, '#2f8cea'], [0.2, '#2e9bc9'], [0.3, '#32bde6'], [0.4, '#34dede'], [0.5, '#35e0c8'], [0.6, '#27c999'], [0.7, '#28bf78'], [0.8, '#28b069'], [0.9, '#2bd75a'], [1, '#2bd649']],
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length: 20,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                    width: 1.5
                                }
                            },
                            splitLine: {           // 分隔线,长的那根
                                length: 18,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto',
                                    width: 1.5
                                }
                            },
                            pointer: {
                                width: 0,
                            },
                            detail: {
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'normal',
                                    formatter:'{value}',
                                    color: "#23f8fd",
                                    fontSize: 32,
                                    //fontStyle: "oblique"
                                },
                                offsetCenter: [0, "-10%"]
                            },
                            data: data
                        }
                    ]
                },
                media: {
                    query: {
                        minHeight: 900
                    },
                    option: {
                        series: {
                            splitLine: {           // 分隔线,长的那根
                                length: 20, 
                            },
                            center: ['49%', '56%'],
                            radius: '100%',
                        }
                    }
                }
            };

            return option;
        }

    };

    module.exports = guageApp;

});