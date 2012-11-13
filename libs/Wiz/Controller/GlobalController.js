/**
 * 全局的控制器，转发请求到相应的独立控制器中
 */

define(function (require, exports, module) {
	var GlobalUtil = require('common/util/GlobalUtil');
	var config = require('config');
	var context = require('Wiz/context');
	var constant = require('Wiz/constant');
	var remote = require('Wiz/remote');

	var treeCtrl = require('Wiz/Controller/leftTreeLayout/ztreeController');
	var listCtrl = require('Wiz/Controller/docListLayout/Controller');

	//显示文档列表
	function requestDocList(params) {
		var callback = function (data) {
			if (data.code == '200' && data.list) {
				listCtrl.show(data.list);
			}
		};
		var callError = function (error) {
			var errorMsg = 'GlobalController.requestDocList() Error: ' + error;
			if (console) {
				console.error(errorMsg);
			} else {
				alert(errorMsg);
			}
		};
		remote.getDocumentList(context.kbGuid, params, callback, callError);
	}

	return {
		requestDocList: requestDocList
	};
});