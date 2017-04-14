define(function(require,exports,module){
	var myDate = new Date();

    var getDate = {
        formatterDate: function(t){
            return (t<10) ? "0"+t : t;
        },
        getFullYear: function(){
            var me = this;
            var str = "";
            if((myDate.getMonth())==0 && myDate.getDate() == 1){
                str = myDate.getFullYear() - 1;
            }else{
                str = myDate.getFullYear();
            }
            return str;
        },
        getMonth: function(dateType){
            var me = this;
            var str = "";
            if(dateType == 3 && myDate.getDate() == 1){
                myDate.setDate(myDate.getDate()-1);
                str = myDate.getFullYear() + "-" + me.formatterDate((myDate.getMonth())+1);
                myDate.setDate(myDate.getDate()+1);
            }else{
                str = myDate.getFullYear() + "-" + me.formatterDate((myDate.getMonth())+1);
            }
            return str;
        },
        getDate: function(dateType){
            var me = this;
            var str = "";
            var myDate = new Date();
            if(dateType == 2 && myDate.getHours() <= 20){
                myDate.setDate(myDate.getDate()-1);
                str = myDate.getFullYear() + "-" + me.formatterDate(myDate.getMonth()+1) +"-"+ me.formatterDate(myDate.getDate())+ " " + me.formatterDate(myDate.getHours())+":" + me.formatterDate(myDate.getMinutes()) + ":" + me.formatterDate(myDate.getSeconds());
                myDate.setDate(myDate.getDate()+1);
            }else{
                str = me.getMonth() + "-" + me.formatterDate(myDate.getDate())+ " " + me.formatterDate(myDate.getHours())+":" + me.formatterDate(myDate.getMinutes())+ ":" + me.formatterDate(myDate.getSeconds());
            }
            return str;
        },
    };

	module.exports = getDate;

});