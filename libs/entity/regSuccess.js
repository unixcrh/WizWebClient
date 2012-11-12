define(function (require, exports) {
	var cookie = require('cookie');
	var api = require('Wiz/constant').api;

		<!--
	// flashlover
	//解决ie6下png透明显示错的问题
	function correctPNG() {
		for(var i=0; i<document.images.length; i++) {
		var img = document.images[i]
		var imgName = img.src.toUpperCase()
		if (imgName.substring(imgName.length-3, imgName.length) == "PNG") {
			var imgID = (img.id) ? "id='" + img.id + "' " : ""
			var imgClass = (img.className) ? "class='" + img.className + "' " : ""
			var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
			var imgStyle = "display:inline-block;" + img.style.cssText 
			if (img.align == "left") imgStyle = "float:left;" + imgStyle
			if (img.align == "right") imgStyle = "float:right;" + imgStyle
			if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle  
			var strNewHTML = "<span " + imgID + imgClass + imgTitle
			+ " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
			+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
			+ "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" 
			img.outerHTML = strNewHTML
			i = i-1
			}
		}
	}

	function initLoginListener() {
		var redirectUrl = api.WEB_URL;
		$('#login_btn').bind('click', function () {
			var userId = cookie("loginCookie");
			var password = cookie("passwordCookie");
			if (!userId || !password) {
				window.location.replace(redirectUrl);
				return;
			}
			var params = {
				user_id : userId, 
				password : password
			}
			$('#login_btn').unbind('click');
			$.post(api.LOGIN, params, function (data,status){
				if (typeof data === 'string') {
					var data = JSON.parse(data);
				}
				if (status === 'success' && data.code == 200) {
				  redirectUrl = redirectUrl + "?t=" + data.token;
				}
				window.location.replace(redirectUrl);
			});
		});
	}

	function initialize() {
		initLoginListener();
		if (window.attachEvent) {
			window.attachEvent("onload", correctPNG);
		}
	}

	exports.initialize = initialize;
});