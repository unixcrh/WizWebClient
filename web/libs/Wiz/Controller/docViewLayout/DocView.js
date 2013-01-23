define(["./FrameController", "/web/locale/main"], function (require, exports, module) {
	'use strict';

	var FrameCtrl = require('./FrameController'),
			attachmentCtrl = new $.fn.scrollbar(),
			_locale = require('/web/locale/main'),
			_readFrameId = 'wiz_doc_iframe',
			_curDoc = null,
			// 保存jQuery选择器关键字
			_id = {
				title: 'doc_params_title',
				readFrameCt: 'read_frame_ct',
				docParam: 'doc_params',
				attachmentContainer: 'att_container'
			},
			_helpPage = {
				loading: _locale.HelpPage.loading,
				protected: _locale.HelpPage.protected,
				welcome: _locale.HelpPage.welcome,
				welcomeTitle: _locale.HelpPage.welcomeTitle
			},
			_className = {
				noDisplay: 'no-display'
			},
			titleJqElem = $( '#' + _id.title),
			_messageCenter = null,
			_attContainerElem = null;

	function DocView() {

		var readFrameCtrl = null;
		function initMessageCenter(messageCenter) {
			_messageCenter = messageCenter;
			readFrameCtrl = new FrameCtrl(_readFrameId);
			initAttachmentCtrl();
		}

		function initAttachmentCtrl() {
			_attContainerElem = document.getElementById(_id.attachmentContainer);
			var config = {
				containerElem: _attContainerElem,
				overlayText:  _locale.AttachmentArea.OverlayText,
				showOverlay: true,
				contentId: 'read_attachment_list_wrap'
			};
			attachmentCtrl.init(config);
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
				if (attachmentCtrl !== null) {
					attachmentCtrl.reset();
				}
				showAttachmentContainer();
			} else {
				hideAttachmentContainer();
			}
		}

		function showAttachmentContainer() {
			$(_attContainerElem).removeClass(_className.noDisplay);
			if (attachmentCtrl !== null) {
				attachmentCtrl.show();
			}
		}

		function hideAttachmentContainer() {
			$(_attContainerElem).addClass(_className.noDisplay);
			if (attachmentCtrl !== null) {
				attachmentCtrl.hide();
			}
		}


		function showAttachments(attList) {
			showAttachmentContainer();
			var listLenght = attList.length,
				title = listLenght + _locale.AttachmentArea.HeaderTitle;

			for (var i=0; i<listLenght; i++) {
				// TODO 其他解决异步触发的办法
				attList[i].linkHref = attList[i].download_url;
				attList[i].name = attList[i].attachment_name;
			}
			attachmentCtrl.setTitle(title);
			attachmentCtrl.setItemList(attList);
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

		function showLoading(hasAtts) {
			showHelpPage('loading');
			hideAttachmentContainer();
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
			showAttachments: showAttachments
		}
	}


	module.exports = new DocView();
});