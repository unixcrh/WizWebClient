define(function (require, exports, module) {
	'use strict';

	var FrameController = function (id) {
		var _frameObj = document.getElementById(id);


		initHandler();

		function initHandler() {
			_frameObj.onload = function () {
				resizeFrameContainer(_frameObj);
			};
		};

		/**
		 * 调整
		 * @param  {[type]} iframe [description]
		 * @return {[type]}        [description]
		 */
		function resizeFrameContainer(iframe){
			console.log('iframe resize');
	    if (iframe) {
	    	var fDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document,//兼容firefox和ie
	    			fDocElem = fDoc.documentElement,
	    			parentStyle = iframe.parentElement.style;
	      if (fDoc && fDocElem.scrollHeight && fDocElem.scrollWidth) {
	      	//首先清空
	      	parentStyle.height = parentStyle.width = '';
	        parentStyle.height = fDocElem.scrollHeight + 20 + 'px'; 
	        parentStyle.width = fDocElem.scrollWidth + 20 + 'px';
	      }
	    }
		}

		function setURL(url) {
			var fdoc = (_frameObj.contentDocument) ? _frameObj.contentDocument
					: _frameObj.contentWindow.document;//兼容firefox和ie

			_frameObj.src = url;
		}

		function getHTML() {
			var fdoc = (_frameObj.contentDocument) ? _frameObj.contentDocument
					: _frameObj.contentWindow.document;//兼容firefox和ie
			return fdoc.body.innerHTML;
		}

		return {
			setUrl: setURL,
			getHTML: getHTML
		}
	}

	module.exports = FrameController;

});