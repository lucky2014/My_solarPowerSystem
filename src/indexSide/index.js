define(function(require, exports, module) {
    var $ = require("jquery");
    var Engine = require("engine");
    var box = Engine.init();
    var addressTpl = require("src/indexSide/address.tpl");
    var footerTpl = require("src/common.partial/footer.tpl");
    var swiper = require("src/common.swiper/swiper");
    var setup = require("setup");
    var weatherApp = require("src/common.weather/weather");
    var formatData = require("src/common.formatData/formatData");
        require("my97DatePicker");
    var guageApp = require("src/common.gaugeChart/index");
    var SPrealTimeStat = require('src/SPrealTimeStat/index');

    var timer ; //仪表计时器

    var indexApp = {
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

            
            //-----------------折线图,单个电站统计统计-----------------
            SPrealTimeStat.dateTypeChange(1, stationId);

            //脚部
            box.render($(".footer"),"", footerTpl);
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
        $("#myline,.chartsParent").css({"height":"360px", width: "100%"});
    }else{
        $("#myline,.chartsParent").css({"height":"320px", width: "100%"});
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
        var dateType = self.attr("data-value");
        self.addClass("on").siblings().removeClass("on");
        var stationId = sessionStorage.getItem("stationId");
        SPrealTimeStat.dateTypeChange(dateType, stationId, "", 1);
    });
    
});