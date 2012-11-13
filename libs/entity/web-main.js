define(function(require, exports) {
	var GlobalUtil = require('common/util/GlobalUtil');
	var config = require('config');
	var cookie = require('cookie');

	var context = require('Wiz/context');
	var constant = require('Wiz/constant');
	var remote = require('Wiz/remote');

	var treeController = require('Wiz/Controller/treeController');

	var token = GlobalUtil.getUrlParam('t');
	if (!token || typeof token !== 'string') {
		document.location.replace(config.login_url);
	} else {
		context.token = token;

		//必须先获取到用户信息
		remote.getUserInfo(function (data) {
			if (data.code !== '200') {
				window.location.href = constant.url.LOGIN;
				console.error(data.message);
				return;
			}
			//开始调用保持在线
			setInterval(remote.refreshToken, constant.remote.KEEP_ALIVE_TIME_MS);

			context.userInfo = data.user_info;

			treeController.init('leftTree');

		}, function (err) {
			//错误处理
			console.error(err);
		});

	}

	//初始化Splitter
	var Splitter = require('component/Splitter');
	var leftSplitter = new Splitter();
	var rightSplitter = new Splitter();
	leftSplitter.init({left: 'leftTree_container', right: 'content_container', 'splitter': 'left_splitter'});
	rightSplitter.init({left: 'docList_containner_wrapper', right: 'doc_detail', 'splitter': 'content_splitter'});

	// cookie(token);
	// if (token){
	// 	//隐藏token值
	// 	window.location.replace(window.location.pathname);
	// }

});