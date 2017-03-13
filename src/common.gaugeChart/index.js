define(function(require, exports, module) {
    var $ = require("jquery");
    var polarApp = require("src/common.gaugeChart/polarChart");
        require("src/common.gaugeChart/index.css");
    
    var guageApp = {
        init: function(msg, obj1, obj2){
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
                            max: msg ? msg.capacityVal : 0,
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
                                    color: [[0.1, '#2f8cea'], [0.2, '#31b1e8'], [0.3, '#33c4e5'], [0.4, '#34e2e2'], [0.5, '#36e0cc'], [0.6, '#28ddad'], [0.7, '#2adb8f'], [0.8, '#2bd869'], [0.9, '#2bd64b'], [1, '#35d32d']],
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length: 17,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                    width: 1.5
                                }
                            },
                            splitLine: {           // 分隔线,长的那根
                                length: 17,         // 属性length控制线长
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
                            data: [{value: msg ? msg.power : 0, name: 'kW'}]
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
                            center: ['49%', '55%'],
                            radius: '98%',
                        }
                    }
                }
            };

            var wHeight = $(window).height();
            var myGaugeW = parseInt($(window).width()*0.18);  //0.37*0.5
            $("#myGauge").css("width",myGaugeW);

            if(wHeight>900){
                $("#myGauge,.pmParent").css("height","254px");
                $("#myPolar").css("height","216px");
                $("#refreshTime.refreshTimeIndex").css("top","147px");
            }else{
                $("#myGauge,.pmParent").css("height","218px");
                $("#myPolar").css("height","180px");
            }

            var myGauge = echarts.init(document.getElementById(obj1));
            myGauge.clear();
            myGauge.setOption(option, true);

            var percentage = msg? (msg.power/msg.capacityVal*100).toFixed(0) : 0;
            $(".percentage").html(percentage+"%");
            $("#refreshTime").html(msg? msg.refreshTime : "");
            
            guageApp.readerPolar(msg, obj2);

        },
        readerPolar: function(msg, obj){
            var percentage = msg ? (msg.power/msg.capacityVal*100).toFixed(0) : 0;
            $(".percentage").html(percentage+"%");
            $("#refreshTime").html(msg? msg.refreshTime : "");

            $("#myPolar").css("width", $("#myGauge").width());
            
            var startAngle = 10;
            if(percentage < 50){
                startAngle = 240-(10 + 240*percentage/100);
            }else if(percentage == 50){
                startAngle = 90
            }else{
                startAngle = 104-(240*percentage/100-90);
            }
            var myPolar = echarts.init(document.getElementById(obj));
            myPolar.setOption(polarApp.init(startAngle));
        }
    };

    module.exports = guageApp;

});