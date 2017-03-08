define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
	var echarts = require("echarts");
	var getAllTotal = require("src/indexBaiduMap/getAllTotal"); //首页总的统计
		//单个电站信息,右边的那一片
		require("src/indexSide/index");

		require("src/indexBaiduMap/InfoBox_min.js");
	// 百度地图API功能
	var map = new BMap.Map("myMap");    // 创建Map实例

	var vHeight = $(window).height(); //屏幕高度，初始化时需要屏幕的高度
	//获取地图的高度
	$(".mapParent").css("height", vHeight-210);

	if(vHeight>900){
		$("#myMap").css({"left":0,top: 0,height:"800px"});
		$(".mapParent").css("height", vHeight-210);
	}else{
		$("#myMap").css({"left":0,top: "-100px"});
		$(".mapParent").css("height", vHeight-190);
	}
	
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
					//$(".versionRecord").hide(); //隐藏版权记录
				});
		    });
		},
		exitShow: function(){
			$("#dialogExit, #mask").show();
			$("body").css({"height": "100%", "overflow": "hidden"});
		},
		readerMap: function(map){
			$("#myMap").css("background","none");
	        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

		    //个性化在线编辑器地址：http://developer.baidu.com/map/custom/
			var styleJson = [{
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                    "color": "#202b33"
                }
            }, {
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                    "color": "#2d4455"
                }
            }, {
                "featureType": "boundary",
                "elementType": "geometry",
                "stylers": {
                    "color": "#212d35"
                }
            }, {
                "featureType": "railway",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry",
                "stylers": {
                    "color": "#b5ae57"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#b5ae57",
                    "lightness": 1
                }
            }, {
                "featureType": "highway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "on"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry",
                "stylers": {
                    "color": "#004981",
                    "lightness": -39
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#00508b"
                }
            }, {
                "featureType": "poi",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "green",
                "elementType": "all",
                "stylers": {
                    "color": "#056197",
                    "visibility": "off"
                }
            }, {
                "featureType": "subway",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "manmade",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "local",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "arterial",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "boundary",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#029fd4"
                }
            }, {
                "featureType": "building",
                "elementType": "all",
                "stylers": {
                    "color": "#1a5787"
                }
            }, {
                "featureType": "label",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#ffffff"
                }
            }, {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#1e1c1c"
                }
            }, {
                "featureType": "administrative",
                "elementType": "labels",
                "stylers": {
                    "visibility": "on"
                }
            },{
                "featureType": "road",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }];
			map.setMapStyle({
				styleJson:styleJson,
			});

			var pointRet = [];

			//渲染标注物
			setup.commonAjax("getPowerList", setup.getParams(), function(msg){
				map.centerAndZoom(new BMap.Point(msg.chartList[0].lon, msg.chartList[0].lat), 8);  // 初始化地图,设置中心点坐标和地图级别
				$.each(msg.chartList, function(i,v){
					if(v.lon && v.lat){
						var point = new BMap.Point(v.lon, v.lat);
						pointRet.push(point);
						var marker = new BMap.Marker(point);
						map.addOverlay(marker);  
						// 将标注添加到地图中
						var html = "";
						if(v.name.length>15){
							html = "<div class='infoBoxContent'><strong>"+v.name+"：</strong>"+v.energy+"kW/"+v.power+"kWp</div>";
						}else{
							html = "<div class='infoBoxContent'><strong>"+v.name+"：</strong><br />"+v.energy+"kW/"+v.power+"kWp</div>";
						}
						
						var infoBox = new BMapLib.InfoBox(map,html,{
						    boxStyle:{
						        minWidth: "220px",
						        minHeight: "40px",
						        color: "#fff",
						        background: "#32ba7c",
						        border:"1px solid #19a967",
						        borderRadius: "6px",
						        padding: "10px"
						    },
						    enableAutoPan: true,
						    closeIconUrl: "",
						    align: 3,
						    offset: new BMap.Size(25,25)
						});

						marker.addEventListener("mouseover", function(){          
							infoBox.open(marker);
						});
						marker.addEventListener("mouseout", function(){          
							infoBox.close();
						});

						marker.addEventListener("click",getAttr);
						function getAttr(){
							location.href = "stationInfo.html?stationId=" + v.id + "&name=" + v.name;
						} 	
					}
				});
				//让所有点在视野范围内
	    		map.setViewport(pointRet);
			});

			//地图60秒刷新
			var timerMap = null;
		    clearInterval(timerMap);
		    timerMap = null;
			
			//30秒总体数据
			timerMap = setInterval(function(){
				setup.commonAjax("getPowerList", setup.getParams(), function(msg){
					$.each(msg.chartList, function(i,v){
						if(v.lon && v.lat){
							var point = new BMap.Point(v.lon, v.lat);
							var marker = new BMap.Marker(point);
							map.addOverlay(marker);  
							// 将标注添加到地图中
							var html = "";
							if(v.name.length>15){
								html = "<div class='infoBoxContent'><strong>"+v.name+"：</strong>"+v.energy+"kW/"+v.power+"kWp</div>";
							}else{
								html = "<div class='infoBoxContent'><strong>"+v.name+"：</strong><br />"+v.energy+"kW/"+v.power+"kWp</div>";
							}
							
							var infoBox = new BMapLib.InfoBox(map,html,{
							    boxStyle:{
							        minWidth: "220px",
							        minHeight: "40px",
							        color: "#fff",
							        background: "#32ddd7",
							        border:"1px solid #1fd1cb",
							        borderRadius: "6px",
							        padding: "10px"
							    },
							    enableAutoPan: true,
							    closeIconUrl: "",
							    align: 3,
							    offset: new BMap.Size(25,25)
							});

							marker.addEventListener("mouseover", function(){          
								infoBox.open(marker);
							});
							marker.addEventListener("mouseout", function(){          
								infoBox.close();
							});

							marker.addEventListener("click",getAttr);
							function getAttr(){
								location.href = "stationInfo.html?stationId=" + v.id + "&name=" + v.name;
							} 	
						}
					});
				});
			}, 60000);
		}
	};

	indexApp.readerMap(map);
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
			$("#myMap").css({"left":0,top: 0});
			
			$(".wrapRight").show();
		}else{
			$(".wrap").toggleClass("big");
			$(this).toggleClass("big");

			////地图的高度变化
			if(vHeight>900){
				$("#myMap").css({"left":0,top: 0,height:"800px"});
				$(".mapParent").css("height", vHeight-210);
			}else{
				$("#myMap").css({"left":0,top: "-100px"});
				$(".mapParent").css("height", vHeight-190);
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
		//$(".versionRecord").hide(); //版权记录隐藏
	});

	var timerStat = null;
    clearInterval(timerStat);
    timerStat = null;
	
	//30秒总体数据
	timerStat = setInterval(function(){
		getAllTotal();
	}, 30000);
});