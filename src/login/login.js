define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");

	function submitFn(){
		var me = $(this);
		var userName = $("input[name=userName]").val();
		var passWord = $("input[name=passWord]").val();
		if(!userName){
			$(".msg").html("<em>*</em>请输入用户名！").show();
		}else if(!passWord){
			$(".msg").html("<em>*</em>请输入密码！").show();
		}

		//获取参数,然后请求
		var params = setup.getParams({
			account: userName,
			pwd: passWord
		});

		setup.commonAjax("login", params, function(msg){
			var url = setup.getQueryString("url");
			if(url){
				if(setup.isIE()){ //如果是IE，传参数
			    	location.href = url + "?" +msg.userName+"&userId="+msg.userId;
			    }else{
			    	location.href = url;
			    }
			}else{
				if(setup.isIE()){ //如果是IE，传参数
			    	location.href = "index.html?userName="+msg.userName+"&userId="+msg.userId;
			    }else{
			    	location.href = "index.html";
			    }
			}
			sessionStorage.setItem("userName", msg.userName);
			sessionStorage.setItem("userId", msg.userId);
		});
	}
	$("#loginBtn").click(function(){
		submitFn();
	});

	document.onkeydown = function(e){
		var keycode = e.which;
		
		if (keycode == 13 ){ //回车键是13
			submitFn();
		}
	};

	//输入框获得焦点
	$(".inputDiv input").focus(function(){
		$(".msg").text("").hide();
	});
});