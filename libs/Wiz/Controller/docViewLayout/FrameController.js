define(function (require, exports, module) {
	'use strict';
	var GlobalUtil = require('../../../common/util/GlobalUtil');
	var FrameController = function (id) {

		var _frameObj = document.getElementById(id);


		initHandler();

		function initHandler() {
			_frameObj.onload = function () {
				resizeFrameContainer(_frameObj);
			};
		}

		// 点击iframe时，触发document.body.click事件
		function initFrameBodyClickHandler() {
			var fdoc = getFrameDocument();
			var oldFunc = fdoc.body.onclick;
			fdoc.body.onclick = function (event) {
				GlobalUtil.fireEvent(document.body, 'click');
				if (oldFunc) {
					oldFunc(event);
				}
			}
		}

		function getFrameDocument() {
			var fdoc = (_frameObj.contentDocument) ? _frameObj.contentDocument
					: _frameObj.contentWindow.document;//兼容firefox和ie
			return fdoc;
		}
		/**
		 * 调整
		 * @param  {[type]} iframe [description]
		 * @return {[type]}        [description]
		 */
		function resizeFrameContainer(iframe){
			console.log('iframe resize');
	    if (iframe) {
				var fdoc = getFrameDocument(),
						fDocElem = fdoc.documentElement,
	    			parentStyle = iframe.parentElement.style;
	      if (fdoc && fDocElem.scrollHeight && fDocElem.scrollWidth) {
	      	//首先清空
	      	parentStyle.height = parentStyle.width = '';
	        parentStyle.height = fDocElem.scrollHeight + 20 + 'px'; 
	        parentStyle.width = fDocElem.scrollWidth + 20 + 'px';
	      }
	    }
			initFrameBodyClickHandler();
		}

		function setURL(url) {
			_frameObj.src = url;
		}

		function getHTML() {
			var fdoc = getFrameDocument();
			return fdoc.body.innerHTML;
		}

		return {
			setUrl: setURL,
			getHTML: getHTML
		}
	}

	module.exports = FrameController;

});