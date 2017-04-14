//千分位
function format (num) {
    return (num.toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

var listCmpChannelEnergyBaseOption = {
    title: {
        text: "组件发电详情",
        left: "center",
        textBaseline: "top",
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'normal',
            fontSize: 16,
            color: '#27bb77',
        },
        subtext: "",
        padding: [2,0,0,0]
    },
    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'normal',
        fontSize: 12,
        color: '#09787d'
    },
    legend: {
        data:[],
        show: false
    },
    toolbox: {
        show: false
    },
    grid: {
        left: '1.5%',
        right: '1.5%',
        bottom: '12%',
        top: '22%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            name:'',
            nameGap:1,
            boundaryGap : true,
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
            name: "kWh",
            nameGap: 5,
            splitLine:{
                show: true,
                interval: "auto",
                lineStyle: {
                    color: ['#455360']
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
    series : []
};
