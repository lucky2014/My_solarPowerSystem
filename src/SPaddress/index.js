define(function(require, exports, module) {		
	var $ = require("jquery");
		require("src/SPaddress/index.css");
	var formatData = require("src/common.formatData/formatData");

    var adressApp = {
    	initInfo: function(msg){
    		$("#stationName b").html(msg.stationName); 
    		$("#msuDay b").html(msg.msuDay+"天"); 
    		$("#invNum b").html(formatData(msg.invNum, "个", 4).num + formatData(msg.invNum,"个", 4).unit);
    		$("#capacityVal b").html(formatData(msg.capacityVal, "kWp", 3).num + formatData(msg.capacityVal,"kWp", 3).unit); 
    		$("#smuNum b").html(formatData(msg.smuNum, "个", 4).num + formatData(msg.smuNum, "个", 4).unit); 
    		$("#cmpNum b").html(formatData(msg.cmpNum, "个", 4).num + formatData(msg.cmpNum, "个", 4).unit);
    		$("#smuCode b").html(msg.smuId); 
    		$("#regTime b").html(msg.regTime.slice(0,10)); 
    		$("#devCompany b").html(msg.devCompany); 
    		$("#location b").html(msg.location); 

            //今日收入
            $("#todayIncome").html(formatData(msg.todayIncome,"元",2).num + formatData(msg.todayIncome,"元",2).unit);  //预计收益,type =2
            $("#todayEnergy").html(formatData(msg.todayEnergy,"kWh",1).num + formatData(msg.todayEnergy,"kWh",1).unit);

            $(".sum").show();

            var w = $(window).width();
            if(w<1025){
                $("#powerMeter .sum span.dBlock").css({
                    "padding-left": 0
                });
                $(".infoWrap.myGaugeParent").css({
                     height: "280px"
                });
                $("#totalSum li").css({
                     height: "249px"
                });
                $("#saveSum li").css({
                     height: "106px"
                });
                $(".statDetail").css({
                    right: "14px"
                });
                $(".sum").css({
                    bottom: "5px"
                });
                $(".dateTab").css({
                    width: "150px"
                });
            }else{
                $("#powerMeter .sum span.dBlock").css({
                    "padding-left": "10px"
                });
                $(".infoWrap.myGaugeParent").css({
                     height: "260px"
                });
                $("#totalSum li").css({
                     height: "229px"
                });
                $("#saveSum li").css({
                     height: "96px"
                });
                $(".statDetail").css({
                    right: "14px"
                });
                $(".sum").css({
                    bottom: "10px"
                });
                $(".dateTab").css({
                    width: "200px"
                });
            }

            $("#msuEnergy").html(formatData(msg.msuEnergy, "kWh", 1).num); //总发电量,type =1
            $("#msuEnergyUnit").html(formatData(msg.msuEnergy, "kWh", 1).unit); //总发电量

            $("#msuIncome").html(formatData(msg.msuIncome,"元",2).num);  //预计收益,type =2
            $("#msuIncomeUnit").html(formatData(msg.msuIncome,"元",2).unit);  //预计收益,type =2

            $("#msuCapacity").html(formatData(msg.capacityVal,"kWp", 3).num);  //总装机容量,type =3
            $("#msuCapacityUnit").html(formatData(msg.capacityVal,"kWp", 3).unit); //总电站数,type =4

            $("#msuStationNum").html(formatData(msg.msuStationNum,"个", 4).num); //总电站数,type =4
            $("#msuStationNumUnit").html(formatData(msg.msuStationNum,"个", 4).unit); //总电站数,type =4

            $("#msuCo2").html(formatData(msg.saveC, "吨", 5).num + formatData(msg.saveC, "吨", 5).unit); //CO2减排,type =5
            $("#msuAff").html(formatData(msg.aff, "棵",6).num + formatData(msg.aff, "棵",6).unit);  //植树造林,type =6
            $("#msuDistance").html(formatData(msg.distance, "M", 7).num + formatData(msg.distance, "M", 7).unit); //行驶里程,type =7
            $("#msuSavingCoal").html(formatData(msg.savingCoal, "吨", 8).num + formatData(msg.savingCoal, "吨", 8).unit); //节约标准煤,type =8
    	}
    }

    module.exports = adressApp;
});
