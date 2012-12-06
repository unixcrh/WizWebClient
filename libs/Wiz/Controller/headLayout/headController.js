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
			_stateMachine = null,
			_createOnlyCtrl = null,
			_docReadCtrl = null,
			_docEditCtrl = null,
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
					this.initOperateListHandler();
					this.initUserHandler();
					this.initStateControll();
				},
				// 初始化所有操作列表的注册事件
				// TODO 需要完善，如何解耦
				initOperateListHandler: function() {
					// 每个都需要先显示，然后再注册事件
					var createBtn = $('#' + _node.id.createBtn);
					createBtn.removeClass('hidden');
					createBtn.bind('click', function(){
						_messageCenter.switchEditMode(true);
						_docEditCtrl.active();
					});

					var cancelBtn = $('#' + _node.id.cancelBtn);
					var saveBtn = $('#' + _node.id.saveBtn);
					var saveAndQuitBtn = $('#' + _node.id.saveAndQuitBtn);
					cancelBtn.bind('click', function(){
						_messageCenter.switchEditMode(false);
						_docReadCtrl.active();
					});
					saveBtn.bind('click', function() {
						_messageCenter.saveDocument(false);
					});
					saveAndQuitBtn.bind('click', function() {
						_messageCenter.saveDocument(true);
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
				},
				// 初始化状态机
				initStateControll: function() {
					_stateMachine = new StateMachine();
					_createOnlyCtrl = new StateControl([_node.id.createBtn]);
					// 选中文档列表中文档后，显示的操作
					_docReadCtrl = new StateControl([_node.id.createBtn]);
					// 编辑、新建文档时，显示的操作
					_docEditCtrl = new StateControl([_node.id.saveBtn, _node.id.saveAndQuitBtn, _node.id.cancelBtn]);
					_stateMachine.add(_createOnlyCtrl);
					_stateMachine.add(_docReadCtrl);
					_stateMachine.add(_docEditCtrl);
				}
			};



	// 状态控制器
	var StateControl = function(idList){
		var _elemList = [];
		init(idList);

		function init(idList) {
			var length = idList.length;
			if (length > 0) {
				for (var index = 0; index < length; index ++) {
					_elemList.push(getJqIdSelector(idList[index]));
				}
			}
		};
		function activate() {
			var length = _elemList.length;
			for (var index = 0; index < length; index ++ ) {
				$(_elemList[index]).removeClass('hidden');
				$(_elemList[index]).parent().removeClass('no-display');
			}
		};
		function deactivate() {
			var length = _elemList.length;
			for (var index = 0; index < length; index ++ ) {
				$(_elemList[index]).addClass('hidden');
				$(_elemList[index]).parent().addClass('no-display');
			}
		};

		return{
			activate: activate,
			deactivate: deactivate
		}
	};

	// https://github.com/maccman/book-assets/blob/master/ch04/state_machine.html
	// 封装jQuery的绑定和触发事件函数
	var Events = {
    bind: function(){
      if ( !this.o ) this.o = $({});
      this.o.bind.apply(this.o, arguments);
    },
    
    trigger: function(){
      if ( !this.o ) this.o = $({});
      this.o.trigger.apply(this.o, arguments);
    }
  };
  
  // 状态机类、用来控制顶部按钮组的显示
  var StateMachine = function(){};
  StateMachine.fn  = StateMachine.prototype;
  $.extend(StateMachine.fn, Events);
  
  StateMachine.fn.add = function(controller){
    this.bind("change", function(e, current){
      if (controller === current) {
        controller.activate();
      }
      else {
        controller.deactivate();	
      }
    });
    
    controller.active = $.proxy(function(){
      this.trigger("change", controller);
    }, this);
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