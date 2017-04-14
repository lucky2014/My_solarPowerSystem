/**
 * Created by Administrator on 2017/3/29.
 * Object Listener : 监听页面是否处于活动状态，即是否有鼠标键盘操作
 * @opt frozenTime : 5   设置间隔时长，5秒内页面没有任何鼠标键盘操作，则表示该页面处于静默状态。默认5秒。
 * @opt listenEvent ：[event Array] 监听的事件。默认普通的页面
 * @opt onStateChange:function(state){
 *   当状态由静默变为活动，或由活动状态变为静默时，触发的回调函数，state为当前状态：frozen：静默，active：活动的。
 * }
 *
 */
(function(window,undefined){
    var Listener =function(opt){
        if(!(this instanceof Listener)){
            return new Listener(opt);
        }
        this.frozenTime =opt.frozenTime || 5;  //设置静止时长,默认 5s
        this.listenEvent =opt.listenEvent||['mousedown','mousemove','keydown','scroll'];//设置监听的事件
        this.onStateChange = opt.onStateChange || null;  //状态改变后的回调函数
        this.state='frozen';     //状态：frozen |  active；
        this._interval =null;   //监控线程
        this._count =0;        //计数，若计数大于静止时长，则表示页面处于静止状态
        this._rate =500;     //监控线程执行频率 默认500ms
        this._init();
    };
    Listener.prototype._init=function(){
        var _this =this;
        for(var i in _this.listenEvent){
            if(window.addEventListener){
                window.document.addEventListener(_this.listenEvent[i],function(){
                    _this._stateChange('active');
                });
            }else if(window.attachEvent){
                window.document.attachEvent("on"+_this.listenEvent[i],function(){
                    _this._stateChange('active');
                });
            }
        }
    };
    Listener.prototype._stateChange =function(state){
        var _this =this;
        switch (state){
            case "active":{
                _this._count=0;
            }break;
            case "frozen":{

            }break;
            default:break;
        }
        if(_this.state!=state){
            _this.state=state;
            _this.onStateChange&&_this.onStateChange.call(_this,state);
        }
    };
    Listener.prototype._isFrozen =function(){
        var _this =this;
        if(_this._count>_this.frozenTime){
            _this._stateChange("frozen");
        }
    };
    Listener.prototype.start =function(){
        var _this =this;
        _this._interval =window.setInterval(function(){
            _this._count+=(_this._rate/1000);
            _this._isFrozen();
        },_this._rate);
    };
    Listener.prototype.stop =function(){
        var _this =this;
        window.clearInterval(_this.interval);
        this.count =0;
        this.state ='frozen';
    };
    "function" === typeof define && typeof define.amd ? define(function(){return Listener}) : "undefined" !== typeof exports ? "undefined" !==typeof module &&module.exports ? module.exports =exports =Listener : exports =Listener : window.Listener =Listener;
})(window);
