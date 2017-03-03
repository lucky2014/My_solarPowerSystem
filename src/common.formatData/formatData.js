define(function(require,exports,module){
	//总的统计单位换算，判断显示哪个单位
	var formatData = {
		init: function(n,unit,type){
			var msNum = {};
			if((parseInt(n)+"").length>5){
				
				if(type == 4 || type == 6){
					msNum.num = Number(n/1000).toFixed(0);
				}else{
					msNum.num = Number(n/1000).toFixed(2);
				}

				if(type == 1 ) {
					if(unit == "kWh"){
						msNum.unit = "MWh";
					}else{
						msNum.unit = "GWh";
					}
				}

				if(type == 2) {
					if(unit == "元"){
						msNum.unit = "千元";
					}else{
						msNum.unit = "百万";
					}
				}

				if(type == 3) {
					if(unit == "kWp"){
						msNum.unit = "MWp";
					}else{
						msNum.unit = "GWp";
					}
				}

				if(type == 4) {
					if(unit == "个"){
						msNum.unit = "千个";
					}else{
						msNum.unit = "百万个";
					}
				}

				if((type == 5 || type == 8)) {
					if(unit == "千克"){
						msNum.unit = "吨";
					}else{
						msNum.unit = "千吨";
					}
				}

				if(type == 6) {
					if(unit == "棵"){
						msNum.unit = "千棵";
					}else{
						msNum.unit = "百万棵";
					}
				}

				if(type == 7) {
					if(unit == "M"){
						msNum.unit = "KM";
					}else{
						msNum.unit = "KKM";
					}
				}
			}else{
				if(type == 4 || type == 6){
					msNum.num = Number(n).toFixed(0);
				}else{
					msNum.num = Number(n).toFixed(2);
				}

				msNum.unit = unit;
			}

			

			return msNum;
		}
	};

	module.exports = formatData.init;

});