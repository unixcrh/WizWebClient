define(function(require, exports) {
	var GlobalCtrl = require('Wiz/Controller/GlobalController'),
			locale = require('locale');

	document.title = locale.title;
	GlobalCtrl.init();
});