define(function (require, exports, module) {
	'use strict';

	var _messageCenter = null,
			constant = require('Wiz/constant'),
			_node = {
				userInfoId: 'user_info',
				userNameId: 'user_name',
				userMenuId: 'user_menu'
			},
			_data = {
				_userInfo: null
			},
			_view = {
				showUser: function(userInfo) {
					console.log(userInfo.user.displayname);
					var nameSelector = getJqIdSelector(_node.userNameId);
					nameSelector.html(userInfo.user.displayname);
				}
			},
			_bindInitHandler= function() {
				var userInfoElem = getJqIdSelector(_node.userInfoId),
						userMenuListElem = getJqIdSelector(_node.userMenuId);
				userInfoElem.click(function (event) {
					event = event || window.event;
					// 阻止默认行为
					event.preventDefault();
					event.returnValue = false;
					var visible = userMenuListElem.css('visibility');
					if (visible === 'visible') {
						userMenuListElem.css('visibility', 'hidden');
					} else {
						userMenuListElem.css('visibility', 'visible');
					}
				});

				// 绑定menu list事件
				var cmdLinkList = userMenuListElem.children('li').children('a'),
						listLength = cmdLinkList.length;
				for(var index=0; index < listLength; index ++) {
					var cmdLink = cmdLinkList[index];
					cmdLink.onclick = function (event) {
						event = event || window.event;
						event.preventDefault();
						// event.returnValue = false;

						var return_url = window.location.origin; //自身url
						var encode_return_url = encodeURIComponent(return_url);
						window.location.href = constant.url.LOGOFF + encode_return_url;
						
						// ie6下无反应
					}
				}
			},
			event = {
				
			}


	function getJqClassSelector(className) {
		return $('.' + className);
	}

	function getJqIdSelector(id) {
		return $('#' + id);
	}



	function init(userInfo, messageCenter) {
		_messageCenter = messageCenter;
		_data.userInfo = userInfo;
		_view.showUser(userInfo);
		_bindInitHandler();

	}
	return {
		init: init
	}
});