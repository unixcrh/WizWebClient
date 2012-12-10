define(function (require, exports, module){

	var GlobalUtil = {
		// 对电子邮件的验证
		verifyEmail: function (str_email) {
			var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if (myreg.test(str_email)) {
				return true;
			}
		},
		// 对密码的验证
		checkValidPasswd: function (str_password) {
			var password = $.trim(str_password);

			if (password == "") {
				return false;
			}

			var res = GlobalUtil.isGoodPassword(password);
			if (res == false) {
				return false;
			}

			var len;
			var i;
			var isPassword = true;
			len = 0;
			for ( i = 0; i < password.length; i++) {
				if (password.charCodeAt(i) > 255)
					isPassword = false;
			}

			if (!isPassword || password.length < 6) {
				return false;
			}
			if (password.length > 16) {
				return false;
			}

			return true;
		},

		 /*判断是否为合法密码*/
		isGoodPassword: function (str){ 
			    var badChar ="ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
			    badChar += "abcdefghijklmnopqrstuvwxyz"; 
			    badChar += "0123456789"; 
			    badChar += " "+"　";//半角与全角空格 
			    badChar += "`~!@#$%^&()-_=+]\\|:;\"\\'<,>?/";//不包含*或.的英文符号 
			    if(""==str){ 
			     return false; 
			    } 
			    var len=str.length
			    for(var i=0;i<len;i++){
			        var c = str.charAt(i);
			        if(badChar.indexOf(c) == -1){ 
			            return false; 
			            } 
			    }
			       return true; 
		} ,

		/* 函数功能：改变指定id元素的class属性值 */
		changeClass: function (obj_id, obj_class) {
			$("#" + obj_id + "").removeClass().addClass(obj_class);
		},

		/* 取得url参数 */
		getUrlParam: function (paras) {
			var url = location.href;
			var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
			var paraObj = {};
			for ( i = 0; j = paraString[i]; i++) {
				paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
			}
			var returnValue = paraObj[paras.toLowerCase()];
			if ( typeof (returnValue) == "undefined") {
				return "";
			} else {
				return returnValue;
			}
		},
		/**
		 * 是否包含特殊字符
		 * @param str
		 * @returns {Boolean}
		 */
		isConSpeCharacters: function (str) {
			var badChar = "\\/:<>*?\"&\'";
			if ("" == str) {
				return false;
			}
			var len = str.length;
			for (var i = 0; i < len; i++) {
				var c = str.charAt(i);
				if (badChar.indexOf(c) > -1) {
					return false;
				}
			}
			return true;
		},
		// 格式化日期timestamp
		formatDate: function (dateStr) {
			//标准游览器，如果数组里面最后一个字符为逗号，JS引擎会自动剔除它。
			//参考https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Values,_variables,_and_literals?redirectlocale=en-US&redirectslug=Core_JavaScript_1.5_Guide%2FValues%2C_Variables%2C_and_Literals#Literals
			var ie = GlobalUtil.bIe();
			if (ie) {
				//ie6,7下 new Date(dateStr) 不支持dateStr为xxxx-xx-xx格式，需要转换格式
				dateStr = dateStr.replace(/\-/ig, '/').split('.')[0];
			}
			var date = new Date(dateStr);
			return date.toLocaleDateString();
		},
		//判断是否为ie浏览器
		bIe: function () {
			if(document.all) {
				return true;
			}
			return false;
		},
		// 通过classname获取jquery对象
		getJqueryObjByClass: function (className) {
			return $('.' + className);
		},
		// 通过id获取jquery对象
		getJqueryObjById: function (id) {
			return $('#' + id);
		},
		isConSpeCharacters: function (value) {
			var special = '\\,/,:,<,>,*,?,\",&,\'',
				specialList = special.split(',');
			for(var index=0, length=specialList.length; index < length; index++) {
				if (value.indexOf(specialList[index]) > -1) {
					return true;
				}
			}
			return false;
		},
		fireEvent: function(element,event){
	    if (document.createEventObject){
        // IE浏览器支持fireEvent方法
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
	    }
	    else{
        // 其他标准浏览器使用dispatchEvent方法
        var evt = document.createEvent( 'HTMLEvents' );
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true); 
        return !element.dispatchEvent(evt);
	    }
		}
	};

	module.exports = GlobalUtil;
});