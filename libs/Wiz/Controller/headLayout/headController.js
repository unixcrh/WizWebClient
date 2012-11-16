define(function (require, exports, module) {
	'use strict';
	var _messageCenter = null,
			_node = {
				userNameId: 'user_name'
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
			};


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
	}
	return {
		init: init
	}
});