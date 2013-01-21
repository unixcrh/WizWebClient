define(["./FrameController", "/web/locale/main"], function (require, exports, module) {
	'use strict';

	var FrameCtrl = require('./FrameController'),
			attachmentCtrl = $.fn.scrollbar,
			_locale = require('/web/locale/main'),
			_readFrameId = 'wiz_doc_iframe',
			_curDoc = null,
			// 保存jQuery选择器关键字
			_id = {
				title: 'doc_params_title',
				readFrameCt: 'read_frame_ct',
				docParam: 'doc_params'
			},
			_helpPage = {
				loading: _locale.HelpPage.loading,
				protected: _locale.HelpPage.protected,
				welcome: _locale.HelpPage.welcome,
				welcomeTitle: _locale.HelpPage.welcomeTitle
			},
			titleJqElem = $( '#' + _id.title),
			_messageCenter = null;

	function DocView() {

		var readFrameCtrl = null;
		function initMessageCenter(messageCenter) {
			_messageCenter = messageCenter;
			readFrameCtrl = new FrameCtrl(_readFrameId);
			initAttachmentCtrl();
		}

		function initAttachmentCtrl() {
			var config = {
				linkElem: document.getElementById(_id.docParam)
			};
			attachmentCtrl.init(config);
		}

		//初始化

		// 帮助页面的初始化，主要是内容的显示
		function initHelpPage() {

		}

		function viewDoc(doc) {
			_curDoc = doc;
			if (doc === null) {
				reset();
				return;
			}
			//显示标题
			// lsl 2012-12-26 firefox中不能使用innerText
			titleJqElem.html(doc.document_title);
			if (doc.document_protect > 0) {
				showProtectedpage();
				return;
			}
			// 显示附件
			// 显示内容
			// lsl 2012-12-27 由于编码问题，不能直接显示index.html
			// 需要读取出body的内容并显示
			readFrameCtrl.setHTML(doc.document_body);
			if (doc.document_attachment_count > 0) {
				// TODO 显示加载中动画
				_messageCenter.requestAttachmentList(doc.document_guid);
				resizeFrameContainer();
			}
		}

		function resizeFrameContainer() {
			var readFrameCtElem = $('#' + _id.readFrameCt)
			var top = readFrameCtElem.css('top');
			top = top.substr(0, top.length -2);
			console.log('(' + top + '+' + 220 + ')');
			top = eval('(' + top + '+' + 220 + ')');
			readFrameCtElem.css({'top': top + 'px'});
		}

		function showAttachment(attList) {
			var listLenght = attList.length,
				title = listLenght + '个附件';

			for (var i=0; i<listLenght; i++) {
				(function(attGuid) {
					attList[i].onItemclick = function () {
						_messageCenter.downloadAttachment(attGuid);
					}
				})(attList[i].attachment_guid);
				
				attList[i].name = attList[i].attachment_name;
			}
			attachmentCtrl.setTitle(title);
			attachmentCtrl.setItemList(attList);
		}

		function hideAttachmentView() {

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
			showTitle(_helpPage.welcomeTitle);
			showHelpPage('welcome');
		}

		function showTitle(title) {
			titleJqElem.html(title);
		}

		/**
		 * 重置清空页面
		 * @return {[type]} [description]
		 */
		function reset() {
			_curDoc = null;
			titleJqElem.html('');
			readFrameCtrl.setHTML('');
		}

		return {
			viewDoc: viewDoc,
			getCurDocHtml: getCurDocHtml,
			showLoading: showLoading,
			showProtectedpage: showProtectedpage,
			showWelcomePage: showWelcomePage,
			showTitle: showTitle,
			reset: reset,
			init: initMessageCenter,
			showAttachment: showAttachment
		}
	}


	var AttachmentControl = function() {};
	AttachmentControl.prototype.docGuid = null;
	AttachmentControl.prototype.setDocGuid = function(docGuid) {
		this.docGuid = docGuid;
	};
	AttachmentControl.prototype.getList = function (docGuid) {
		if (typeof this.docGuid === 'string') {

		}
	};
	AttachmentControl.prototype.download = function(attGuid) {

	};


	module.exports = new DocView();
});