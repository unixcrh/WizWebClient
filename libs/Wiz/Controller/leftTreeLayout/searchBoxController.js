define(function (require, exports, module) {
	var GlobalCtrl = require('Wiz/Controller/GlobalController');	//全局的控制器

	var searchInput = $('#s_box_input');
	var searchBtn = $('#s_box_submit');

	function init() {
		initHandler();
	}

	function initHandler() {
		searchBtn.bind('click', doSearch);
		searchInput.bind('click', showHelperNode);
		searchInput.bind('keypress', keyPressHandler);
	}	

	/**
	 * 显示高级搜索帮主
	 * @return {[type]} [description]
	 */
	function showHelperNode() {

	}

	function keyPressHandler(evt) {
     evt = evt ? evt : window.event;
     console.log(evt);
     if (evt.keyCode === 13) {
     	doSearch();
     }
	}

	function doSearch() {
		var keyword = searchInput.val();
		if (typeof keyword !== 'string' || keyword === '') {
			return;
		}
		var params = getSearchParams();
		params.action_value = keyword;
		GlobalCtrl.requestDocList(params);
	}

	function getSearchParams() {
		var params = {};
		params.action_cmd = 'keyword';
		params.count = 200;
		return params;
	}

	return {
		init: init
	};
});