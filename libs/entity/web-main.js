define(function(require, exports) {
	var GlobalUtil = require('common/util/GlobalUtil');
	var config = require('config');
	var context = require('Wiz/context');
	var constant = require('Wiz/constant');
	var remote = require('Wiz/remote');

	var treeCtrl = require('Wiz/Controller/leftTreeLayout/ztreeController');
	var searchBoxCtrl = require('Wiz/Controller/leftTreeLayout/searchBoxController');
	var listCtrl = require('Wiz/Controller/docListLayout/Controller');

	initialize();

	//整个页面的初始化
	function initialize() {
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

				//将user_info保存到wiz上下文
				context.userInfo = data.user_info;
				//首先加载为私人库
				context.kbGuid = data.user_info.kb_guid;
				//顶部功能初始化
				//
				//搜索栏初始化
				searchBoxCtrl.init();
				//左侧树初始化
				treeCtrl.init('leftTree');

				//初始化中间文档列表
				// listCtrl.init();

				//右侧内容初始化

				//初始化滚动条
				initSplitter();
			}, function (err) {
				//错误处理
			});
		}
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