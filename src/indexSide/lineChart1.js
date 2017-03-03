var lineApp = {
    myDate: new Date(),
    formatterDate: function(t){
        return (t<10) ? "0"+t : t;
    },
    init: function(type, title, timeList, valueList, subtext){
        var unit = (type == "line") ? "W" : "kWh";
        //千分位
        function format (num) {
            return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }
        return {
            title: {
                text: title,
                left: "center",
                textBaseline: "top",
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'normal',
                    fontSize: 14,
                    color: '#27bb77',
                },
                subtext: subtext,
                padding: [20,0,0,0]
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
                left: '1%',
                right: '3%',
                bottom: '5%',
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
                    data : timeList
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name: unit,
                    nameGap:5,
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
                    type: type || 'line',
                    areaStyle: {normal: {}},
                    data: valueList
                },
            ]
        }
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
    getLineParams: function(stationId, chartType, date){
        var me = this;

        return {
            stationId: stationId,
            chartType: chartType || 1,
            beginDate: date || me.getDate()
        }
    },
    getChartDataBychartType1: function(params){ //chartType=1的情况
        var me = this;
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            var time = [];
            var data = [];
            $.each(msg, function(i,v){
                time.push(v.reportDate.split(" ")[1].slice(0,5));
                data.push(v.power/10);
            });
            var lineOption = lineApp.init('line','实时发电功率', time, data);
            var myline = echarts.init(document.getElementById('myline'));
            myline.clear();
            myline.setOption(lineOption);
        });
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
    getChartDataBychartType2: function(params,date){ //chartType=2的情况
        var me = this;
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            var time = [];
            var data = [];
            var all = 0;
            $.each(msg, function(i,v){
                time.push(v.reportDate.split(" ")[1].slice(0,5));
                data.push(v.energy/1000);
                all += (v.energy)/1000;
            });

            all = me.formatterData(all).num + me.formatterData(all).unit;
            var lineOption = lineApp.init('bar',"   "+date+'发电量', time, data, "   "+all);
            var myline = echarts.init(document.getElementById('myline'));
            myline.clear();
            myline.setOption(lineOption);
        });
    },
    getChartDataBychartType3: function(params,date){ //chartType=3的情况
        var me = this;
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            var time = [];
            var data = [];
            var all = 0;
            $.each(msg, function(i,v){
                time.push(v.reportDate.split("-")[1]+"-"+v.reportDate.split("-")[2]);
                data.push(v.energy/1000);
                all += (v.energy)/1000;
            });

            all = me.formatterData(all).num + me.formatterData(all).unit;
            var lineOption = lineApp.init('bar',"   "+date+'发电量', time, data, "   "+all);
            var myline = echarts.init(document.getElementById('myline'));
            myline.clear();
            myline.setOption(lineOption);
        });
    },
    getChartDataBychartType4: function(params,date){ //chartType=4的情况
        var me = this;
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            var time = [];
            var data = [];
            var all = 0;
            $.each(msg, function(i,v){
                time.push(v.reportDate.split(" ")[0].split("-")[0]+"-"+v.reportDate.split(" ")[0].split("-")[1]);
                data.push(v.energy/1000);
                all += (v.energy)/1000;
            });
            all = me.formatterData(all).num + me.formatterData(all).unit;
            var lineOption = lineApp.init('bar',"   "+date+'发电量', time, data, "   "+all);
            var myline = echarts.init(document.getElementById('myline'));
            myline.clear();
            myline.setOption(lineOption);
        });
    },
    getChartDataBychartType5: function(params){ //chartType=5的情况
        var me = this;
        setupApp.commonAjax("getChartData", setupApp.getParams(params), function(msg){
            var time = [];
            var data = [];
            var all = 0;
            $.each(msg, function(i,v){
                time.push(v.reportDate.split(" ")[0].split("-")[0]);
                data.push(v.energy/1000);
                all += (v.energy)/1000;
            });
            all = me.formatterData(all).num + me.formatterData(all).unit;
            var lineOption = lineApp.init('bar','总计发电量', time, data, all);
            var myline = echarts.init(document.getElementById('myline'));
            myline.setOption(lineOption);
        });
    },
    getDataValueChange: function(dataValue, stationId, date, titleType){
        var me = this;
        if(dataValue == "1"){//实时
            $(".datePickerParent").hide();

            var date = date || me.getDate();
            var params = lineApp.getLineParams(stationId, dataValue, date);
            //请求渲染
            lineApp.getChartDataBychartType1(params,date);
        }else if(dataValue == "2"){//选择日
            $(".datePickerParent").show();
            $("#datePicker2").val(lineApp.getDate()).show().siblings("input").hide();

            var date = date || me.getDate();
            var params = lineApp.getLineParams(stationId, dataValue, date);
            var dateRet = date.split("-");

            if(titleType && titleType == 1){
                titleType = "今日" ;
                $("#datePicker2").val(me.getDate()).show().siblings("input").hide();
            }else{
                titleType =dateRet[0]+"年"+dateRet[1]+"月"+dateRet[2]+"日";
                $("#datePicker2").val(date);
            }

            lineApp.getChartDataBychartType2(params,titleType);
        }else if(dataValue == "3"){//选择月
            $(".datePickerParent").show();

            var date = date || me.getMonth()+"-01";
            var params = lineApp.getLineParams(stationId, dataValue, date);
            var dateRet = date.split("-");

            if(titleType && titleType == 1){
                titleType = "本月" ;
                $("#datePicker3").val(me.getMonth()).show().siblings("input").hide();
            }else{
                titleType = dateRet[0]+"年"+dateRet[1]+"月";
                $("#datePicker3").val(date.slice(0,7));
            }

            lineApp.getChartDataBychartType3(params,titleType);
        }else if(dataValue == "4"){//选择年
            $(".datePickerParent").show();

            var date = date || me.getFullYear()+"-01-01";
            var params = lineApp.getLineParams(stationId, dataValue, date);

            var dateRet = date.split("-");

            if(titleType && titleType == 1){
                titleType = "本年" ;
                $("#datePicker4").val(me.getFullYear()).show().siblings("input").hide();
            }else{
                titleType = dateRet[0]+"年";
                $("#datePicker4").val(date.slice(0,4));
            }
            
            lineApp.getChartDataBychartType4(params,titleType);
        }else{ //选择总
            $(".datePickerParent").hide();
            var date = date || me.getFullYear()+"-01-01";
            var params = lineApp.getLineParams(stationId, dataValue, date);
            lineApp.getChartDataBychartType5(params);
        }
    }
};