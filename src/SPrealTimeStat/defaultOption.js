define(function(require, exports, module) {
    
    //千分位
    function format (num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
    
    return {
        title: {
            text: "",
            left: "center",
            textBaseline: "top",
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'normal',
                fontSize: 14,
                color: '#27bb77',
            },
            subtext: "",
            padding: [6,0,0,0]
        },
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'normal',
            fontSize: 12,
            color: '#09787d'
        },
        tooltip : {
            trigger: 'axis',
            formatter : function (params) {
                return (params[0].value) ? params[0].seriesName + ' : ' + format(params[0].value*1000) +"Wh" : params[0].seriesName +" : 0Wh";
            },
            backgroundColor:"#357a69",
            borderColor: "#1fd1cb",
            borderWidth: 1,
            enterable: true
        },
        legend: {
            data:['邮件营销'],
            show: false
        },
        color: ["#5bb39e"],
        toolbox: {
            show: false
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '5%',
            top: '22%',
            containLabel: true
        },
        xAxis : {
            type : 'category',
            name:'',
            //nameGap:1,
            //boundaryGap : true,
            axisLine: {
                lineStyle: {
                    color: ['#09787d']
                }
            },
            data : []
        },
        yAxis : {
            type : 'value',
            name: "Wh",
            //nameGap: 5,
            splitLine:{
                show: true,
                interval: "auto",
                lineStyle: {
                    color: ['#313b42']
                }
            },
            axisLine: {
                lineStyle: {
                    color: ['#09787d']
                }
            }
        },
        series : [
            {
                name:'发电量',
                type: 'line',
                areaStyle: {normal: {}},
                data: []
            },
        ]
    }
});