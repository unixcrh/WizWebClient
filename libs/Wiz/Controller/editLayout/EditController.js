define(function (require, exporst, module) {
	var _id = {
		CategorySpan: 'params_category',
		EditorCt: 'wiz_edit_area',
		TitleInput: 'title_input',
		SaveTipDiv: 'save_tip'
	},
		_lastGuid = null,
		_locale = require('locale'),
		_defaultLocation = _locale,
		_editor = null,
		_locale = require('locale'),
		_docInfo = {};

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
		};
		function initEditor() {
	    _editor = new UE.ui.Editor();
	    _editor.render(_id.EditorCt);	
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

		return {
			show: show,
			getDocumentInfo: getDocumentInfo,
			nowSaving: nowSaving,
			saveCallback: saveCallback
		}
	 }

	module.exports = new EditController();
});