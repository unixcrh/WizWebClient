define(function (require, exporst, module) {
	var _id = {
		CategorySpan: 'params_category',
		EditorCt: 'wiz_edit_area',
		TitleInput: 'title_input',
		SaveTipDiv: 'save_tip',
		CategoryTree: 'category_tree'
	},
		zTreeBase = require('../../../component/zTreeBase'),
		remote = require('../../remote'),
			context = require('../../context'),

		_lastGuid = null,
		_locale = require('locale'),
		_defaultLocation = _locale,
		_editor = null,
		_docInfo = {},
		_messageCenter = null,
		_treeObj = null;

	function EditController () {

		initEditor();

		function show(categoryObj) {
			// TODO动态加载编辑器的script
			if (typeof categoryObj.location === 'string' && typeof categoryObj.localeLocation === 'string'&& categoryObj.location.length > 2) {
				_docInfo.category = categoryObj.location;
				$('#' + _id.CategorySpan).html(categoryObj.localeLocation);
			} else {
				_docInfo.category = '/My Notes/';
				$('#' + _id.CategorySpan).html('/我的笔记/');
			}
			if (_editor !== null) {
				_editor.setContent('');
			}
			_lastGuid = null;
			$('#' + _id.SaveTipDiv).html('');
			$('#' + _id.TitleInput).val('');
			if (_treeObj === null) {
				initCateSpanHandler();
			}
		};

		function initEditor() {
	    _editor = new UE.ui.Editor();
	    _editor.render(_id.EditorCt);
		}

		function initTree() {
			var setting = zTreeBase.getDefaultSetting(),
					zTreeNodes = _messageCenter.getNodesInfo('category');
			setting.callback = {
				onClick : zTreeOnClick,
				onExpand: zTreeOnExpand,
				beforeRename: zTreeBeforeRename
			};
			_treeObj =  $.fn.zTree.init($("#category_tree"), setting, zTreeNodes);
			var treeElem = $('#category_tree');
			treeElem.hover(function () {
				if (!treeElem.hasClass("showIcon")) {
					treeElem.fadeIn().addClass("showIcon");
				}
			}, function() {
				treeElem.removeClass("showIcon");
			});
		}

		function zTreeBeforeRename(treeId, treeNode, newName) {

			if(zTreeBase.checkNewName(newName) === false) {
				return;
			}
			// 新建目录
			var location = '/' + newName + '/';
			treeNode.location = location;
			_messageCenter.requestCreateItem(newName, treeNode.type, function (data) {
				if (data.code != '200') {
					// 创建失败，删除该节点
					// TODO 提示
					treeObj.removeNode(treeNode, false);
				} else {
					treeObj.updateNode(treeNode);
				}
			});
			return true;
		}

		function zTreeOnClick(event, treeId, treeNode) {
			var nodeLocation = treeNode.location,
				displayLocation = treeNode.displayLocation;
			_docInfo.category = nodeLocation;
			$('#' + _id.CategorySpan).html(displayLocation);
			$("#category_tree").hide(500);
		}

		function zTreeOnExpand(event, treeId, treeNode) {
			//bLoading参数为了防止多次加载同一数据
 			if (treeNode.bLoading) {
 				return;
 			}
 			zTreeBase.loadingNode(treeNode);
			//获取到当前的kb_guid
			_messageCenter.getChildNodes(treeNode, function(data) {
				zTreeBase.addChildToNode(_treeObj, data.list, treeNode);
			});
		}

		function initCateSpanHandler() {
			document.getElementById('params_category').onclick = function() {
			// 点击目录信息时再加载左侧树 
				if (_treeObj === null) {
					initTree();	
				}
				$('#category_tree').toggle(500);
			};
		}

		// 获取当前新建或编辑的文档信息及内容
		function getDocumentInfo() {
			var documentInfo ={};
			documentInfo.body = _editor.getAllHtml();
			documentInfo.category = _docInfo.category;
			documentInfo.title = $('#' + _id.TitleInput).val();
			if (_lastGuid) {
				documentInfo.guid = _lastGuid;
			}
			if (documentInfo.title === '' || documentInfo.title.length < 0) {
				// TODO 提示
				return null;
			}
			return documentInfo;
		}

		// 正在保存
		function nowSaving() {
			var savingMsg = _locale.EditPage.Saving;
			$('#' + _id.SaveTipDiv).html(savingMsg);
		}

		// 单击保存按钮后，回调方法
		function saveCallback(docGuid) {
			if (_lastGuid === null) {
				_lastGuid = docGuid;
			}
			var savedMsg = _locale.EditPage.Saved;
			var curTime = getCurTime();
			var msg = savedMsg.replace('{time}', curTime);
			$('#' + _id.SaveTipDiv).html(msg);
		}

		function getCurTime() {
			var curDate = new Date();
			var hours = curDate.getHours();
			var minutes = curDate.getMinutes();
			var timeStr = '';
			if (minutes < 10) {
				timeStr = hours + ':0' + minutes; 
			} else {
				timeStr = hours + ':' + minutes; 	
			}
			return timeStr;
		}

		function initMessageHandler(messageHandler) {
			_messageCenter = messageHandler;
		}

		return {
			show: show,
			getDocumentInfo: getDocumentInfo,
			nowSaving: nowSaving,
			saveCallback: saveCallback,
			initMessageHandler: initMessageHandler
		}
	 }

	module.exports = new EditController();
});