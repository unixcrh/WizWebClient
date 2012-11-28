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

			// 判断首次加载页面，增加首次加载时默认初始化功能
			_bFirst = true,

			//负责接收下级controller的消息
			messageHandler = {
				// 显示文档列表
				requestDocList: function (params) {
					// 清空当前文档列表
					
					var callError = function (error) {
						var errorMsg = 'GlobalController.requestDocList() Error: ' + error;
						if (console) {
							console.error(errorMsg);
							console.log(error);
						} else {
							alert(errorMsg);
						}
					};
					remote.getDocumentList(context.kbGuid, params, messageDistribute.showDocList, callError);
				},
				// 加载文档内容
				requestDocumentBody: function (doc) {
					// 记录当前显示的文档信息
					_curDoc = doc;
					var callError = function (error) {
						console.error(error);
					}
					remote.getDocumentBody(context.kbGuid, doc.document_guid, doc.version, messageDistribute.showDoc, callError);
				},
				// 所有请求创建的处理
				// 需要callback函数，自动处理相应的节点
				requestCreateItem: function(name, type, callback) {
					if (type === 'category') {
						remote.createCategory(context.kbGuid, name, callback);	
					}
				}
			},
			// 负责向各控制器发送消息
			messageDistribute = {
				showDocList: function (data) {
					// 首次加载，默认选择文档第一项
					if (data.code == '200') {
						listCtrl.show(data.list, _bFirst);
					} else {
						// TODO 错误处理
					}
					_bFirst = false;
				},
				showDoc: function (data) {
					if (data.code === 200) {
						//成功获取内容后，开始加载右侧内容
						docViewCtrl.viewDoc(_curDoc);
					} else {
						console.error('Get Document Body Error!');
						console.error(data);
					}
				}
			}

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

				// v1暂时不上群组功能
				// remote.getGroupKbList(function (data) {
				// 	if (data.code === 200) {
				// 		groupCtrl.init(data.list, messageHandler);
				// 	}
				// });

				//右侧内容初始化

				//初始化滚动条
				initSplitter();
			}, function (err) {
				//错误处理
			});
		}
	}

	// 初始化页面，自动选择左侧树和文档列表首项
	function initSelect() {

	}


	function initSplitter() {
		//初始化Splitter
		var Splitter = require('component/Splitter');
		var leftSplitter = new Splitter();
		var rightSplitter = new Splitter();
		leftSplitter.init({left: 'leftTree_container', right: 'content_container', 'splitter': 'left_splitter'});
		rightSplitter.init({left: 'doc_list_containner_wrapper', right: 'doc_read_area', 'splitter': 'content_splitter'});
	}

	return {
		init: init
	};
});