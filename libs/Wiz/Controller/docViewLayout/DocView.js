define(function (require, exports, module) {

	var FrameCtrl = require('./FrameController'),
			_readFrameId = 'wiz_doc_iframe',
			_curDoc = null;

	function DocView() {
		//初始化
		var readFrameCtrl = new FrameCtrl(_readFrameId);

		function viewDoc(doc) {
			_curDoc = doc;

			console.log(doc.document_body);
			readFrameCtrl.setHTML(doc.document_body);
		}

		return {
			viewDoc: viewDoc
		}
	}


	module.exports = new DocView();
});