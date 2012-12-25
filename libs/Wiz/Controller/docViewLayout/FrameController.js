define(["../../../common/util/GlobalUtil"], function (require, exports, module) {
	'use strict';
	var GlobalUtil = require('../../../common/util/GlobalUtil');
	var _id = {
		readFrameCt: 'read_frame_ct'
	};
	var FrameController = function (id) {

		var _frameObj = document.getElementById(id);


		initHandler();

		function initHandler() {
			if (_frameObj.attachEvent) {
				// ie下0级DOM onload有一些版本不支持，必须要使用attachEvent
				// lsl 2012-12-21
				_frameObj.attachEvent('onload', function() {
					resizeFrameContainer(_frameObj);
				});
			} else {
				_frameObj.onload = function () {
					resizeFrameContainer(_frameObj);
				};
			}
		}

		// 点击iframe时，触发document.body.click事件
		function initFrameBodyClickHandler() {
			var fdoc = getFrameDocument();
			var oldFunc = fdoc.body.onclick;
			fdoc.body.onclick = function (event) {
				// jQuery注册的事件，必须用jQuery触发，否则ie下会出问题
				$(document).trigger('click');
				// GlobalUtil.fireEvent(document.body, 'click');
				if (oldFunc) {
					oldFunc(event);
				}
			}
		}

		function completeImgSrc(contentDocument) {
			try {
				var imgList = contentDocument.getElementsByTagName('img');
				if (!imgList || imgList.length < 1) {
					return ;
				}
				for (var index = 0, length = imgList.length; index < length; index++) {
					imgList[index].src = imgList[index].src;
				}
			} catch (err) {
				console && console.error('Preview.completeImgSrc() Error: ' + err);
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
	    if (iframe) {
	    	// 首先要清空容器的尺寸，否则会造成叠加
      	var readFrameStyle = document.getElementById(_id.readFrameCt).style;
 				readFrameStyle.height = readFrameStyle.width = '';
				var fdoc = getFrameDocument(),
						fDocElem = fdoc.documentElement,
	    			parentStyle = $('#' + _id.readFrameCt),
	    			// 获取frame中页面的最大scroll值，兼容低版本ie  lsl-2012-12-21
	    			scrollHeight = Math.max(fDocElem.scrollHeight, fdoc.body.scrollHeight),
	    			scrollWidth = Math.max(fDocElem.scrollWidth, fdoc.body.scrollWidth);
	      if (fdoc && scrollHeight && scrollWidth) {
	      	//首先清空
	      	parentStyle.height(scrollHeight + 20 + 'px');
	      	parentStyle.width(scrollWidth + 20 + 'px');
	      }
	    }
			initFrameBodyClickHandler();
		}

		function setURL(url) {
			_frameObj.src = url;
		}
		// 获取完整的html
		function getHTML() {
			var fdoc = getFrameDocument();
			// 获取页面内容之前，先把img补全，否则加载到编辑页面中会无法显示
			completeImgSrc(fdoc);
			return fdoc.documentElement.outerHTML;
		}

		function setHTML(htmlStr) {
			var fdoc = getFrameDocument();
			if (htmlStr) {
				fdoc.open("text/html", "replace");
				fdoc.write(htmlStr);
				fdoc.close();
			}
		}

		return {
			setUrl: setURL,
			getHTML: getHTML,
			setHTML: setHTML
		}
	}

	module.exports = FrameController;

});