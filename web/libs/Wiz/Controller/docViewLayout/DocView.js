define(["./FrameController", "/web/locale/main"], function (require, exports, module) {
	'use strict';

	var FrameCtrl = require('./FrameController'),
			_locale = require('/web/locale/main'),
			_readFrameId = 'wiz_doc_iframe',
			_curDoc = null,
			// 保存jQuery选择器关键字
			_selector = {
				title: 'doc_params_title'
			},
			_helpPage = {
				loading: _locale.HelpPage.loading,
				protected: _locale.HelpPage.protected,
				welcome: _locale.HelpPage.welcome	
			},
			titleJqElem = $( '#' + _selector.title);

	function DocView() {
		//初始化
		var readFrameCtrl = new FrameCtrl(_readFrameId);

		// 帮助页面的初始化，主要是内容的显示
		function initHelpPage() {

		}

		function viewDoc(doc) {
			_curDoc = doc;
			//显示标题
			// lsl 2012-12-26 firefox中不能使用innerText
			titleJqElem.html(doc.document_title);
			if (doc.document_protect > 0) {
				showProtectedpage();
				return;
			}
			// 显示内容
			// lsl 2012-12-27 由于编码问题，不能直接显示index.html
			// 需要读取出body的内容并显示
			readFrameCtrl.setHTML(doc.document_body);
			// var path = 'http://' + document.domain + '/unzip/' + doc.kb_guid + '/' + doc.document_guid + '.' + doc.version;
			// var url = path +  '/index.html';
			// readFrameCtrl.setUrl(url);
			// return url;
		}

		function getCurDocHtml() {
			var docHtml = readFrameCtrl.getHTML();
			return docHtml;
		}

		// 显示帮主页面
		function showHelpPage(type) {
			var bodyHtml = _helpPage[type];
			readFrameCtrl.setHTML(bodyHtml);
		}

		function showLoading() {
			showHelpPage('loading');
		}

		function showProtectedpage() {
			showHelpPage('protected');
		}

		function showWelcomePage() {
			showHelpPage('welcome');
		}

		function showTitle(title) {
			titleJqElem.html(title);
		}


		return {
			viewDoc: viewDoc,
			getCurDocHtml: getCurDocHtml,
			showLoading: showLoading,
			showProtectedpage: showProtectedpage,
			showWelcomePage: showWelcomePage,
			showTitle: showTitle
		}
	}


	module.exports = new DocView();
});