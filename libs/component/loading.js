define(function (require, exports, module) {
	var loadingElemId = 'loading',
			loadingElem = $('#' + loadingElemId),
			GlobalUtil = require('common/util/GlobalUtil'),
			showDelay = 0;

	// ie下无法使用css3 animation 2012-11-26 lsl
	if (GlobalUtil.bIe()) {
		$('.loading-fallback').show();
		$('.c_loadingTracks').hide();
		showDelay = 500;
	}

	function show() {
		if (!loadingElem) {
			loadingElem = $('#' + loadingElemId);
		}
		// ie下如果html结构嵌套不对的话，会导致hide()无法正常工作
		// 使用toggle切换就没有这个问题了 2012-11-27 lsl
		loadingElem.toggle();
	}

	function hide() {
		if (!loadingElem) {
			loadingElem = $('#' + loadingElemId);
		}
		loadingElem.toggle();
	}

	// api
	return {
		show: show,
		hide: hide
	}
});