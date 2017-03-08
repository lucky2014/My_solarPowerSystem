var timer2 = null;

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
        var fSize = (titleType.length>2) ? 13 : 14;
        $(".realTimeEnpty").hide();
        //myline.setOption(defaultOption1);
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            if(msg.length>0){
                var time = [];
                var data = [];
                $.each(msg, function(i,v){
                    time.push(v.reportDate.split(" ")[1].slice(0,5));
                    data.push(v.power/10);
                });
                var option = {
                    title: {
                        text: "    "+titleType+"发电功率",
                        left: "center",
                        textBaseline: "top",
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'normal',
                            fontSize: fSize,
                            color: '#27bb77',
                        },
                        subtext: "",
                        padding: [6,0,0,0]
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
                        name: "Wh",
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
                            data: data
                        },
                    ]
                };  

                option = $.extend({},defaultOption1,option); 
                myline.setOption(option);
            }else{
                myline.setOption(defaultOption1);
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

            var dateRet = date.split("-");

            if(titleType && titleType == 1){
                titleType = "实时" ;
                $("#datePicker1").val(me.getDate()).show().siblings("input").hide();
            }else{
                titleType =dateRet[0]+"年"+dateRet[1]+"月"+dateRet[2]+"日";
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

            var dateRet = date.split("-");

            if(titleType && titleType == 1){
                titleType = "今日" ;
                $("#datePicker2").val(me.getDate()).show().siblings("input").hide();
            }else{
                titleType =dateRet[0]+"年"+dateRet[1]+"月"+dateRet[2]+"日";
                $("#datePicker2").val(date);
            }
            
            me.renderBar(dateType, params, titleType);
        }else if(dateType == "3"){//选择月
            clearInterval(timer2);
            timer2 = null;
            $("#datePickerParent").show();

            var date = date || me.getMonth()+"-01";
            var params = me.getLineParams(stationId, dateType, date);

            var dateRet = date.split("-");

            if(titleType && titleType == 1){
                titleType = "本月" ;
                $("#datePicker3").val(me.getMonth()).show().siblings("input").hide();
            }else{
                titleType = dateRet[0]+"年"+dateRet[1]+"月";
                $("#datePicker3").val(date.slice(0,7));
            }

            me.renderBar(dateType, params, titleType);
        }else if(dateType == "4"){//选择年
            clearInterval(timer2);
            timer2 = null;
            $("#datePickerParent").show();

            var date = date || me.getFullYear()+"-01-01";
            var params = me.getLineParams(stationId, dateType, date);

            var dateRet = date.split("-");
            if(titleType && titleType == 1){
                titleType = "本年" ;
                $("#datePicker4").val(me.getFullYear()).show().siblings("input").hide();
            }else{
                titleType = dateRet[0]+"年";
                $("#datePicker4").val(date.slice(0,4));
            }
            me.renderBar(dateType, params, titleType);
        }else{ //选择总
            clearInterval(timer2);
            timer2 = null;
            $("#datePickerParent").hide();
            var date = me.getFullYear()+"-01-01";
            var params = me.getLineParams(stationId, dateType, date);
            titleType = "总";

            //me.renderBar(dateType, params, titleType);
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
            if(msg.length>0){
                var time = [];
                var data = [];
                var all = 0;
                $.each(msg, function(i,v){
                    if(dateType == 2){
                        time.push(v.reportDate.slice(11,16));
                    }else if(dateType == 3){
                        time.push(v.reportDate.slice(5,10));
                    }else if(dateType == 4){
                        time.push(v.reportDate.slice(0,7));
                    }

                    
                    data.push(v.energy/1000);
                    all += (v.energy)/1000;
                });

                all = me.formatterData(all).num + me.formatterData(all).unit;

                var option = {
                    title: {
                        text: titleType + "发电量",
                        left: "center",
                        textBaseline: "top",
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'normal',
                            fontSize: 14,
                            color: '#27bb77',
                        },
                        subtext: all,
                        padding: [6,0,0,0]
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
                            name: "kWh",
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


                var myline = echarts.init(document.getElementById('myline'));
                option = $.extend({}, defaultOption1, option);
                myline.setOption(option);
            }else{
                $(".realTimeEnpty").show();
            }
        });
    }
};