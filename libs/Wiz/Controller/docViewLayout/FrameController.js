define(function (require, exports, module) {
	'use strict';
	function resize(iframe){
    if (iframe) {               
      if (iframe.contentDocument && iframe.contentDocument.body.offsetHeight) {
        iframe.parentElement.style.height = iframe.contentDocument.documentElement.scrollHeight+20 + 'px'; 
        iframe.parentElement.style.width = iframe.contentDocument.documentElement.scrollWidth + 20 + 'px';
      }
      else if (iframe.Document && iframe.Document.body.scrollHeight){
        iframe.parentElement.style.height = iframe.Document.documentElement.scrollHeight+20 + 'px';    
        iframe.parentElement.style.width = iframe.Document.documentElement.scrollWidth + 20 + 'px';               
      }
    }
	}

	function FrameController(id) {
		var _frameObj = document.getElementById(id);
		initHandler();

		function initHandler() {
			_frameObj.onload = function () {
				resize(_frameObj);
			};
		};

		function setHTML(htmlStr) {
			var fdoc = (_frameObj.contentDocument) ? _frameObj.contentDocument
					: _frameObj.contentWindow.document;//兼容firefox和ie

			fdoc.body.innerHTML = htmlStr;
			// fdoc.open("text/html", "replace");
			// fdoc.write(htmlStr);
			// fdoc.close();
		}

		function getHTML() {
			var fdoc = (_frameObj.contentDocument) ? _frameObj.contentDocument
					: _frameObj.contentWindow.document;//兼容firefox和ie
			return fdoc.body.innerHTML;
		}

		return {
			setHTML: setHTML,
			getHTML: getHTML
		}
	}

	module.exports = FrameController;

});