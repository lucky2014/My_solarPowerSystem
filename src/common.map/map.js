define(function(require, exports, module) {
    var mapApp = {
        init: function(data){
            var me = this;

            var option = {
                baseOption: {
                    backgroundColor: '#202b33',
                    title: {
                        show: false
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.name + '： <br /> ' + params.value[2] + "kW/"+params.data.power+"kWp";
                        },
                        backgroundColor:"#357a69",
                        borderColor: "#1fd1cb",
                        borderWidth: 1
                    },
                    grid: {
                        left:0,
                        top:0,
                        bottom:0,
                        right:0
                    },
                    layoutCenter: ["50%", "50%"],
                    layoutSize: 530,
                    legend: {
                        orient: 'vertical',
                        y: 'top',
                        x:'right',
                        data:['pm2.5'],
                        textStyle: {
                            color: '#fff'
                        },
                        show: false
                    },
                    visualMap: {
                        min: 0,
                        max: 400000,
                        calculable: true,
                        left: '10',
                        top: 20,
                        inRange: {
                            color: ['#2f8cea', '#28ddad', '#35d32d']
                        },
                        textStyle: {
                            color: '#fff'
                        },
                        show: false
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#2d4455',
                                borderColor: '#202b33'
                            },
                            emphasis: {
                                areaColor: '#2d4455'
                            }
                        }
                    },
                    series: [
                        {
                            name: 'pm2.5',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: data,
                            symbolSize: 10,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            }
                        }
                    ]
                },
                media: [{
                    query: {
                        minWidth: 1400,
                    },
                    option: {
                        layoutSize: 830,
                        layoutCenter: ["50%", "46%"],
                    }
                }]
            }

            return option;
        },
    };

    module.exports = mapApp;
    
});