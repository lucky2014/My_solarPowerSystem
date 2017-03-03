//千分位
function format (num) {
    return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

var defaultOption =  {
    title: {
        text: "实时组件发电详情",
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
        fontSize: 14,
        color: '#09787d'
    },
    tooltip : {
        trigger: 'axis',
        formatter : function (params) {
            return (params[0].data) ? "<div>组件名称："+params[0].name + '<br />发电量：' + format(params[0].value*1000) +"Wh<br />逆变器序列号："+ params[0].data.invId+"</div>" : "<div>组件名称：" + '<br />发电量：' +"0Wh<br />逆变器序列号：</div>";
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
            //nameGap: 5,
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
            name:'组件发电详情',
            type: 'bar',
            areaStyle: {normal: {}},
            data: [],
            markLine : {
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: ["#15c193"],
                        width: 1
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: "middle",
                        formatter: '{c}kWh',
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'normal',
                            fontSize: 18,
                            color: '#15c193',
                        },
                    }
                },
                symbol: ['none', 'none'],
                data : [
                    {
                        type : 'average', 
                        name: '平均值',
                    }
                ]
            }
        }
    ]
};