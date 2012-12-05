define(function (require, exports, module) {
	'use strict';

	var _messageCenter = null,
			constant = require('Wiz/constant'),
			_locale = require('locale'),
			_node = {
				userInfoId: 'user_info',
				userNameId: 'user_name',
				userMenuId: 'user_menu',
				id: {
					createSpan: 'create_note',
					createBtn: 'create_doc_ct',
					saveSpan: 'save',
					saveBtn: 'save_ct',
					cancelSpan: 'cancel',
					cancelBtn: 'cancel_ct',
					saveAndQuitSpan: 'save_and_quit',
					saveAndQuitBtn: 'save_and_quit_ct'
				}
			},
			_data = {
				_userInfo: null
			},
			_view = {
				showUser: function(userInfo) {
					var nameSelector = getJqIdSelector(_node.userNameId);
					nameSelector.html(userInfo.user.displayname);
				},
				initFillContent: function() {
					var signOutValue = _locale.UserSetting.singOut,
							signOutElem = $('#user_menu li a span');
					signOutElem.html(signOutValue);
					// 已经成功登陆后再开始加载
					_view.localizeOperateList();
				},
				// 本地化相应的操作列表
				localizeOperateList: function() {
					$('#' + _node.id.createSpan).html(_locale.HeadMenuForDoc.Create);
					$('#' + _node.id.saveSpan).html(_locale.HeadMenuForDoc.Save);
					$('#' + _node.id.cancelSpan).html(_locale.HeadMenuForDoc.Cancel);
					$('#' + _node.id.saveAndQuitSpan).html(_locale.HeadMenuForDoc.SaveAndQuit);
				}
			},
			_event = {
				init: function() {
					_event.initOperateListHandler();
					_event.initUserHandler();
				},
				// 初始化所有操作列表的注册事件
				// TODO 需要完善，如何解耦
				initOperateListHandler: function() {
					// 每个都需要先显示，然后再注册事件
					var createBtn = $('#' + _node.id.createBtn);
					createBtn.removeClass('hidden');
					createBtn.bind('click', function(){
						_messageCenter.switchEditMode(true);
						createBtn.addClass('hidden');
						createBtn.parent().css('display', 'none');
						cancelBtn.removeClass('hidden');
						cancelBtn.parent().css('display', 'inline-block');
						saveBtn.removeClass('hidden');
						saveBtn.parent().css('display', 'inline-block');
						saveAndQuitBtn.removeClass('hidden');
						saveAndQuitBtn.parent().css('display', 'inline-block');
					});

					var cancelBtn = $('#' + _node.id.cancelBtn);
					var saveBtn = $('#' + _node.id.saveBtn);
					var saveAndQuitBtn = $('#' + _node.id.saveAndQuitBtn);
					cancelBtn.bind('click', function(){
						_messageCenter.switchEditMode(false);
						cancelBtn.addClass('hidden');
						cancelBtn.parent().css('display', 'none');
						saveBtn.addClass('hidden');
						saveBtn.parent().css('display', 'none');
						saveAndQuitBtn.addClass('hidden');
						saveAndQuitBtn.parent().css('display', 'none');
						createBtn.removeClass('hidden');
						createBtn.parent().css('display', 'inline-block');
					});
				},
				// 初始化用户操作的注册事件
				initUserHandler: function() {
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

							var return_url = constant.url.LOGIN; //自身url
							var encode_return_url = encodeURIComponent(return_url);
							window.location.href = constant.url.LOGOFF + encode_return_url;
							
							// ie6下无反应
						}
					}
				}
			},
			// 使用状态机来控制顶部操作列表的显示
			_state = {

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
		_view.initFillContent();
		_event.init();
	}
	return {
		init: init
	}
});