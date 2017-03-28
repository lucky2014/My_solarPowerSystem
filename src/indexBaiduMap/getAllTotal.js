define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
	var formatData = require("src/common.formatData/formatData");
		//单个电站信息,右边的那一片

	//导航接口和地图旁边的统计
    var timerStat = null;
    var app = {
        render: function(msg){
            $("#msuEnergy").html(formatData(msg.msuEnergy, "kWh", 1).num); //总发电量,type =1
            $("#msuEnergyUnit").html(formatData(msg.msuEnergy, "kWh", 1).unit); //总发电量

            $("#msuIncome").html(formatData(msg.msuIncome,"元",2).num);  //预计收益,type =2
            $("#msuIncomeUnit").html(formatData(msg.msuIncome,"元",2).unit);  //预计收益,type =2

            $("#msuCapacity").html(formatData(msg.msuCapacity,"kWp", 3).num);  //总装机容量,type =3
            $("#msuCapacityUnit").html(formatData(msg.msuStationNum,"kWp", 3).unit); //总电站数,type =4

            $("#msuStationNum").html(formatData(msg.msuStationNum,"个", 4).num); //总电站数,type =4
            $("#msuStationNumUnit").html(formatData(msg.msuStationNum,"个", 4).unit); //总电站数,type =4

            $("#msuCo2").html(formatData(msg.msuCo2, "吨", 5).num + formatData(msg.msuCo2, "吨", 5).unit); //CO2减排,type =5
            $("#msuAff").html(formatData(msg.msuAff, "棵",6).num + formatData(msg.msuAff, "棵",6).unit);  //植树造林,type =6
            $("#msuDistance").html(formatData(msg.msuDistance, "M", 7).num + formatData(msg.msuDistance, "M", 7).unit); //行驶里程,type =7
            $("#msuSavingCoal").html(formatData(msg.msuSavingCoal, "吨", 8).num + formatData(msg.msuSavingCoal, "吨", 8).unit); //节约标准煤,type =8
        },
        getAllTotal: function(){
            setup.commonAjax("getAllTotal", setup.getParams(), function(msg){
                app.render(msg);
                var msg = JSON.stringify(msg);  
                setup.setCookie("getAllTotal", msg , 1);
            });
        },
        init: function(){
            var me = this;
            var msg = setup.getCookie("getAllTotal");
            if(msg){
                var msg = JSON.parse(msg);
                app.render(msg);
                setup.setCookie("getAllTotal", msg , -1);

                clearInterval(timerStat);
                timerStat = null;
                
                //30秒总体数据刷新
                timerStat = setInterval(function(){
                    app.getAllTotal();
                }, 30000);
            }else{
                app.getAllTotal();
                clearInterval(timerStat);
                timerStat = null;
                
                //30秒总体数据刷新
                timerStat = setInterval(function(){
                    app.getAllTotal();
                }, 30000);
            }
        }
    };
    
    
    module.exports = app.init;	
});