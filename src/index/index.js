define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
	var echarts = require("echarts");
	var getAllTotal = require("src/index/getAllTotal"); //首页总的统计
	var chinaOption = require("src/common.map/map");
		//单个电站信息,右边的那一片
		require("src/indexSide/index");

	var vHeight = $(window).height(); //屏幕高度，初始化时需要屏幕的高度
	//获取地图的高度
	$(".mapParent").css("height", vHeight-210);

	if(vHeight>900){
		$("#myMap").css({"left":0,top: 0,height:"740px"});
	}else{
		$("#myMap").css({"left":0,top: "-100px"});
	}

	var myMap = echarts.init(document.getElementById('myMap'));
	
	//渲染头部信息
	if(setup.isIE()){
		$("#userInfo").html("欢迎您 "+ setup.getQueryString("userName")+" !");
	}else{
		$("#userInfo").html("欢迎您 "+sessionStorage.getItem("userName")+" !");
	}


	var indexApp = {
		wHeight: function(){
			return $(window).height();
		},
		renderChina: function(){ //渲染地图
			$.get('src/common.map/china.json', function (chinaJson) {
		        echarts.registerMap('china', chinaJson);
				
		        myMap.clear();
		        myMap.setOption(chinaOption.init([])); //初始化空地图
		    });
		},
		getChinaData: function(){
			var mapData = [];
			setup.commonAjax("getPowerList", setup.getParams(), function(msg){
				$.each(msg.chartList, function(i,v){
					if(v.lon && v.lat){
						mapData.push({name:v.name, value:[v.lon, v.lat, v.energy], power: v.power, id: v.id});
					}				
				});
				myMap.setOption({
					series: [{
			            data: mapData
			        }]
				});

			});
		},
		getUserInfo: function(){
			//用户信息
			setup.commonAjax("getUserInfo", setup.getParams(), function(msg){
		        $("#name").html(msg.name);
		        $("#email").html(msg.email);
		        $("#address").html(msg.city ? msg.city : "" + msg.area ? msg.area : 0 + msg.address ? msg.address : 0);
		        $("#telphone").html(msg.telephone);
		        $("#loginIp").html(msg.loginIp);
		        $("#loginTime").html(msg.loginDate);
		        $("#mark").html(msg.mark);

		        //box.render($(".userInfo"), msg, userInfoTpl);
		        $("#userInfo").click(function(e){
		        	e.stopPropagation();
		        	$(".userInfo").toggle();
				});
				$("body").click(function(){
					$(".userInfo").hide();
				});
		    });
		},
		exitShow: function(){
			$("#dialogExit, #mask").show();
			$("body").css({"height": "100%", "overflow": "hidden"});
		},

	};

	//获取地图的高度
	indexApp.renderChina();
	indexApp.getChinaData();
	getAllTotal();
	
	//点击右边滑动按钮,如果不重新init地图的话，地图放大倍数后，高度不够，有被截断的感觉
	$(".slideBt").click(function(){
		var me = $(this);
		if(me.hasClass("big")){
			$(".wrap").toggleClass("big");
			$(this).toggleClass("big");
			//地图的高度变化
			var h = $(".wrapRight").height()-80;
			$(".mapParent").css({height: h});
			$("#myMap").css({"left":"-30%",top: 0});
			
			$(".wrapRight").show();
		}else{
			$(".wrap").toggleClass("big");
			$(this).toggleClass("big");

			////地图的高度变化
			$(".mapParent").css("height", vHeight-210);
			if(vHeight>900){
				$("#myMap").css({"left":0,top: 0,height:"740px"});
			}else{
				$("#myMap").css({"left":0,top: "-100px"});
			}
			
			$(".wrapRight").hide();
		}
	});

	//点击用户名
	indexApp.getUserInfo();

    //退出用户
    $("#exit").click(function(){
		indexApp.exitShow();
	});
	$("#dialogExit .exitButton .active").click(function(){
		sessionStorage.setItem("userId","");
		sessionStorage.setItem("userName","");
		location.href = "login.html";

		$("#dialogExit, #mask").hide();
		$("body").attr("style","");
	});
	$("#dialogExit .exitButton .cancel,#dialogExit .close").click(function(){
		$("#dialogExit, #mask").hide();
		$("body").attr("style","");
	});

	var timerMap, timerStat;
    clearInterval(timerMap);
    clearInterval(timerStat);
    timerMap = null;
    timerStat = null;
	//60秒刷新地图
	timerMap = setInterval(function(){
		indexApp.getChinaData();
	}, 60000);


	//30秒总体数据
	timerMap = setInterval(function(){
		getAllTotal();
	}, 30000);

	//点击地图连接到详情
	myMap.on("click", function(params){
		if(params.data && params.data.id){
			location.href = "stationInfo.html?stationId=" + params.data.id + "&name=" + params.data.name;
		}
    });
});