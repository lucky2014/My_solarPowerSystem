var myDate = new Date();
var timer3 = null;

var componentApp = {
    formatterDate: function(t){
        return (t<10) ? "0"+t : t;
    },
    getFullYear: function(){
        var me = this;
        return myDate.getFullYear();
    },
    getMonth: function(){
        var me = this;
        return myDate.getFullYear() + "-" + me.formatterDate((myDate.getMonth())+1);
    },
    getDate: function(){
        var me = this;
        return me.getMonth() + "-" + me.formatterDate(myDate.getDate())+ " " + myDate.getHours()+":" + myDate.getMinutes() + ":" + myDate.getSeconds();
    },
    getLineParams: function(stationId, dateType, date){
        var me = this;
        return {
            stationId: stationId,
            chartType: dateType || 1,
            beginDate: date || me.getDate()
        }
    },
    dateTypeChange: function(dateType, stationId, date, titleType){
        var me = this;
        
        if(dateType == "1"){//实时
                $("#componentDatePicker").hide();
                $(".componentMask").show();
                $(".componentEnpty").hide();
                var date = date || me.getDate();
                var params = me.getLineParams(stationId, dateType, date);

                var myline = echarts.init(document.getElementById('componentPowerSum'));
                myline.setOption(defaultOption);
                //请求渲染 
                setup.commonAjax("listComponentEnergy", setup.getParams(params), function(msg){
                    $(".componentMask").hide();
                    if(msg.length>0){
                        var time = [];
                        var data = [];
                        var all = 0;
                        $.each(msg, function(i,v){
                            time.push(v.cmpName);

                            data.push({value: v.power/1000,nbName: v.cmpName, invId: v.invId,cmpId: v.cmpI});
                            all += (v.energy)/1000;
                        });

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

                        var option = {
                            xAxis : {
                                data : time,
                                axisLine: {
                                    lineStyle: {
                                        color: ['#09787d']
                                    }
                                },
                            },
                            dataZoom: dataZoom,
                            yAxis : {
                                name: "W",
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
                                    name:'组件发电详情',
                                    type: 'bar',
                                    areaStyle: {normal: {}},
                                    data: data
                                },
                            ]
                        };  
                        
                        
                        option = $.extend({}, defaultOption, option);
                        myline.setOption(option);

                        me.onclickFn(myline);
                    }else{
                        $(".componentEnpty").show();
                    }
                });

                //60秒刷新
                clearInterval(timer3);
                timer3 = null;
                myline.setOption(defaultOption);
                timer3 = setInterval(function(){
                    //请求渲染 
                    $(".componentEnpty").hide();
                    setup.commonAjax("listComponentEnergy", setup.getParams(params), function(msg){
                        $(".componentMask").hide();
                        if(msg.length>0){
                            var time = [];
                            var data = [];
                            var all = 0;
                            $.each(msg, function(i,v){
                                time.push(v.cmpName);

                                data.push({value: v.power/1000,nbName: v.cmpName, invId: v.invId,cmpId: v.cmpI});
                                all += (v.energy)/1000;
                            });

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

                            var option = {
                                xAxis : {
                                    data : time,
                                    axisLine: {
                                        lineStyle: {
                                            color: ['#09787d']
                                        }
                                    },
                                },
                                dataZoom: dataZoom,
                                yAxis : {
                                    name: "W",
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
                                        name:'组件发电详情',
                                        type: 'bar',
                                        areaStyle: {normal: {}},
                                        data: data
                                    },
                                ]
                            };  
                            
                            
                            option = $.extend({}, defaultOption, option);
                            myline.setOption(option);

                            me.onclickFn(myline);
                        }else{
                            $(".componentEnpty").show();
                        }
                    });
                }, 60000);

        }else if(dateType == "2"){//选择日
            clearInterval(timer3);
            timer3 = null;
            $("#componentDatePicker").show();
            $("#datePicker2_1").val(me.getDate()).show().siblings("input").hide();

            var date = date.slice(0,10) || me.getDate().slice(0,10);
            var params = me.getLineParams(stationId, dateType, date);

            var dateRet = date.split("-");
            if(titleType && titleType == 1){
                titleType = "今日" ;
                $("#datePicker2_1").val(me.getDate()).show().siblings("input").hide();
            }else{
                titleType =dateRet[0]+"年"+dateRet[1]+"月"+dateRet[2]+"日";
                $("#datePicker2_1").val(date);
            }

            me.renderBar(dateType, params, titleType);
        }else if(dateType == "3"){//选择月
            clearInterval(timer3);
            timer3 = null;
            $("#componentDatePicker").show();

            var date = date || me.getMonth()+"-01";
            var params = me.getLineParams(stationId, dateType, date);

            var dateRet = date.split("-");
            if(titleType && titleType == 1){
                titleType = "本月" ;
                $("#datePicker3_1").val(me.getMonth()).show().siblings("input").hide();
            }else{
                titleType = dateRet[0]+"年"+dateRet[1]+"月";
                $("#datePicker3_1").val(date.slice(0,7));
            }

            me.renderBar(dateType, params, titleType);
        }else if(dateType == "4"){//选择年
            clearInterval(timer3);
            timer3 = null;
            $("#componentDatePicker").show();

            var date = date || me.getFullYear()+"-01-01";
            var params = me.getLineParams(stationId, dateType, date);

            var dateRet = date.split("-");
            if(titleType && titleType == 1){
                titleType = "本年" ;
                $("#datePicker4_1").val(me.getFullYear()).show().siblings("input").hide();
            }else{
                titleType = dateRet[0]+"年";
                $("#datePicker4_1").val(date.slice(0,4));
            }

            me.renderBar(dateType, params, titleType);
        }else{ //选择总
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
            if(msg.length>0){
                $(".componentMask").hide();
                var time = [];
                var data = [];
                var all = 0;
                $.each(msg, function(i,v){
                    time.push(v.cmpName);

                    data.push({value: v.energy/1000,nbName: v.cmpName, invId: v.invId,cmpId: v.cmpId});
                    all += (v.energy)/1000;
                });
                var dataZoom =[];

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

                all = me.formatterData(all).num + me.formatterData(all).unit;

                var option = {
                    title: {
                        text: titleType + "组件发电详情("+all+")",
                        left: "center",
                        textBaseline: "top",
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'normal',
                            fontSize: 18,
                            color: '#27bb77',
                        },
                        subtext: "",
                        padding: [0,0,0,0]
                    },
                    xAxis : {
                        data : time,
                        axisLine: {
                            lineStyle: {
                                color: ['#09787d']
                            }
                        },
                    },
                    dataZoom: dataZoom,
                    yAxis : {
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
                    },
                    series : [
                        {
                            type: 'bar',
                            name:'组件名称',
                            data: data,
                            markLine : {
                                lineStyle: {
                                    normal: {
                                        type: 'solid',
                                        color: ["#f5e105"],
                                        width: 2
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: "middle",
                                        formatter: '{c}kWh',
                                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                            fontWeight: 'normal',
                                            fontSize: 14,
                                            color: '#f5e105',
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
                        },
                    ]
                };

                
                option = $.extend({}, defaultOption, option);
                myline.setOption(option);

                me.onclickFn(myline);
            }else{
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
                status = "正常工作"
            }else{
                status = "未定义"
            }

            $("#invName").html(msg.invName);
            $("#hwId").html(msg.hwId);
            $("#smuName").html(msg.smuName);
            $("#conct").html((msg.conct ==1)? "在线" : "掉线");
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
            $.each(msg.channelInfos, function(i,v){
                html += '<dl><dd><label>通道'+v.channel+'功率：</label>'+v.power+'W</dd>';
                html += '<dd><label>通道'+v.channel+'电压：</label>'+v.vol+'Vdc</dd></dl>';
            });

            $("#channelInfos").html(html);
            if(msg.channelInfos.length>4){
                $(".dialogWrap").css({"overflow": "hidden","overflow-y": "scroll"});
            }else{
                $(".dialogWrap").css({"overflow": "hidden","overflow-y": "hidden"});
            }
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
                    avgEnergy.push({value: v.avgEnergy/1000});

                    for(var j=0; j<len; j++){
                        dataBase[j].push((msg.channelChartsList[i].cmpChannleList[j].energy)/1000);
                    }
                });

                var color = ["#ee7474","#7a9ee9","#f3a659","#3fd69f"];
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
                    name:'平均发电量',
                    itemStyle: {
                        normal: {color: '#a267ff'}
                    },
                    data: avgEnergy
                });

                var dataZoom =[];
                if(msg && msg.channelChartsList.length>100){
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

                var option = {
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
                        padding: [6,0,0,0]
                    },
                    dataZoom: dataZoom,
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
    onclickFn: function(myline){ //点击组件详情柱状图
        var me = this;
        myline.on("click", function(params){
            if(params.componentType != "markLine"){
                $("body").css({overflow: "hidden",height:"100%"});
                $("#mask").css("top",0);
                $("#mask, .dialogWrap").show();
                //电站组件详情
                me.getComponentInfo(params.data.cmpId, params.data.invId);

                var startDate="", endDate="";
                myDate.setDate(myDate.getDate()-7);
                startDate = myDate.getFullYear() + "-" + me.formatterDate(myDate.getMonth()+1) +"-"+ me.formatterDate(myDate.getDate());
                
                myDate.setDate(myDate.getDate()+6);
                endDate = myDate.getFullYear() + "-" + me.formatterDate(myDate.getMonth()+1) +"-"+ me.formatterDate(myDate.getDate());

                myDate.setDate(myDate.getDate()+1);
                
                $("#dialogDatePickerFrom input").val(startDate);
                $("#dialogDatePickerTo input").val(endDate);

                var params1 = {
                    invId: params.data.invId,
                    startDate: startDate,
                    endDate: endDate,
                };

                $("#dialogOkBtn").attr("invId", params.data.invId);
                //电站组件通道
                me.listCmpChannelEnergy(params1);
            }
        });

        $(".close").click(function(){
            $("#mask, .dialogWrap").hide();
            $("body").attr("style", "");
        });
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