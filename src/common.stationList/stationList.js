define(function(require, exports, module) {		
	var $ = require("jquery");
	var Engine = require("engine");
	var stationList = require("src/common.stationList/stationList.tpl");
	var setup = require("setup");

	//实例化组件
	var box = Engine.init();

    var stationListApp = {
    	init: function(callback){
    		var me = this;
    		//接口调试
			setup.commonAjax("stationList", setup.getParams(), function(msg){
		        box.render($(".pwsStat"), msg, stationList);
		        var stationId = setup.getQueryString("stationId");
		        if(stationId){
		        	$("#defaultStation").text(setup.getQueryString("name")).attr("stationId",stationId);
		        	sessionStorage.setItem("stationId", stationId);
		        	callback && callback(stationId);
		        }else{
		        	$("#defaultStation").text(msg[0].name).attr("stationId",msg[0].id);
		        	sessionStorage.setItem("stationId", msg[0].id);
		        	callback && callback(msg[0].id);
		        }
		    });
    	},
    	liChangeFn: function(callback){
    		//操作
			$(".pwsStat").click(function(e){
				e.stopPropagation();
				if ($(".level1").hasClass("hide")) {
					$(".level1").slideDown();
				}else{
					$(".level1").slideUp();
				}
			});
			$(".pwsStat").delegate(".level1>li", "click", function(e){
				e.stopPropagation();
				var me = $(this);
				if(me.children("ul").find("li").length>0){
					me.children(".level2").fadeIn();
					me.siblings("li").children(".level2").fadeOut();
				}else{
					$(".level1").slideUp();
					$(".level2").hide();

					stationId = me.attr("stationId");
					sessionStorage.setItem("stationId", stationId);
					$("#defaultStation").html(me.children("span").html()).attr("stationId", stationId); //$("#defaultStation")选中状态的节点
					callback && callback(stationId);
				}
			});
			$(".pwsStat").delegate(".level1>li", "dblclick", function(e){
				e.stopPropagation();
				var me = $(this);
				$(".level1").slideUp();
				$(".level2").hide();

				stationId = me.attr("stationId");
				sessionStorage.setItem("stationId", stationId);
				$("#defaultStation").html(me.children("span").html()).attr("stationId", stationId); //$("#defaultStation")选中状态的节点
				callback && callback(stationId);
			});
			$(".pwsStat").delegate(".level2 li", "click", function(e){
				var me = $(this);
				e.stopPropagation();
				stationId = me.attr("stationId");
				sessionStorage.setItem("stationId", stationId);
				callback && callback(stationId);

				$("#defaultStation").html(me.html()).attr("stationId",me.attr("stationId")); //$("#defaultStation")选中状态的节点
				
				$(".level1").slideUp();
				$(".level2").hide();
			});
			$("body").click(function(e){
				e.stopPropagation();
				$(".level1").slideUp();
				$(".level2").hide();
			});
			/*$(".pwsStat").hover(function(e){
				e.stopPropagation();
			},function(e){
				e.stopPropagation();
				$(".level1").slideUp();
				$(".level2").hide();
			});*/
    	}
    }

    module.exports = stationListApp;
});
