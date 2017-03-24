var myDate = new Date();
var timer3 = null;
//千分位
function format (num) {
    return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

var componentApp = {
    colorRet: ["cee7474","c7a9ee9","ca267ff","c3fd69f"],
    color: ["#ee7474","#7a9ee9","#a267ff","#3fd69f"],
    formatterDate: function(t){
        return (t<10) ? "0"+t : t;
    },
    getFullYear: function(){
        var me = this;
        var str = "";
        if((myDate.getMonth())==0 && myDate.getDate() == 1){
            str = myDate.getFullYear() - 1;
        }else{
            str = myDate.getFullYear();
        }
        return str;
    },
    getMonth: function(dateType){
        var me = this;
        var str = "";
        if(dateType == 3 && myDate.getDate() == 1){
            myDate.setDate(myDate.getDate()-1);
            str = myDate.getFullYear() + "-" + me.formatterDate((myDate.getMonth())+1);
            myDate.setDate(myDate.getDate()+1);
        }else{
            str = myDate.getFullYear() + "-" + me.formatterDate((myDate.getMonth())+1);
        }
        return str;
    },
    getDate: function(dateType){
        var me = this;
        var str = "";
        if(dateType == 2 && myDate.getHours() <= 20){
            myDate.setDate(myDate.getDate()-1);
            str = myDate.getFullYear() + "-" + me.formatterDate(myDate.getMonth()+1) +"-"+ me.formatterDate(myDate.getDate())+ " " + myDate.getHours()+":" + myDate.getMinutes() + ":" + myDate.getSeconds();
            myDate.setDate(myDate.getDate()+1);
        }else{
            str = me.getMonth() + "-" + me.formatterDate(myDate.getDate())+ " " + myDate.getHours()+":" + myDate.getMinutes() + ":" + myDate.getSeconds();
        }
        return str;
    },
    getLineParams: function(stationId, dateType, date){
        var me = this;
        return {
            stationId: stationId,
            chartType: dateType || 1,
            beginDate: date || me.getDate(dateType)
        }
    },
    dataZoom: function(msg){
        var dataZoom = [];
        if(msg && msg.length>100){
            dataZoom = [
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
            ]
        }else{
            dataZoom = [];
        }

        return dataZoom;
    },
    dateType1Fn: function(params, myline){
        var me = this;
        setupApp.commonAjax("listComponentEnergy", setupApp.getParams(params), function(msg){
            $(".componentMask").hide();
            if(msg && msg.listCmpCharts.length>0){
                var invName = [];
                var dataBase = [[],[],[],[]];
                var series = [];
                var len = msg.maxInvLength;
                $.each(msg.listCmpCharts, function(i,v){
                    invName.push({value:v.invName});
                    var channleObj = [];
                    for(var j=0; j< len; j++){
                        var ord = j+1;
                        ord = "<span class='"+ me.colorRet[ord-1] +"'>通道"+ord+"</span>";
                        channleObj.push(ord + "：" + format((v.cmpCharts[j] && v.cmpCharts[j].energy) ? v.cmpCharts[j].energy : 0)+"Wh");
                        dataBase[j].push({value:((v.cmpCharts[j] && v.cmpCharts[j].energy) ? v.cmpCharts[j].energy : 0)/1000, cmpId: (v.cmpCharts[j] && v.cmpCharts[j].cmpId) ? v.cmpCharts[j].cmpId : 0, invId: (v.cmpCharts[j] && v.cmpCharts[j].invId) ? v.cmpCharts[j].invId : 0,channleObj: channleObj});
                    }
                    stdPower.push({value: v.stdPower/1000});
                });

                for(var i=0; i<len; i++){
                    if(dataBase[i].length != 0){
                        series.push({
                            type: 'bar',
                            itemStyle: {
                                normal: {color: me.color[i]}
                            },
                            name:'平均功率',
                            data: dataBase[i],
                        });
                    }
                }

                var option = {
                    dataZoom: me.dataZoom(msg),
                    tooltip : {
                        trigger: 'axis',
                        formatter : function (params) {
                            var str = "";
                            for(var i=0; i<params[0].data.channleObj.length; i++){
                                str += params[0].data.channleObj[i]+"<br />";
                            }
                            str = "逆变器名称："+params[0].name + '<br />'+ str ;
                            return str;
                        },
                        backgroundColor:"#357a69",
                        borderColor: "#1fd1cb",
                        borderWidth: 1,
                        enterable: true
                    },
                    xAxis : {
                        data : invName,
                        type : 'category',
                        name:'',
                        nameGap:1,
                        boundaryGap : true,
                        axisLine: {
                            lineStyle: {
                                color: ['#09787d']
                            }
                        },
                        triggerEvent: true
                    },
                    yAxis : [
                        {
                            type : 'value',
                            name: "kW",
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
                    series :  series
                };

                option = $.extend({}, defaultOption, option);
                myline.setOption(option);
                me.onclickFn(myline,msg);
            }else{
                var mylineNull = echarts.init(document.getElementById('componentPowerSum'));
                mylineNull.setOption(defaultOption);
                $(".componentEnpty").show();
            }
        });
    },
    dateTypeChange: function(dateType, stationId, date, titleType){
        var me = this;
        
        if(dateType == "1"){//实时
            $(".componentList").css({
                right: "20px"
            });
            $("#componentDatePicker").hide();
            $(".componentMask").show();
            $(".componentEnpty").hide();
            var date = date || me.getDate(dateType);
            var params = me.getLineParams(stationId, dateType, date);

            var myline = echarts.init(document.getElementById('componentPowerSum'));
            //请求渲染 
            me.dateType1Fn(params, myline);

            //60秒刷新
            clearInterval(timer3);
            timer3 = null;
            timer3 = setInterval(function(){
                //请求渲染 
                $(".componentEnpty").hide();
                me.dateType1Fn(params, myline);
            }, 60000);

        }else if(dateType == "2"){//选择日
            $(".componentList").css({
                right: "200px"
            });
            clearInterval(timer3);
            timer3 = null;
            var str = me.getDate(dateType);
            $("#componentDatePicker").show();
            if(titleType && titleType == 1){ //说明是从tab来的
                $("#datePicker2_1").val(str).show().siblings("input").hide();
            }else{
                $("#datePicker2_1").val(date);
            }

            var date = date.slice(0,10) || str.slice(0,10);
            var params = me.getLineParams(stationId, dateType, date);

            titleType = "日" ;

            me.renderBar(dateType, params, titleType);
        }else if(dateType == "3"){//选择月
            $(".componentList").css({
                right: "200px"
            });
            clearInterval(timer3);
            timer3 = null;
            var str = me.getMonth(dateType);
            $("#componentDatePicker").show();
            if(titleType && titleType == 1){
                $("#datePicker3_1").val(str).show().siblings("input").hide();
            }else{
                $("#datePicker3_1").val(date.slice(0,7));
            }

            var date = date || str +"-01";
            var params = me.getLineParams(stationId, dateType, date);

            titleType = "月" ;

            me.renderBar(dateType, params, titleType);
        }else if(dateType == "4"){//选择年
            $(".componentList").css({
                right: "200px"
            });
            clearInterval(timer3);
            timer3 = null;
            $("#componentDatePicker").show();
            if(titleType && titleType == 1){
                $("#datePicker4_1").val(me.getFullYear()).show().siblings("input").hide();
            }else{
                $("#datePicker4_1").val(date.slice(0,4));
            }

            var date = date || me.getFullYear()+"-01-01";
            var params = me.getLineParams(stationId, dateType, date);

            titleType = "年" ;
            
            me.renderBar(dateType, params, titleType);
        }else{ //选择总
            $(".componentList").css({
                right: "20px"
            });
            clearInterval(timer3);
            timer3 = null;
            $("#componentDatePicker").hide();
            var date = me.getFullYear()+"-01-01";
            var params = me.getLineParams(stationId, dateType, date);
            titleType = "总";

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
        $(".componentMask").show();
        $(".componentEnpty").hide();

        var myline = echarts.init(document.getElementById('componentPowerSum'));
        myline.setOption(defaultOption);
        setupApp.commonAjax("listComponentEnergy", setupApp.getParams(params), function(msg){
            $(".componentMask").hide();
            if(msg && msg.length>0){
                var invName = [];
                var dataBase = [[],[],[],[]];
                var series = [];
                var all = 0;
                var avgEnergy = [];
                var len = msg.maxInvLength;
                $.each(msg.listCmpCharts, function(i,v){
                    invName.push({value:v.invName});

                    var channleObj = [];
                    for(var j=0; j< len; j++){
                        var ord = j+1;
                        ord = "<span class='"+ me.colorRet[ord-1] +"'>通道"+ord+"</span>";
                        channleObj.push(ord + "：" + format((v.cmpCharts[j] && v.cmpCharts[j].energy) ? v.cmpCharts[j].energy : 0)+"Wh");
                        dataBase[j].push({value:((v.cmpCharts[j] && v.cmpCharts[j].energy) ? v.cmpCharts[j].energy : 0)/1000, cmpId: (v.cmpCharts[j] && v.cmpCharts[j].cmpId) ? v.cmpCharts[j].cmpId : 0, invId: (v.cmpCharts[j] && v.cmpCharts[j].invId) ? v.cmpCharts[j].invId : 0,channleObj: channleObj});
                        
                        all += ((v.cmpCharts[j] && v.cmpCharts[j].energy) ? v.cmpCharts[j].energy : 0)/1000;
                    }
                    avgEnergy.push({value: v.avgEnergy/1000});
                });
                all = me.formatterData(all, "kWh", 1).num + me.formatterData(all, "kWh", 1).unit;

                for(var i=0; i<len; i++){
                    if(dataBase[i].length != 0){
                        series.push({
                            type: 'bar',
                            itemStyle: {
                                normal: {color: me.color[i]}
                            },
                            name:'发电量',
                            data: dataBase[i],
                        });
                    }
                }

                if(dateType == 2){
                    series.push({
                        type: 'line',
                        itemStyle: {
                            normal: {color: '#f5e105'}
                        },
                        name:'平均发电量',
                        data: avgEnergy
                    });
                }

                var option = {
                    title: {
                        text: titleType+"发电量",
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
                    dataZoom: me.dataZoom(msg),
                    tooltip : {
                        trigger: 'axis',
                        formatter : function (params) {
                            var str = "";
                            for(var i=0; i<params[0].data.channleObj.length; i++){
                                str += params[0].data.channleObj[i]+"<br />";
                            }

                            for(var i=0;i<params.length;i++){
                                if(params[i].seriesName == "平均发电量"){
                                    str += "平均发电量："+ format((params[i].value*1000).toFixed(0))+"Wh";
                                }
                            }
                            str = "逆变器名称："+params[0].name + '<br />'+ str ;
                            return str;
                        },
                        backgroundColor:"#357a69",
                        borderColor: "#1fd1cb",
                        borderWidth: 1,
                        enterable: true
                    },
                    xAxis : {
                        data : invName,
                        type : 'category',
                        name:'',
                        nameGap:1,
                        boundaryGap : true,
                        axisLine: {
                            lineStyle: {
                                color: ['#09787d']
                            }
                        },
                        triggerEvent: true
                    },
                    yAxis : [
                        {
                            type : 'value',
                            name: "kWh",
                            nameGap: 5,
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
                    series :  series
                };

                option = $.extend({}, defaultOption, option);
                myline.setOption(option);
                me.onclickFn(myline,msg);
            }else{
                var mylineNull = echarts.init(document.getElementById('componentPowerSum'));
                mylineNull.setOption(defaultOption);
                $(".componentEnpty").show();
            }
        });   
    },
    getComponentInfo: function(cmpId, invId){
        var me = this;
        var params = {
            cmpId: cmpId,
            invId: invId
        };
        setupApp.commonAjax("getComponentInfo", setupApp.getParams(params), function(msg){
            var status = "";
            if(msg.status ==1){
                status = "远程控制停机"
            }else if(msg.status == 0){
                status = "正常"
            }else{
                status = "未定义"
            }

            $("#invName").html(msg.invName);
            $("#hwId").html(msg.hwId);
            $("#smuName").html(msg.smuName);
            $("#smuId").html(msg.smuId);
            $("#conct").html((msg.conct ==1) ? "在线" : "掉线");
            $("#status").html(status);
            $("#temp").html(msg.temp);
            $("#gridVol").html(msg.gridVol);
            $("#gridFreq").html(msg.gridFreq);
            $("#reportDate").html(msg.reportDate);

            var html = "";
            if(msg.channelInfos.length == 3){
                $(".componentDialogMask").css("height", "208px");
            }else if(msg.channelInfos.length == 4){
                $(".componentDialogMask").css("height", "184px");
            }else if(msg.channelInfos.length == 1){
                $(".componentDialogMask").css("height", "266px");
            }

            ["#ee7474","#7a9ee9","#a267ff","#3fd69f"];
            $.each(msg.channelInfos, function(i,v){
                html += '<dl><dd><label>通道'+v.channel+'功率：</label><span class="'+me.colorRet[v.channel-1]+'">'+v.power+'W</span></dd>';
                html += '<dd><label>通道'+v.channel+'电压：</label>'+v.vol+'Vdc</dd></dl>';
            });

            $("#channelInfos").html(html);
        });
    },
    listCmpChannelEnergy: function(params1){
        var me = this;
        $(".componentDialogMask").show();
        $(".componentDialogEnpty,.componentEnpty").hide();
        var myDialogLine = echarts.init(document.getElementById('componentDialogCharts'));
            myDialogLine.setOption(listCmpChannelEnergyBaseOption);
        setupApp.commonAjax("listCmpChannelEnergy", setupApp.getParams(params1), function(msg){
            $(".componentDialogMask").hide();
            if(msg.channelChartsList.length>0){
                var time = [];
                var dataBase = [[],[],[],[]];
                var avgEnergy = [];

                var len = (msg.maxOdrLength>4) ? 4 : msg.maxOdrLength; //通道总数

                var series = [];
                
                
                $.each(msg.channelChartsList, function(i,v){
                    time.push(v.reportDate.slice(0,10));
                    var channleObj = [];
                    for(var j=0; j<len; j++){
                        var ord = msg.channelChartsList[i].cmpChannleList[j].ord;
                        ord = "<span class='"+ me.colorRet[ord-1] +"'>通道"+msg.channelChartsList[i].cmpChannleList[j].ord+"</span>";
                        channleObj.push(ord + "：" + format(msg.channelChartsList[i].cmpChannleList[j].energy)+"Wh");
                        dataBase[j].push((msg.channelChartsList[i].cmpChannleList[j].energy)/1000);
                    }
                    avgEnergy.push({value: v.avgEnergy/1000, channleObj: channleObj});
                });

                

                var color = ["#ee7474","#7a9ee9","#a267ff","#3fd69f"];
                for(var i=0; i<4; i++){
                    if(dataBase[i].length != 0){
                        series.push({
                            type: 'bar',
                            itemStyle: {
                                normal: {color: color[i]}
                            },
                            name:'组件发电详情',
                            data: dataBase[i]
                        });
                    }
                }

                series.push({
                    type: 'line',
                    itemStyle: {
                        normal: {color: '#f5e105'}
                    },
                    name:'平均发电量',
                    data: avgEnergy
                });

                var option = {
                    dataZoom: me.dataZoom(msg.channelChartsList),
                    tooltip : {
                        trigger: 'axis',
                        formatter : function (params) {
                            var str = "";
                            for(var j=0; j<params.length; j++){
                                if(params[j].seriesName == "平均发电量"){
                                    for(var i=0; i<params[j].data.channleObj.length; i++){
                                        str += params[j].data.channleObj[i]+"<br />";
                                    }
                                    str = "日期："+params[j].name + '<br />'+ str + params[j].seriesName+'：' + format(params[j].value*1000) +"Wh" ;
                                }
                            }
                            return str;
                        },
                        backgroundColor:"#357a69",
                        borderColor: "#1fd1cb",
                        borderWidth: 1,
                        enterable: true
                    },
                    xAxis : {
                        data : time,
                        type : 'category',
                        name:'',
                        nameGap:1,
                        boundaryGap : true,
                        axisLine: {
                            lineStyle: {
                                color: ['#09787d']
                            }
                        },
                    },
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
                    series :  series
                };

                option = $.extend({}, listCmpChannelEnergyBaseOption, option);
                myDialogLine.setOption(option);
            }else{
                $(".componentDialogEnpty").show();
            }
        });
    },
    onclickFn: function(myline,msg){ //点击组件发电详情
        var me = this;
        myline.on("click", function(params){
            $("body").css({overflow: "hidden",height:"100%"});
            $("#mask").css("top",0);
            $("#mask, .dialogWrap").show();

            //判断点击的是不是横坐标轴
            $.each(msg, function(i,v){
                if(v.invName == params.value){
                    me.readerDialogFn(v.cmpCharts[0].cmpId, v.invId)
                }
            });

            if(params.componentType != "markLine" && params.componentType != "xAxis"){
                me.readerDialogFn(params.data.cmpId, params.data.invId);
            }

        });

        $(".close").click(function(){
            $("#mask, .dialogWrap").hide();
            $("body").attr("style", "");
        });
    },
    readerDialogFn: function(cmpId, invId){ //渲染弹框
        var me = this;
        //电站组件详情
        me.getComponentInfo(cmpId, invId);

        var startDate="", endDate="";
        var nowDate = new Date();
        nowDate.setDate(nowDate.getDate()-7);
        startDate = nowDate.getFullYear() + "-" + me.formatterDate(nowDate.getMonth()+1) +"-"+ me.formatterDate(nowDate.getDate());
        
        nowDate.setDate(nowDate.getDate()+6);
        endDate = nowDate.getFullYear() + "-" + me.formatterDate(nowDate.getMonth()+1) +"-"+ me.formatterDate(nowDate.getDate());

        $("#dialogDatePickerFrom input").val(startDate);
        $("#dialogDatePickerTo input").val(endDate);

        var params1 = {
            invId: invId,
            startDate: startDate,
            endDate: endDate,
        };

        $("#dialogOkBtn").attr("invId", invId);
        //电站组件通道
        me.listCmpChannelEnergy(params1);
    }
};

$("#dialogOkBtn").click(function(){
    var invId = $(this).attr("invId");
    var params = {
        invId: invId,
        startDate: $("#dialogDatePickerFrom input").val(),
        endDate: $("#dialogDatePickerTo input").val()
    };
    componentApp.listCmpChannelEnergy(params);
});