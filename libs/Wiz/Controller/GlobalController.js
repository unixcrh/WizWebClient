/**
 * 全局的控制器，转发请求到相应的独立控制器中
 */

define(function (require, exports, module) {
	var GlobalUtil = require('../../common/util/GlobalUtil'),
			context = require('../context'),
			constant = require('../constant'),
			remote = require('../remote'),

			treeCtrl = require('./leftTreeLayout/ztreeController'),
			searchBoxCtrl = require('./leftTreeLayout/searchBoxController'),
			listCtrl = require('./doclistLayout/Controller'),
			groupCtrl = require('./headLayout/groupEntryController'),
			headCtrl = require('./headLayout/headController'),
			docViewCtrl = require('./docViewLayout/DocView'),
			editPageCtrl = require('./editLayout/EditController'),

			// 判断首次加载页面，增加首次加载时默认初始化功能
			_bFirst = true,

			//负责接收下级controller的消息
			_messageHandler = {
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
					remote.getDocumentList(context.kbGuid, params, _messageDistribute.showDocList, callError);
				},
				// 加载文档内容
				requestDocumentBody: function (doc) {
					// 记录当前显示的文档信息
					_curDoc = doc;
					var callError = function (error) {
						console.error(error);
					}
					remote.getDocumentBody(context.kbGuid, doc.document_guid, doc.version, _messageDistribute.showDoc, callError);
				},
				// 所有请求创建的处理
				// 需要callback函数，自动处理相应的节点
				requestCreateItem: function(name, type, callback) {
					if (type === 'category') {
						remote.createCategory(context.kbGuid, name, callback);	
					}
				},
				// 阅读和编辑页面切换
				// TODO  category应该直接传入一个document对象模型
				switchEditMode: function (bEditMode) {
					if (bEditMode) {
						$('#resize_container').addClass('hidden');
						$('#edit_page').removeClass('hidden');
						editPageCtrl.show(treeCtrl.getCurrentCategory());
					} else {
						$('#edit_page').addClass('hidden');
						$('#resize_container').removeClass('hidden');
					}
				},
				/**
				 * 
				 * 保存文档
				 * @param  {boolean} bQuit 保存成功后是否退出
				 * @param  {Function} callback 回调函数
				 * @return {[type]}            [description]
				 */
				saveDocument: function (bQuit) {
					var docInfo = editPageCtrl.getDocumentInfo();
					// 取到的docInfo为null，则说明校验失败
					if (docInfo === null) {
						return;
					}
					// 显示正在保存的文字提示
					editPageCtrl.nowSaving();
					remote.postDocument(context.kbGuid, docInfo, function(data) {
						_messageDistribute.saveDocumentCallback(data, bQuit);
					});
				}
			},
			// 负责向各控制器发送消息
			_messageDistribute = {
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
				},
				saveDocumentCallback: function(data, bQuit) {
					if (data.code == '200') {
						editPageCtrl.saveCallback(data.document_guid);
					} else {

					}
				}
			}

			_curDoc = null;


	//整个页面的初始化
	function init() {
		var token = GlobalUtil.getUrlParam('t');
		if (!token || typeof token !== 'string') {
			document.location.replace(constant.url.LOGIN);
		} else {
			context.token = token;
			context.debug = GlobalUtil.getUrlParam('debug');

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
				headCtrl.init(data.user_info, _messageHandler);
				//
				//搜索栏初始化
				searchBoxCtrl.init(_messageHandler);
				//左侧树初始化
				treeCtrl.init('leftTree', _messageHandler);

				//初始化中间文档列表
				listCtrl.init(_messageHandler);

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

	


	// 隐藏下拉菜单
  $(document).click(function(event){
  	var targetId = $(event.target).attr("id");
  	var menuList = $('.wiz-menu');
  	var length = menuList.length;
  	var id = null;

  	var obj = {
  		'sort_menu': 'sort_list',
  		'user_info': 'user_menu'
  	}
  	if($(event.target).parents('#sort_menu')[0]) {
  		id = 'sort_menu';
  	}
  	if($(event.target).parents('#user_info')[0]) {
  		id = 'user_info';
  	}
  	for (var i=0; i<length; i ++) {
	    if(obj[id] != $(menuList[i])[0].id){
	    	$(menuList[i]).css('visibility', 'hidden');
	    }
  	}
  });

	return {
		init: init
	};
});