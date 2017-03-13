define(function(require, exports, module) {
	var $ = require("jquery");
    require("MD5");
    var CryptoJS = require("CryptoJS");

    var setupApp = {
        url: "http://shmily480.vicp.net:8880/photovoltaicServer/service.do",
        //url: "http://192.168.2.55:8083/photovoltaicServer/service.do",
        desKey: "2017@gfd",
        md5Key: "2017@hzlq",
        getQueryString: function(name) { //获取URL的参数，isEit
          var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
          var r = window.location.search.substr(1).match(reg);
          if (r != null) {
            //return unescape(r[2]);
            return decodeURI(r[2]);
          }
          return null;
        },
        encryptByDES: function(message, key) { //
            var keyHex = CryptoJS.enc.Utf8.parse(key);
            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        },
        decryptByDES: function(ciphertext, key) {
            //alert(ciphertext+","+key)
            var keyHex = CryptoJS.enc.Utf8.parse(key);
            // direct decrypt ciphertext
            var decrypted = CryptoJS.DES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
            }, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        },
        getParams: function(theData,desKey,md5Key){
            var me = this;
            var userId = 0;
            var desKey = desKey || me.desKey;
            var md5Key = md5Key || me.md5Key;
            var data= {
                timeStamp: new Date().getTime(),
            };
            data = $.extend({},data,theData);

            if(me.isIE()){
                userId = (me.getQueryString("userId"))? me.getQueryString("userId") : 0;
            }else{
                userId = (sessionStorage.getItem("userId")) ? sessionStorage.getItem("userId") : 0;
            }

            return {
                version: "1.0.0",
                userId: userId,
                timeStamp: data.timeStamp,
                data: me.encryptByDES(JSON.stringify(data), desKey),
                hashCode: $.md5( data.timeStamp + md5Key)
            };
        },
        commonAjax: function(name, params, succCallback, errCallback){
            var me = this;
            $.ajax({  
                type: "post",  
                url: me.url,  
                data: {cmd:name, value:JSON.stringify(params)},
                dataType: "json",  
                success: function(msg){
                    if(msg.resultCode == 1000){
                        succCallback(msg.returnObject);
                    }else if(msg.resultCode == 9999){ //系统异常或故障

                    }else if(msg.resultCode == 2001 || msg.resultCode == 2002 || msg.resultCode == 2003){  //帐号被锁定
                        $(".msg").html("<em>*</em>" + msg.returnObject).show();
                    }else if(msg.resultCode == 2009){  //用户不存在
                        $(".msg").html("<em>*</em>" + "您输入的密码有误！").show();
                    }else if(msg.resultCode == 2012){  //用户未登录
                        var url = location.href;
                        location.href = "login.html?url="+url;
                    }
                }, 
                complete: function (XHR, TS) { XHR = null },
                error: function (msg) {  
                    //alert(JSON.stringify(msg,null,2));
                    if(errCallback) errCallback(msg); 
                }  
            }); 
        },
        isIE: function(){ //判断浏览器是不是IE，不是的话传参数到index.html
            return (!!window.ActiveXObject || "ActiveXObject" in window) ? true : false;
        }
    };

    //alert(setupApp.encryptByDES(JSON.stringify({"stationId":33,"timeStamp":1484290349626}), "2017@gfd"));
    module.exports = setupApp;
});