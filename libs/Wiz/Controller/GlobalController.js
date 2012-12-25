/**
 * 全局的控制器，转发请求到相应的独立控制器中
 */

define(["../../common/util/GlobalUtil","../context","../constant","../remote","./leftTreeLayout/ztreeController","./leftTreeLayout/searchBoxController","./doclistLayout/Controller","./headLayout/groupEntryController","./headLayout/headController","./docViewLayout/DocView","./editLayout/EditController","../../component/Splitter"], function (require, exports, module) {
	'use strict';

	// 暴露给全局变量window，方便其他第三方组件的调用
	window.Wiz = window.Wiz || {};

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
			// 保存当前阅读的文档
			_curDoc = null,
			// 缓存标签信息的对象key为tag_guid，value为name
			_tagsMap = {},
			// 缓存当前的查询条件
			_requestCmdParams = {},

			notification = new Notification(document.getElementById('content_right_wrapper')),
			//负责接收下级controller的消息
			_messageHandler = {
				showSetting: function( url) {
					window.open(url + '?t=' + context.token);
				},
				// 显示文档列表
				requestDocList: function (params) {
					// 清空当前文档列表
					_requestCmdParams.docList = params;
					remote.getDocumentList(context.kbGuid, params, _messageDistribute.showDocList, handlerJqueryAjaxError);
				},
				// 加载文档内容
				requestDocumentBody: function (doc) {
					// 记录当前显示的文档信息
					_curDoc = doc;
					// 切换文档时，首先显示加载中页面，并隐藏编辑按钮
					docViewCtrl.showLoading();
					headCtrl.showCreateBtnGroup();
					remote.getDocumentBody(context.kbGuid, doc.document_guid, doc.version, _messageDistribute.showDoc, handlerJqueryAjaxError);
				},
				// 所有请求创建的处理
				// 需要callback函数，自动处理相应的节点
				requestCreateItem: function(name, type, callback) {
					if (type === 'category') {
						remote.createCategory(context.kbGuid, name, function(data) {
							if (data.code == 200) {
								callback(data);
							} else {
								notification.callError(data.message);
							}
						}, handlerJqueryAjaxError);	
					}
				},
				// 阅读和编辑页面切换
				// TODO  category应该直接传入一个document对象模型
				switchEditMode: function (bEditMode, bNew) {
					// 先加载文档内容
					if (!bNew && _curDoc) {
						_curDoc.document_body = docViewCtrl.getCurDocHtml();
					}
					var docInfo = _curDoc;
					// 新建文档，非编辑
					if (bNew === true) {
						// 新文档，把docInfo清空
						docInfo = {};
						var documentGuid = '';//GlobalUtil.genGuid();
						// 暂时屏蔽 lsl 2012-12-19
						// docInfo.document_guid = documentGuid;
						docInfo.document_location = treeCtrl.getCurrentCategory();
						// _curDoc = docInfo;
						// lsl 2012-12-19
						// 开放上传图片时，打开该部分请求，暂时屏蔽
						// remote.createTempDocument(context.kbGuid, docInfo, function(data) {
						// 	if (data.code != '200') {
							// notification.showError(data.message);
						// 		console.error('GlobalController.switchEditMode() request createTempDocument Error: ' + data.return_msg);
						// 	}
						// }, handlerJqueryAjaxError);
					}
					window.Wiz.curDoc = docInfo;
					// 最后设置全局变量的值 lsl-2012-12-19
					if (bEditMode) {
						docInfo.displayLocation = treeCtrl.changeSpecilaLocation(docInfo.document_location);
						$('#resize_container').hide();
						$('#resize_container').addClass('hidden');
						$('#edit_page').show();
						$('#edit_page').removeClass('hidden');
						editPageCtrl.show(docInfo, bNew);
					} else {
						$('#edit_page').hide();
						$('#edit_page').addClass('hidden');
						$('#resize_container').show();
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
					// 必须从编辑页面获取文档的具体信息
					// 不能使用_curDoc  lsl 2012-12-19
					var docInfo = editPageCtrl.getDocumentInfo();
					// 取到的docInfo为null，则说明校验失败
					if (docInfo === null) {
						return;
					}
					// 显示正在保存的文字提示
					editPageCtrl.nowSaving();
					if (bQuit) {
						headCtrl.showSendingGroup();
					}
					remote.postDocument(context.kbGuid, docInfo, function callback(data) {
						_messageDistribute.saveDocumentCallback(data, bQuit, docInfo);
					}, function callError(error) {
						if (bQuit) {
							headCtrl.showEditBtnGroup();
						}
					}, bQuit);
				},
				getNodesInfo: function(key) {
					return context[key];
				},
				/**
				 * 刷新当前的文档列表，_requestCmdParams缓存
				 * 主要用于保存后，点取消
				 * @return {[type]} [description]
				 */
				refreshCurDocList: function() {
					remote.getDocumentList(context.kbGuid, _requestCmdParams.docList, _messageDistribute.showDocList, handlerJqueryAjaxError);
				},
				saveNodesInfos: function(key, list) {
					context[key] = list;
				},
				getChildNodes: function(treeNode, callback) {
					var innerCallback = function(data) {
						if (data.code == 200) {
							callback(data);
						} else {
							notification.callError(data.message);
						}
					};
					if ('category' === treeNode.type) {
						remote.getChildCategory(context.kbGuid, treeNode.location, innerCallback, handlerJqueryAjaxError);
					} else if ('tag' === treeNode.type) {
						//获取父标签的GUID，如果没有，则设为''
						var parentTagGuid = treeNode.tag_guid ? treeNode.tag_guid : '';
						remote.getChildTag(context.kbGuid, parentTagGuid, innerCallback, handlerJqueryAjaxError);

					} else if ('group' === treeNode.type) {
						remote.getGroupKbList(innerCallback, handlerJqueryAjaxError);
					}
				},
				getTagName: function (tagGuid) {
					// 如果当前的map中没有该tagGuid，则直接显示该标签的guid
					var tagName = tagGuid;
					if (_tagsMap[tagGuid]) {
						tagName = _tagsMap[tagGuid];
					}
					return tagName;
				}
			},
			// 负责向各控制器发送消息
			_messageDistribute = {
				showDocList: function (data) {
					// 首次加载，默认选择文档第一项
					if (data.code == '200') {
						listCtrl.show(data.list, _bFirst);
						// 新用户
						if (data.list.length < 1) {
							docViewCtrl.showWelcomePage();
						}
					} else {
						// TODO 错误处理
						notification.showError(data.message);
					}
					// _bFirst = false;
				},
				showDoc: function (data) {
					if (data.code === 200) {
						//成功获取内容后，开始加载右侧内容
						_curDoc.url = docViewCtrl.viewDoc(_curDoc);
						headCtrl.showReadBtnGroup();
					} else {
						// 加密文档的特殊处理
						if (data.code === 500 && _curDoc.document_protect > 0) {
							docViewCtrl.viewDoc(_curDoc);
							headCtrl.showCreateBtnGroup();
						} else {
							notification.showError(data.message);
						}
					}
				},
				saveDocumentCallback: function(data, bQuit, docInfo) {
					if (data.code == '200') {
						editPageCtrl.saveCallback(data.document_guid);
						if (bQuit) {
							headCtrl.showCreateBtnGroup();
							_messageHandler.switchEditMode();
							treeCtrl.selectNode('location', docInfo.document_category);
						}
					} else {
						// TODO错误处理
						notification.showError(data.message);
					}
				}
			}

			_curDoc = null;


	

	//整个页面的初始化
	function init() {
		// 获取url中的token
		// var token = GlobalUtil.getUrlParam('t');
		// if (!token || typeof token !== 'string') {
		// 	document.location.replace(constant.url.LOGIN);
		// } else {
			context.token = $.cookie('token');
			context.debug = $.cookie('debug_model');
			// $.cookie('token', token);
			// $.cookie('debug_model', context.debug);

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
				// 初始化标签列表，方便查看文档时，显示标签名称
				initTagsMap();
				//顶部功能初始化
				headCtrl.init(data.user_info, _messageHandler);

				window.Wiz.token = context.token;
				window.Wiz.kbGuid = context.kbGuid;
				//
				//搜索栏初始化
				searchBoxCtrl.init(_messageHandler);
				//左侧树初始化
				treeCtrl.init('leftTree', _messageHandler);

				//初始化中间文档列表
				listCtrl.init(_messageHandler);
				editPageCtrl.initMessageHandler(_messageHandler);

					//初始化滚动条
				initSplitter();
				initBodyClickHandler();
			}, function (err) {
				//错误处理
			});
		// }
	}

	function initSplitter() {
		//初始化Splitter
		var Splitter = require('../../component/Splitter');
		var leftSplitter = new Splitter();
		var rightSplitter = new Splitter();
		leftSplitter.init({left: 'leftTree_container', right: 'content_container', 'splitter': 'left_splitter'});
		rightSplitter.init({left: 'doc_list_containner_wrapper', right: 'doc_read_area', 'splitter': 'content_splitter'});
	}

	
	function initTagsMap() {
		remote.getAllTag(context.kbGuid, function (data) {
			if (data.code == '200') {
				// 缓存当前的tagList信息
				var length = data.list.length;
				for (var i=0; i<length; i++) {
					var tag = data.list[i];
					_tagsMap[tag.tag_guid] = tag.tag_name;
				}
			}
		});
	}

	/**
	 * 所有调用ajax请求的错误回调处理
	 * @param  {[type]} jqXHR  [description]
	 * @param  {[type]} status [description]
	 * @param  {[type]} error  [description]
	 * @return {[type]}        [description]
	 */
	function handlerJqueryAjaxError(jqXHR, status, error) {
		if (notification === null) {
			notification = new Notification(document.getElementById('content_right_wrapper'));
		}
		var errorMsg = '';
		if (error && typeof error === 'string') {
			errorMsg = error;
		} else if ( jqXHR && typeof jqXHR === 'string') {
			errorMsg = jqXHR;
		} else {
			errorMsg = 'unknown ajax error';
		}
		notification.showError(error);
	}


	function initBodyClickHandler() {
		// 隐藏下拉菜单
	  $(document).click(function(event){
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
	}

	function Notification(belowContainer) {
		this._container = document.getElementById('notification_container');
		this._imgElem = document.getElementById('notification_img');
		this._msgElem = document.getElementById('notification_msg');
		this._belowContainer = belowContainer;
	}

	Notification.prototype.showError = function(msg) {
		this._msgElem.innerText = msg;
		this.show();
	};
	Notification.prototype.showAlert = function(msg) {
		this._msgElem.innerText = msg;
		this.show();
		// 显示alert信息,只显示5秒
		setTimeout(function() {
			this.hide();
		}, 5000);
	};
	Notification.prototype.show = function() {
		this._container.style.display = 'block';
		this._belowContainer.style.top = '40px';
	};
	Notification.prototype.hide = function() {
		this._container.style.display = 'none';
		this._belowContainer.style.top = '0px';
	};

	return {
		init: init
	};
});