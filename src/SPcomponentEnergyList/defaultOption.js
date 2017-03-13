define(function(require, exports, module) {
    
    return {
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'normal',
            fontSize: 14,
            color: '#09787d'
        },
        legend: {
            data:['发电量'],
            show: false
        },
        color: ["#1ea1b5"],
        toolbox: {
            show: false
        },
        grid: {
            left: '1.5%',
            right: '1.5%',
            bottom: '10%',
            top: '22%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                name:'',
                nameGap:1,
                boundaryGap : false,
                axisLine: {
                    lineStyle: {
                        color: ['#09787d']
                    }
                },
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value',
                name: "Wh",
                splitLine:{
                    show: true,
                    interval: "auto",
                    lineStyle: {
                        color: ['#313b42']
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: ['#09787d']
                    }
                }
            }
        ],
        series : [
            {
                name:'发电量',
                type: 'bar',
                areaStyle: {normal: {}},
                data: []
            }
        ]
    }
});