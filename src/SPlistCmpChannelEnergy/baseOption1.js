//千分位
function format (num) {
    return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

var listCmpChannelEnergyBaseOption = {
    title: {
        text: "组件发电详情",
        left: "center",
        textBaseline: "top",
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'normal',
            fontSize: 18,
            color: '#27bb77',
        },
        subtext: "",
        padding: [4,0,0,0]
    },
    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'normal',
        fontSize: 12,
        color: '#09787d'
    },
    /*dataZoom: [
        {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty',
            bottom: 0,
            start: 0,
            end: 100,
            handleSize: 24,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            showDataShadow: false,
            textStyle: {
                color: "#09787d"
            },
            backgroundColor: ['#09787d']
        }
    ],*/
    tooltip : {
        trigger: 'item',
        formatter : function (params) {
            return (params.value) ? "<div>日期："+params.name + '<br />'+params.seriesName+'：' + format(params.value*1000) +"Wh" : "<div>日期："+params.name + '<br />'+params.seriesName+'：0Wh';
        },
        backgroundColor:"#357a69",
        borderColor: "#1fd1cb",
        borderWidth: 1,
        enterable: true
    },
    legend: {
        data:[],
        show: false
    },
    color: ["#ee7474","#7a9ee9","#f3a659","#3fd69f"],
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
