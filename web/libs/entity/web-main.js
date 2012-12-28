define(function(require, exports) {
	'use strict';
	var GlobalCtrl = require('../Wiz/Controller/GlobalController'),
			locale = require('/web/locale/main');

	document.title = locale.title;
	GlobalCtrl.init();
});