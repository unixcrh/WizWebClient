define(function(require, exports) {
	'use strict';
	var GlobalUtil = require('common/util/GlobalUtil'),
			api = require('Wiz/constant').api,
			debugModel = GlobalUtil.getUrlParam('debug'),
			redirectUrl = 'http://service.wiz.cn/web/?t=';
			// redirectUrl = 'http://localhost/web?t=';	
	var uType = '';
	uType = getUrlParam('type');
	console.log(uType);
	
	// TODO增加判断
	if (document.location.pathname === '/login' || document.location.pathname === '/login') {
		autoLogin();
	} 
	if(uType == 'biz'){
		// 针对Biz用户进行的个性化提示
		// Biz用户autologin
	}

	$(document).ready(function() {
		$("#login_name").select();
		/* 验证注册账号事件 */
		$("#register_name").live("blur",function(){
			register_name();
		});
		$("#loginkeycode").click(login);

		$('#register_submit').click(Register);
		/* 验证密码事件 */
		$("#register_password1").live("blur",function(){
			register_password1();
		});

		/* 验证两次密码是否相等 */
		$("#register_password2").live("blur",function(){
			register_password2();
		});
		// 往文本框添加保存的cookie值
		$("#login_name").val($.cookie("un"));
		$('#register_name').val($.cookie('singin_email'));
		if (document.location.pathname === '/register') {
			autoFillInviteCode();
		}
	});


	/*判断用户名*/
	function register_name(){
		var register_name = $("#register_name").val();
		var rtn_register_name = GlobalUtil.verifyEmail(register_name);

		if(rtn_register_name != true){
			GlobalUtil.changeClass("register_name_div","control-group error");
			$("#register_name_error").html("Email格式不正确");
			return false;
		}else{
			GlobalUtil.changeClass("register_name_div","control-group");
			$("#register_name_error").html("");
			return true;
		}
	}
	/*判断密码*/
	function register_password1(){
		var register_password1 = $("#register_password1").val();
		var rtn_register_password1 = GlobalUtil.checkValidPasswd(register_password1);

		if(rtn_register_password1 != true){
			GlobalUtil.changeClass("register_password1_div","control-group error");
			$("#register_password1_error").html("密码格式不正确");
			return false;
		}else{
			GlobalUtil.changeClass("register_password1_div","control-group");
			$("#register_password1_error").html("");
			return true;
		}
	}

	/*判断两次密码是否相同*/
	function register_password2(){
		var register_password1 = $("#register_password1").val();
		var register_password2 = $("#register_password2").val();

		if(register_password1 !== register_password2){
			GlobalUtil.changeClass("register_password2_div","control-group error");
			$("#register_password2_error").html("两次输入的密码不同");
			return false;
		}else{
			GlobalUtil.changeClass("register_password2_div","control-group");
			$("#register_password2_error").html("");
			return true;

		}
	}

	/* 登陆回车监听*/
	$(document).keydown(function(e){
		if(e.keyCode == 13){
			$('#loginkeycode').submit();
		}
	});
	function preventDefault(event) {
		if (event.preventDefault) {
			event.preventDefault();	
		} else {
			event.returnValue = false;
		}
	}
	/* 登陆按钮 */
	function login(event){
		preventDefault(event);
		$("#tip_error_login").hide();

		var user_id = $("#login_name").val();
		var password = $("#login_password").val();

		if(user_id!=""){
			if(password!=""){
				// 是否保存密码
				var keep_password;

				if ($("#login_keeppassword").attr("checked") == "checked"){
					keep_password = "on";
				}else{
					keep_password = "off";
				}

				var params = { 
					'user_id' : user_id, 
					'password' : password,
					'isKeep_password' : keep_password,
					'debug': debugModel
				};
				// 调用一下ajax
				$('#loginkeycode').attr('disabled', 'disabled');
				$.post(api.LOGIN, params, function (data, status){
					callBackLogin(data, status);
				});
			}else{
				$("#tip_error_login").html("<a style=\"color: #FF0000; font-size:12px\">密码不能为空</a>").fadeIn();
				return false;
			}
		}else{
			$("#tip_error_login").html("<a style=\"color: #FF0000; font-size:12px\">账号不能为空</a>").fadeIn();
			return false;
		}
	}

	function callBackLogin(data,status){
		$('#loginkeycode').removeAttr('disabled');
		$("#tip_error_login").hide();
		if(status=="success"){
			var loginCookie = $('#login_name').val();
			var passwordCookie = $('#login_password').val();
			var keepCookie = $('#login_keeppassword').attr('checked');
			// var defCookieMaxAge = data.defCookieMaxAge;
			if(keepCookie === "checked"){
				// 设置cookie
				$.cookie("un", loginCookie, { expires: 14 });
				//TODO password应该要保存为md5格式
				$.cookie("up", passwordCookie, { expires: 14});
				$.cookie("keepCookie", keepCookie, { expires: 14 });

			}else{
				// cookie生存期置为0
				$.cookie("un", loginCookie);
				$.cookie("up", passwordCookie);
				$.cookie("keepCookie", keepCookie);
			}

			if(data.code==200){
				// var url = redirectUrl + data.token;
				var url = api.WEB_URL + '?t=' + data.token + '&debug=' + debugModel;
				window.location.replace(url);
			} else if (data.code == 488) {
				$('#tip_error_login').html('登陆尝试次数过多，请稍后重试').fadeIn();
			}	else {
				$("#tip_error_login").html("用户名或密码不正确,请重新输入").fadeIn();
			}	
		}else if(status == null){
			alert('链接错误');
		}else if(status == 'timeout'){
			alert('链接超时');
		}else if(status == 'error'){
			alert("内部错误");
		}
	}


	// “记住我”后，自动登录
	// 读取cookie   post  获取token  跳转
	function autoLogin() {
		// console.log(cookie('loginCookie'));
		 if ( $.cookie('un') != null && $.cookie('up') != null ) {
		 	var params = { 
					user_id : $.cookie('un'), 
					password : $.cookie('up'),
					// isKeep_password : keep_password,
					debug: debugModel
				};
				// 调用一下ajax
				$('#loginkeycode').attr('disabled', 'disabled');
				$.post(api.LOGIN, params, function (data, status){
					if(data.code==200){
						// var url = redirectUrl + data.token;
						var url = api.WEB_URL + '?t=' + data.token + '&debug=' + debugModel;
						window.location.replace(url);
					} 
					else if (data.code == 1108) {
						$('#tip_error_login').html('登陆尝试次数过多，请稍后重试').fadeIn();
					}	else {
						$("#tip_error_login").html("用户名或密码不正确,请重新输入").fadeIn();
					}	
				});
		 }
	}
	
	// 注册页面自动填充邀请码
	function autoFillInviteCode() {
		var inviteCode = $.cookie('iCode');
		if (inviteCode && inviteCode.length > 0)  {
			$('#invite_code').val(inviteCode).show();
		}
	}

	// 注册
	function Register(event){
		preventDefault(event);
		$("#tip_error_register").hide();

		var rtn_error1 = register_name();
		var rtn_error2 = register_password1();
		var rtn_error3 = register_password2();
		if(rtn_error1 && rtn_error2 && rtn_error3){
			var str_register_email = $("#register_name").val();
			var str_register_password = $("#register_password1").val();
			var str_invite_code = $("#invite_code").val();

			// 验证码
			// 注册所用参数
			var params = {
					user_id : str_register_email,
					password : str_register_password,
					invite_code : str_invite_code
			};
			$.post(api.REGISTER, params, function(data,status){
				callBackRegister(data,status,params);
			});
		}else{
			$("#tip_error_register").html("请检查文本格式").fadeIn();
			return false;
		}
	}

	// 注册回调函数
	function callBackRegister(data, status, params){
		$("#tip_error_register").hide();

		if(status=="success"){
			if (data.code == 200) {
				// 自动登陆
				$.cookie("un", params.user_id);
				$.cookie("up", params.password);

				autoLogin();
			} else if(data.code == "500"){
				$("#tip_error_register").html("注册失败").fadeIn();
		  } else if(data.code == "399"){
				$("#tip_error_register").html("用户已存在，请直接登录或找回密码").fadeIn();
		  } else if (data.code == 489) {
				$("#tip_error_register").html("注册次数过多，请稍后重试").fadeIn();
	  	}

		}else if(status == null){
			alert('链接错误');
		}else if(status == 'timeout'){
			alert('链接超时');
		}else if(status == 'error'){
			alert("内部错误");
		}
	}

	/* 注册回调公共方法*/
	function callBackRegister_verify(data){
		var errorMsg = '';
		if(data.code == "200"){
			$.cookie("un", $("#register_name").val());//, { domain: '127.0.0.1', secure: true });
			$.cookie("up", $("#register_password1").val());//, { domain: '127.0.0.1', secure: true});
			window.location.href = api.REGISTER_SUCCESS_URL;
	  } else if(data.code == "500"){
		  errorMsg = "注册失败";
	  } else if(data.code == "399"){
		  errorMsg = "用户已存在，请直接登录或找回密码";
	  } else if (data.code == 489) {
	  	errorMsg = '注册次数过多，请稍后重试';
	  }
	  $('#tip_error_register').html(errorMsg).fadeIn();
	}
	// 从url中获取参数的方法
	function getUrlParam(paras){
		var url = location.href; 
		var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
		var paraObj = {};
		var j = '';
		for (var i=0; j=paraString[i]; i++){ 
			paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
		} 
		var returnValue = paraObj[paras.toLowerCase()]; 
		if(typeof(returnValue)=="undefined"){ 
			return ""; 
		}else{ 
			return returnValue; 
		} 
	}
	function initBizLogin(){
		//修改页面内容的操作
		$('.login-intro > h1').text('登录到Biz账户');
	}
	function inintBizRegister(){
		// 修改页面内容的操作
	}

});