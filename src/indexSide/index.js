define(function(require, exports, module) {
    var $ = require("jquery");
    var echarts = require("echarts");
    var Engine = require("engine");
    var box = Engine.init();
    var addressTpl = require("src/indexSide/address.tpl");
    var footerTpl = require("src/common.partial/footer.tpl");
    var swiper = require("src/common.swiper/swiper");
    var setup = require("setup");
    var lineApp = require("src/indexSide/lineChart"); 
    var weatherApp = require("src/common.weather/weather");
    var formatData = require("src/common.formatData/formatData");
        require("my97DatePicker");
    var guageApp = require("src/common.gaugeChart/index");

    var timer, timer2 ; //仪表计时器
    var flag = false;

    var indexApp = {
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
        rendStationDetail: function(stationId){
            var me = this;
            $(".dateTab dd:eq(0)").addClass("on").siblings().removeClass("on");
            sessionStorage.setItem("stationId", stationId);
            //-----------------天气预报-----------------
            weatherApp.weatherIndex(stationId);

            //电站基本信息接口
            setup.commonAjax("getStationInfo", setup.getParams({
                stationId: stationId
            }), function(msg){
                //-----------------渲染banner-----------------  
                var banner = msg.pic.split("|");
                swiper.swiperIndex(banner);

                $("#refreshTime").html(msg.refreshTime);
                //-----------------单个电站统计-----------------
                $("#s_msuCo2").html(formatData(msg.saveC, "吨", 5).num + formatData(msg.saveC, "吨", 5).unit); //CO2减排,type =5
                $("#s_msuAff").html(formatData(msg.aff, "棵",6).num + formatData(msg.aff, "棵",6).unit);  //植树造林,type =6
                $("#s_msuDistance").html(formatData(msg.distance, "M", 7).num + formatData(msg.distance, "M", 7).unit); //行驶里程,type =7
                $("#s_msuSavingCoal").html(formatData(msg.savingCoal, "吨", 8).num + formatData(msg.savingCoal, "吨", 8).unit); //节约标准煤,type =8
                
                var Wwidth = $(window).width();
                var Wheight = $(window).height();
                
                $(".oneStationStat img").css("height", 0.019*Wwidth + "px"); //0.38*0.5*0.2*0.56

                //-----------------渲染仪表-----------------
                guageApp.init(msg, "myGauge", "myPolar");
                
                //-----------------渲染地址-----------------  
                box.render($(".addressParent"), msg, addressTpl);
                $(".hasLink").attr("href","stationInfo.html?stationId="+stationId+"&name="+msg.name)
            });

            
            //-----------------折线图-----------------
            me.getDataValueChange(1,stationId)

            //脚部
            box.render($(".footer"),"", footerTpl);
        },
        getChartDataBychartType1: function(params){ //chartType=1的情况
            var me = this;
            setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                var time = [];
                var data = [];
                $.each(msg, function(i,v){
                    time.push(v.reportDate.split(" ")[1].slice(0,5));
                    data.push(v.power/10);
                });
                var lineOption = lineApp.init('line','  实时发电功率', time, data);
                
                myline.clear();
                myline.setOption(lineOption);

                var footerTpl = require("src/common.partial/footer.tpl");
                //脚部
                box.render($(".footer"),"", footerTpl);
            });
        },
        getDataValueChange: function(dataValue, stationId, date, titleType){
            var me = this;
            var myline = echarts.init(document.getElementById('myline'));
            if(dataValue == "1"){//实时
                $(".datePickerParent").hide();
                var date = date || me.getDate();
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
                //请求渲染 

                setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                    var time = [];
                    var data = [];
                    $.each(msg, function(i,v){
                        time.push(v.reportDate.split(" ")[1].slice(0,5));
                        data.push(v.power/10);
                    });
                    var lineOption = lineApp.init('line','  实时发电功率', time, data);
                    
                    myline.setOption(lineOption);

                    var footerTpl = require("src/common.partial/footer.tpl");
                    //脚部
                    box.render($(".footer"),"", footerTpl);
                });

                //60秒刷新
                clearInterval(timer2);
                timer2 = null;
                timer2 = setInterval(function(){
                    setup.commonAjax("getChartData", setup.getParams(params), function(msg){
                        var time = [];
                        var data = [];
                        $.each(msg, function(i,v){
                            time.push(v.reportDate.split(" ")[1].slice(0,5));
                            data.push(v.power/10);
                        });
                        var lineOption = lineApp.init('line','  实时发电功率', time, data);
                        
                        myline.setOption(lineOption);

                        var footerTpl = require("src/common.partial/footer.tpl");
                        //脚部
                        box.render($(".footer"),"", footerTpl);
                    });
                }, 60000);

            }else if(dataValue == "2"){//选择日
                clearInterval(timer2);
                $(".datePickerParent").show();

                var date = date || me.getDate();
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
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
                clearInterval(timer2);
                $(".datePickerParent").show();

                var date = date || me.getMonth()+"-01";
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
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
                clearInterval(timer2);
                $(".datePickerParent").show();

                var date = date || me.getFullYear()+"-01-01";
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
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
                clearInterval(timer2);
                $(".datePickerParent").hide();
                var date = me.getFullYear()+"-01-01";
                sessionStorage.setItem("date", date);
                var params = me.getLineParams(stationId, dataValue, date);
                lineApp.getChartDataBychartType5(params);
            }
        },
        getLineParams: function(stationId, chartType, date){
            var me = this;
            return {
                stationId: stationId,
                chartType: chartType || 1,
                beginDate: date || me.getDate()
            }
        },
        readerGauge: function(stationId){ //用作实时刷新用刷新
            var me = this;
            setup.commonAjax("getStationDateil", setup.getParams({
                stationId: stationId
            }), function(msg){
                guageApp.init(msg, "myGauge", "myPolar");
            });
        }
    };
    var stationListApp = require("src/common.stationList/stationList");

    var wHeight = $(window).height();
    if(wHeight>900){
        $("#myline,.chartsParent").css("height","360px");
    }else{
        $("#myline,.chartsParent").css("height","320px");
    }


    //初始化下拉列表
    stationListApp.init(function(stationId){
        clearInterval(timer);
        timer = null;
        indexApp.rendStationDetail(stationId);  //根据新电站ID首次渲染电站详情
         //60秒刷新仪表
        
        timer = setInterval(function(){
            indexApp.readerGauge(stationId);
        }, 60000);
    });

    //点击下拉列表,把取得的stationId放进缓存
    stationListApp.liChangeFn(function(stationId){
        clearInterval(timer);
        timer = null;
        indexApp.rendStationDetail(stationId);  //根据新电站ID首次渲染电站详情

        timer = setInterval(function(){
            indexApp.readerGauge(stationId);
        }, 60000);
    });

    //日期选择栏
    $(".dateTab dd").click(function(){
        var self = $(this);
        var dataValue = self.attr("data-value");
        self.addClass("on").siblings().removeClass("on");
        var stationId = sessionStorage.getItem("stationId");
        indexApp.getDataValueChange(dataValue, stationId, "", 1);
    });
    
});