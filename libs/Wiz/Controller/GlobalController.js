/**
 * 全局的控制器，转发请求到相应的独立控制器中
 */

define(function (require, exports, module) {
	
	var GlobalUtil = require('common/util/GlobalUtil');
	var config = require('config');
	var context = require('Wiz/context');
	var constant = require('Wiz/constant');
	var remote = require('Wiz/remote');

	var treeController = require('Wiz/Controller/leftTreeLayout/ztreeController');

	var token = GlobalUtil.getUrlParam('t');
	if (!token || typeof token !== 'string') {
		document.location.replace(config.login_url);
	} else {
		context.token = token;

		//必须先获取到用户信息
		remote.getUserInfo(function (data) {
			if (data.code !== '200') {
				window.location.href = constant.url.LOGIN;
				return;
			}
			//开始调用保持在线
			setInterval(remote.refreshToken, constant.remote.KEEP_ALIVE_TIME_MS);

			context.userInfo = data.user_info;

			//左侧树初始化
			treeController.init('leftTree');
			//初始化滚动条
			initSplitter();
		}, function (err) {
			//错误处理
		});
	}

	function initSplitter() {
		//初始化Splitter
		var Splitter = require('component/Splitter');
		var leftSplitter = new Splitter();
		var rightSplitter = new Splitter();
		leftSplitter.init({left: 'leftTree_container', right: 'content_container', 'splitter': 'left_splitter'});
		rightSplitter.init({left: 'docList_containner_wrapper', right: 'doc_detail', 'splitter': 'content_splitter'});
	}

});