var timer2 = null;
//千分位
function format (num) {
    return (num.toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

var chartsSum = {
    myDate: new Date(),
    formatterDate: function(t){
        return (t<10) ? "0"+t : t;
    },
    getFullYear: function(){
        var me = this;
        return me.myDate.getFullYear();
    },
    getMonth: function(){
        var me = this;
        return me.getFullYear() + "-" + me.formatterDate((me.myDate.getMonth())+1);
    },
    getDate: function(){
        var me = this;
        return me.getMonth() + "-" + me.formatterDate(me.myDate.getDate());
    },
    getLineParams: function(stationId, dateType, date){
        var me = this;
        return {
            stationId: stationId,
            chartType: dateType || 1,
            beginDate: date || me.getDate()
        }
    },
    dateType1Fn: function(params, myline, titleType){
        $(".realTimeEnpty").hide();
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            var capacity = msg.capacity;
            if(msg.chartResults && msg.chartResults.length>0){
                var time = [];
                var data = [];
                $.each(msg.chartResults, function(i,v){
                    time.push(v.reportDate.split(" ")[1].slice(0,5));
                    data.push(v.power);
                });
                var option = {
                    title: {
                        text: titleType,
                        left: "center",
                        textBaseline: "top",
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'normal',
                            fontSize: 16,
                            color: '#27bb77',
                        },
                        subtext: "",
                        padding: [6,0,0,0]
                    },
                    visualMap: {
                        show: false,
                        type: 'continuous',
                        min: 0,
                        max: capacity,
                        text:['High','Low'],
                        realtime: false,
                        calculable : true,
                        color: ['#35d32d','#2bd64b','#2bd869','#2adb8f','#28ddad', '#36e0cc','#34e2e2','#33c4e5','#31b1e8', '#2f8cea']
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter : function (params) {

                            return (params[0].value) ? params[0].data.date + '<br />' +params[0].seriesName + ' : ' + ((params[0].value*1000).toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') +"W" : params[0].data.date+ '<br />'+ params[0].seriesName +" : 0W";
                        },
                        backgroundColor:"#357a69",
                        borderColor: "#1fd1cb",
                        borderWidth: 1,
                        enterable: true
                    },
                    xAxis : {
                        data : time,
                        axisLine: {
                            lineStyle: {
                                color: ['#09787d']
                            }
                        },
                    },
                    yAxis : {
                        name: "kW",
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
                            name:'发电功率',
                            type: 'line',
                            areaStyle: {normal: {}},
                            data: data
                        },
                    ]
                };  

                option = $.extend({},defaultOption1,option); 
                myline.setOption(option);
            }else{
                var mylineNull = echarts.init(document.getElementById('myline'));
                mylineNull.setOption(defaultOption1);
                $(".realTimeEnpty").show();
            } 
        });
    },
    dateTypeChange: function(dateType, stationId, date, titleType){ 
        //titleType==1,表示是从tab选择来的
        var me = this;
        
        if(dateType == "1"){//实时
            $("#datePickerParent").show();
            $("#datePicker1").val(me.getDate()).show().siblings("input").hide();

            var date = date || me.getDate();
            var params = me.getLineParams(stationId, dateType, date);

            titleType = "功率" ;
            if(titleType && titleType == 1){
                $("#datePicker1").val(me.getDate()).show().siblings("input").hide();
            }else{
                $("#datePicker1").val(date);
            }

            //请求渲染 
            var myline = echarts.init(document.getElementById('myline'));
            me.dateType1Fn(params, myline, titleType);

            timer2 = setInterval(function(){//实时发电功率计时器
                myline.setOption(defaultOption);
                me.dateType1Fn(params, myline, titleType);
            }, 60000);

        }else if(dateType == "2"){//选择日
            clearInterval(timer2);
            timer2 = null;
            $("#datePickerParent").show();

            var date = date || me.getDate();
            var params = me.getLineParams(stationId, dateType, date);

            titleType = "日发电量" ;
            if(titleType && titleType == 1){
                $("#datePicker2").val(me.getDate()).show().siblings("input").hide();
            }else{
                $("#datePicker2").val(date);
            }
            
            me.renderBar(dateType, params, titleType);
        }else if(dateType == "3"){//选择月
            clearInterval(timer2);
            timer2 = null;
            $("#datePickerParent").show();

            var date = date || me.getMonth()+"-01";
            var params = me.getLineParams(stationId, dateType, date);

            titleType = "月发电量" ;
            if(titleType && titleType == 1){
                $("#datePicker3").val(me.getMonth()).show().siblings("input").hide();
            }else{
                $("#datePicker3").val(date.slice(0,7));
            }

            me.renderBar(dateType, params, titleType);
        }else if(dateType == "4"){//选择年
            clearInterval(timer2);
            timer2 = null;
            $("#datePickerParent").show();

            var date = date || me.getFullYear()+"-01-01";
            var params = me.getLineParams(stationId, dateType, date);

            titleType = "年发电量" ;
            if(titleType && titleType == 1){
                $("#datePicker4").val(me.getFullYear()).show().siblings("input").hide();
            }else{
                $("#datePicker4").val(date.slice(0,4));
            }
            me.renderBar(dateType, params, titleType);
        }
    },
    formatterData: function(n){
        var msNum = {};
        if((parseInt(n)+"").length>5){
            msNum.num = Number(n/1000).toFixed(2);
            msNum.unit = "MWh";
        }else{
            msNum.num = n.toFixed(2);
            msNum.unit = "kWh";
        }

        return msNum;
    },
    renderBar: function(dateType, params, titleType){ //出来实时的图表，其他年月日总的渲染类型都一样
        var me = this;
        var myline = echarts.init(document.getElementById('myline'));
        myline.setOption(defaultOption1);
        $(".realTimeEnpty").hide();
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            if(msg.chartResults && msg.chartResults.length>0){
                var time = [];
                var data = [];
                var all = 0;
                var unit = "kWh";
                $.each(msg.chartResults, function(i,v){
                    if(dateType == 2){
                        time.push(v.reportDate.slice(11,16));
                        data.push({value:v.energy/1000,date: v.reportDate.slice(0,16)});
                    }else if(dateType == 3){
                        data.push({value:v.energy/1000,date: v.reportDate.slice(0,10)});
                        time.push(v.reportDate.slice(5,10));
                    }else if(dateType == 4){
                        data.push({value:v.energy/1000,date: v.reportDate.slice(0,7)});
                        time.push(v.reportDate.slice(0,7));
                    }else{
                        data.push({value:v.energy/1000,date: v.reportDate.slice(0,4)});
                        time.push(v.reportDate.slice(0,4));
                    }

                    all += (v.energy)/1000;
                });

                all = me.formatterData(all).num + me.formatterData(all).unit;

                var option = {
                    title: {
                        text: titleType,
                        left: "center",
                        textBaseline: "top",
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'normal',
                            fontSize: 16,
                            color: '#27bb77',
                        },
                        subtext: all,
                        padding: [6,0,0,0]
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter : function (params) {
                            return (params[0].value) ? params[0].data.date + '<br />' +params[0].seriesName + ' : ' + ((params[0].value*1000).toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') +"Wh" : params[0].data.date +'<br />'+ params[0].seriesName +" : 0Wh";
                        },
                        backgroundColor:"#357a69",
                        borderColor: "#1fd1cb",
                        borderWidth: 1,
                        enterable: true
                    },
                    xAxis : [
                        {
                            data : time,
                            axisLine: {
                                lineStyle: {
                                    color: ['#09787d']
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            name: unit,
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
                            },
                            axisLabel: {
                                formatter: function(v){
                                    if(v>10000){
                                        return (v/1000)+"x10³";
                                    }else{
                                        return v;
                                    }
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:'发电量',
                            type: 'bar',
                            data: data
                        },
                    ]
                }; 

                option = $.extend({}, defaultOption1, option);
                myline.setOption(option);
            }else{
                $(".realTimeEnpty").show();
            }
        });
    }
};