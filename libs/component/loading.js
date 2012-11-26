define(function (require, exports, module) {
	var loadingElemId = 'loading',
			loadingElem = null,
			GlobalUtil = require('common/util/GlobalUtil');

	function show() {
		if (!loadingElem) {
			loadingElem = $('#' + loadingElemId);
			// ie下无法使用css3 animation 2012-11-26 lsl
			if (GlobalUtil.bIe()) {
				$('.loading-fallback').show();
				$('.c_loadingTracks').hide();
			}
		}
		loadingElem.show(500);
	}

	function hide() {
		if (!loadingElem) {
			loadingElem = $('#' + loadingElemId);
		}
		loadingElem.hide();
	}

	// api
	return {
		show: show,
		hide: hide
	}
});