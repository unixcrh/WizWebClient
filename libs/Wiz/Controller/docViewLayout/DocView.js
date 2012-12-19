define(function (require, exports, module) {
	'use strict';

	var FrameCtrl = require('./FrameController'),
			_readFrameId = 'wiz_doc_iframe',
			_curDoc = null,
			// 保存jQuery选择器关键字
			_selector = {
				title: 'doc_params_title'
			},
			titleElem = document.getElementById(_selector.title);

	function DocView() {
		//初始化
		var readFrameCtrl = new FrameCtrl(_readFrameId);

		function viewDoc(doc) {
			_curDoc = doc;
			//显示标题
			titleElem.innerText = doc.document_title;
			// 显示内容
			// readFrameCtrl.setHTML(doc.document_body);
			var path = 'http://' + document.domain + '/unzip/' + doc.kb_guid + '/' + doc.document_guid + '.' + doc.version;
			var url = path +  '/index.html';
			readFrameCtrl.setUrl(url);
			return url;
		}

		function getCurDocHtml() {
			var docHtml = readFrameCtrl.getHTML();
			return docHtml;
		}


		return {
			viewDoc: viewDoc,
			getCurDocHtml: getCurDocHtml
		}
	}


	module.exports = new DocView();
});