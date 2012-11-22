/**
 * 全局的控制器，转发请求到相应的独立控制器中
 */

define(function (require, exports, module) {
	var GlobalUtil = require('common/util/GlobalUtil'),
			config = require('config'),
			context = require('Wiz/context'),
			constant = require('Wiz/constant'),
			remote = require('Wiz/remote'),

			treeCtrl = require('Wiz/Controller/leftTreeLayout/ztreeController'),
			searchBoxCtrl = require('Wiz/Controller/leftTreeLayout/searchBoxController'),
			listCtrl = require('Wiz/Controller/doclistLayout/Controller'),
			groupCtrl = require('Wiz/Controller/headLayout/groupEntryController'),
			headCtrl = require('Wiz/Controller/headLayout/headController'),
			docViewCtrl = require('Wiz/Controller/docViewLayout/DocView'),

			//负责接收下级controller的消息
			messageHandler = {
				requestDocList: requestDocList,
				requestDocumentBody: requestDocumentBody
			},

			_curDoc = null;

	//整个页面的初始化
	function init() {
		var token = GlobalUtil.getUrlParam('t');
		if (!token || typeof token !== 'string') {
			document.location.replace(config.login_url);
		} else {
			context.token = token;

			//必须先获取到用户信息
			remote.getUserInfo(function (data) {
				if (data.code !== 200) {
					window.location.href = constant.url.LOGIN;
					return;
				}
				console.log(data);
				//开始调用保持在线
				setInterval(remote.refreshToken, constant.remote.KEEP_ALIVE_TIME_MS);

				//将user_info保存到wiz上下文
				context.userInfo = data.user_info;
				//首先加载为私人库
				context.kbGuid = data.user_info.kb_guid;
				//顶部功能初始化
				headCtrl.init(data.user_info, messageHandler);
				//
				//搜索栏初始化
				searchBoxCtrl.init(messageHandler);
				//左侧树初始化
				treeCtrl.init('leftTree', messageHandler);

				//初始化中间文档列表
				listCtrl.init(messageHandler);

				
				remote.getGroupKbList(function (data) {
					if (data.code === 200) {
						groupCtrl.init(data.list, messageHandler);
					}
				});

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
		rightSplitter.init({left: 'doc_list_containner_wrapper', right: 'doc_read_area', 'splitter': 'content_splitter'});
	}

	//显示文档列表
	function requestDocList(params) {
		var callback = function (data) {
			if (data.code == '200' && data.list) {
				listCtrl.show(data.list);
			}
		};
		var callError = function (error) {
			var errorMsg = 'GlobalController.requestDocList() Error: ' + error;
			if (console) {
				console.error(errorMsg);
				console.log(error);
			} else {
				alert(errorMsg);
			}
		};
		remote.getDocumentList(context.kbGuid, params, callback, callError);
	}

	function requestDocumentBody(doc) {
		_curDoc = doc;
		var callback = function (data) {
			if (data.code === 200) {
				//成功获取内容后，开始加载右侧内容
				docViewCtrl.viewDoc(_curDoc);
			} else {
				alert('Get Document Body Error!');
			}
			console.log(data);
		};
		var callError = function (error) {
			console.error(error);
		}
		remote.getDocumentBody(context.kbGuid, doc.document_guid, doc.version, callback, callError);
	}


	return {
		init: init
	};
});