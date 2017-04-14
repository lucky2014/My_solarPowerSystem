define(function(require, exports, module) {		
	var $ = require("jquery");
	var Engine = require("engine");
	var weatherTpl = require("src/common.weather/weather.tpl");
	var weatherTodayTpl = require("src/common.weather/weatherToday.tpl");
	var weatherAnotherTpl = require("src/common.weather/weatherAnother.tpl");
	var setup = require("setup");
		require("src/common.weather/index.css");
	var Swiper = require("swiper");

	//实例化组件
	var box = Engine.init();

	var weatherApp = {
		adTimer: null,
		weatherIndex: function(stationId){ //主页的天气
			var me = this;
			//天气接口
			$(".weatherIndex").html("");
			setup.commonAjax("getWeather", setup.getParams({
		        stationId: stationId
		    }), function(msg){
		        box.render($(".weatherIndex"), msg, weatherTpl);

		        clearInterval(me.adTimer);
		        me.setScrollFn();
		    });
		},
		setScrollFn: function(){
			var me = this;
			var len  = $(".weatherIndex li").length;
            if(len>1){
                var index = 0;

                me.adTimer = setInterval(function(){
                	showImg(index);
                    index++;
                    
                    if(index==len){
                        index = 0;
                    }
                },5000);
            }else{
            	clearInterval(me.adTimer);
            }
            
            // 通过控制top ，来显示不同的幻灯片
            function showImg(index){
                var adHeight = $(".weatherIndex li").height();
                $('.weatherIndex ul').stop(true,false).animate({top : -adHeight*index},1000);
            }
		},
		weatherInfo: function(stationId){ //电站详情的天气
			var me = this;
			$(".weather").html("");
			//天气接口
			setup.commonAjax("getWeather", setup.getParams({
		        stationId: stationId
		    }), function(msg){
		    	//console.log(JSON.stringify(msg,null,2));
		        box.render($(".weather"), msg.weatherBeanVOs, weatherTodayTpl);
		        var swiper = new Swiper('.weather', {
		            pagination: '',
		            spaceBetween: 0,
		            autoplay: 5000,
		            slidesPerView: 2,
		            loop : true,
		            direction:'vertical',
		        });
		    });
		}
	};

	
	module.exports =  weatherApp;
});
