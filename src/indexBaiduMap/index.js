define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
	var echarts = require("echarts");
	var getAllTotal = require("src/indexBaiduMap/getAllTotal"); //首页总的统计
		//单个电站信息,右边的那一片
	var indexSideApp = require("src/indexSide/index");

	// 百度地图API功能
	var map = new BMap.Map("myMap",{minZoom:8});    // 创建Map实例

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
	var timer = null;


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
		ajaxMapFn: function(){
			//渲染标注物
			var pointRet =[];
			setup.commonAjax("getPowerList", setup.getParams(), function(msg){
				map.centerAndZoom(new BMap.Point(msg.chartList[0].lon, msg.chartList[0].lat), 11);  // 初始化地图,设置中心点坐标和地图级别
				//console.log(JSON.stringify(msg.chartList,null,2));
				//msg.chartList.length = 7;
				$.each(msg.chartList, function(i,v){
					if(v.lon && v.lat){
						var point = new BMap.Point(v.lon, v.lat);
						pointRet.push(point);
						var persent = v.power/1000/v.capacity;
						var myIcon = "";
						if(persent<0.1){
							myIcon = new BMap.Icon("src/imgs/loc1.png", new BMap.Size(30,44));
						}else if(0.1<persent<=0.2){
							myIcon = new BMap.Icon("src/imgs/loc2.png", new BMap.Size(30,44));
						}else if(0.2<persent<=0.3){
							myIcon = new BMap.Icon("src/imgs/loc3.png", new BMap.Size(30,44));
						}else if(0.3<persent<=0.4){
							myIcon = new BMap.Icon("src/imgs/loc4.png", new BMap.Size(30,44));
						}else if(0.4<persent<=0.5){
							myIcon = new BMap.Icon("src/imgs/loc5.png", new BMap.Size(30,44));
						}else if(0.5<persent<=0.6){
							myIcon = new BMap.Icon("src/imgs/loc6.png", new BMap.Size(30,44));
						}else if(0.6<persent<=0.7){
							myIcon = new BMap.Icon("src/imgs/loc7.png", new BMap.Size(30,44));
						}else if(0.7<persent<=0.8){
							myIcon = new BMap.Icon("src/imgs/loc8.png", new BMap.Size(30,44));
						}else if(0.8<persent<=0.9){
							myIcon = new BMap.Icon("src/imgs/loc9.png", new BMap.Size(30,44));
						}else if(0.9<persent<=1){
							myIcon = new BMap.Icon("src/imgs/loc10.png", new BMap.Size(30,44));
						}
						var marker = new BMap.Marker(point, {icon:myIcon});
						map.addOverlay(marker);  
						
						var opts = {
						  width : 300,     // 信息窗口宽度
						  height: 72,     // 信息窗口高度
						  title : "" , // 信息窗口标题
						  enableMessage:false,//设置允许信息窗发送短息
						  offset: new BMap.Size(-2,-9)
						}
						var infoWindow = new BMap.InfoWindow("<strong>"+v.name + "</strong><br />" +v.energy+"kW/"+v.power+"kWp<br />"+v.location+"<a href=stationInfo.html?stationId=" + v.id + "&name=" + v.name + " class='detail'><img src='src/imgs/r.png' /></a>", opts);  // 创建信息窗口对象 
						marker.addEventListener("mouseover", function(){          
							map.openInfoWindow(infoWindow,point); //开启信息窗口配合
						});	
						/*marker.addEventListener("mouseout", function(){          
							map.closeInfoWindow(infoWindow,point); //开启信息窗口配合
						});*/
						marker.addEventListener("click", function(){          
							map.openInfoWindow(infoWindow,point); //开启信息窗口配合
							
							//初始化下拉列表
							$("#defaultStation").text(v.name).attr("stationId",v.id);
		        			sessionStorage.setItem("stationId", v.id);
						   
						    clearInterval(timer);
					        timer = null;
					        indexSideApp.rendStationDetail(v.id);  //根据新电站ID首次渲染电站详情
					         //60秒刷新仪表
					        
					        timer = setInterval(function(){
					            indexSideApp.readerGauge(v.id);
					        }, 60000);
						});	
					}
				});

				if(msg.chartList.length>10){
					//让所有点在视野范围内
	    			map.setViewport(pointRet);
				}
			});
		},
		readerMap: function(map){
			var me = this;
			$("#myMap").css("background","none");
	        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

		    var styleJson = require("src/indexBaiduMap/styleJson");
			map.setMapStyle({
				styleJson:styleJson,
			});

			//渲染标注物
			me.ajaxMapFn();

			//地图60秒刷新
			var timerMap = null;
		    clearInterval(timerMap);
		    timerMap = null;
			
			//30秒总体数据
			timerMap = setInterval(function(){
				me.ajaxMapFn();
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
		document.cookie = setup.setCookie("userName","",-1);
		document.cookie = setup.setCookie("userId","",-1);
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
	
	//30秒总体数据刷新
	timerStat = setInterval(function(){
		getAllTotal();
	}, 30000);
});