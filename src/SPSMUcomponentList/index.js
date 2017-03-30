define(function(require, exports, module) {
    var $ = require("jquery");
   	var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var componentTpl = require("src/SPSMUcomponentList/componentList.tpl");
    //组件发电详情
    var SPcomponentEnergyListApp = require('src/SPcomponentEnergyList/index');
    var getDateApp = require('src/common.getDate/index');
    var time = getDateApp.getDate(1);

    box.render($(".componentList"), "", componentTpl);

    var listStationSmu = {
        init: function(stationId){
            setup.commonAjax("listStationSmu", setup.getParams({
                stationId: stationId
            }), function(msg){
                box.render($(".componentList"), msg, componentTpl);

                $("#baseComponentStationId").attr("stationId",msg[0].id).html(msg[0].name+"-"+msg[0].smuId);

                //------------------组件发电详情---------------------
                SPcomponentEnergyListApp.dateTypeChange(1, msg[0].id, time);

                $(".componentList span").click(function(e){
                    e.stopPropagation();
                    $(this).next().toggle();
                });

                $(".componentList dd").click(function(e){
                    e.stopPropagation();
                    $(".componentMask").show();
                    var self = $(this);
                    self.parent().hide();
                    var stationId = self.attr("stationId");
                    var text = self.html();
                    self.parent().prev("span").attr("stationId", stationId).html(text);

                    //------------------组件发电详情---------------------
                    var chartType = $("#componentTab dd.on").attr("data-value");
                    var time2 = $("#datePicker"+chartType+"_1").val();
                    //console.log(chartType+"==="+time2);
                    SPcomponentEnergyListApp.dateTypeChange(chartType, stationId, time2);
                });

                $("body").click(function(){
                    $(".componentList dl").hide();
                });
            });
        }
    };

    

    module.exports = listStationSmu;
});