var defaultOption = {
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
};