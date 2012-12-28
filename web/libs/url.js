
'use strict';
(function() {
	function getUrlParam(paras) {
		var url = location.href;
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {};
		var i , j;
		for (i = 0; j = paraString[i]; i++) {
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		var returnValue = paraObj[paras.toLowerCase()];
		if ( typeof (returnValue) == "undefined") {
			return "";
		} else {
			return returnValue;
		}
	}
	function initUrl() {
		// 获取url中的token
		var token = getUrlParam('t'),
				debugModel = getUrlParam('debug');

		if (!token || typeof token !== 'string') {
			token = $.cookie('token');
			if (!token || typeof token !== 'string') {
				document.location.replace(constant.url.LOGIN);
			}
		} else {
			// 保存到cookie中
			$.cookie('token', token);
			$.cookie('debug_model', debugModel);

			document.location.replace(window.location.pathname);
		}
	}

	initUrl();
})();