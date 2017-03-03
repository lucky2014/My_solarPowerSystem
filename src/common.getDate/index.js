define(function(require,exports,module){
	var myDate = new Date();

    var getDate = {
        formatterDate: function(t){
            return (t<10) ? "0"+t : t;
        },
        getFullYear: function(){
            var me = this;
            return myDate.getFullYear();
        },
        getMonth: function(){
            var me = this;
            return myDate.getFullYear() + "-" + me.formatterDate((myDate.getMonth())+1);
        },
        getDate: function(){
            var me = this;
            return me.getMonth() + "-" + me.formatterDate(myDate.getDate())+ " " + me.formatterDate(myDate.getHours())+":" + me.formatterDate(myDate.getMinutes()) + ":" + me.formatterDate(myDate.getSeconds());
        }
    };

	module.exports = getDate;

});