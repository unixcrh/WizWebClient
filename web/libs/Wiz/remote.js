define(["./context","./constant","../component/loading"], function(require, exports, module) {
	'use strict';
	var context = require('./context'),
			constant = require('./constant'),
			loadCtrl = require('../component/loading'),
			bPostDocLock = false,
			ajaxCtrl = new AjaxControl();

	//发送请求函数
	//options主要是处理url后衔接的objValue，如document_title、category_name...
	function sendRequest(apiObj, data, callback, callError, options, bShowLoading) {
		// 发请求的时候，显示
		if (bShowLoading !== true) {
			loadCtrl.show();	
		}
		if (!apiObj || !apiObj.url || !apiObj.action) {
			console && console.error('remote.sendRequest apiObj: ' + apiObj.url + '-' + apiObj.action + ' Error');
			if (bShowLoading !== true) {
				loadCtrl.hide();
			}
			return;
		}
		if (!callError) {
			callError = function(){};
		}
		// 统一在发送请求这一层处理，不用每个地方都处理
		var _callSuccess = function (data) {
			if (bShowLoading !== true) {
				loadCtrl.hide();
			}
			bPostDocLock = false;
			callback(data);
		},
			_callError = function (jqXHR, status, error) {
				if (bShowLoading !== true) {
					loadCtrl.hide();
				}
				bPostDocLock = false;
				if ('abort' === status) {
					// 手动停掉的不做任何
					return;
				}
				callError(error);
			},
			url = options ? (apiObj.url + '/' + options) : apiObj.url;
		var jqxhr = $.ajax({
			url: url,
			data: data,
			dateType: 'json',
			async: apiObj.async,
			type: apiObj.action,
			success: _callSuccess,
			error: _callError,
			cache: false
		});
		// 
		ajaxCtrl.setCurrent(url + apiObj.action, jqxhr);
	}

	//获取请求参数
	function getRequestParams() {
		var params = {
			client_type: constant.remote.CLIENT_TYPE,
			api_version: constant.remote.API_VERSION,
			token: context.token,
			debug: context.debug,
			token_guid: context.token
		}
		return params;
	}

	/**
	 * 合并参数--不覆盖目标参数
	 * @param  {object} targetParams 目标参数
	 * @param  {object} params       被合并的参数
	 * @return {object}              合并后的参数
	 */
	function mergeParams(targetParams, params) {
		targetParams = targetParams ? targetParams : {};
		for (var key in params) {
			if (!targetParams[key]) {
				targetParams[key] = params[key];
			}
		}
		return targetParams;
	}
	
	/**
	 * 对ajax进行控制，同一类型的ajax请求同时只能有一个，其他的必须要abort
	 */
	function AjaxControl() {
		var xhrListObj = {};

		function abortSame (key) {
			var xhrList = xhrListObj[key],
					length = 0,
					i = 0;
			if (xhrList) {
				length = xhrList.length;
				for (i=length ; i>0; i--) {
					try {
						// 取消
						xhrList[i].abort();
						// 删除
						xhrList.splice(i-1, 1);

					} catch (error) {
						// 暂时不做任何操作
					}
				}
			}
		}

		function abortAll () {
			if (!xhrListObj) {
				return;
			}
			for (var key in xhrListObj) {
				abortSame(key);
			}
		}

		function setCurrent (key, jqxhr) {
			abortSame(key);
			xhrListObj[key] = xhrListObj[key] || [];
			xhrListObj[key].push(jqxhr);
		}

		return {
			setCurrent: setCurrent,
			abortAll: abortAll
		};

	}
	/**
	 * 远程调用的类
	 * @type {Object}
	 */
	var Remote = {

		/* 获取用户信息 */
		getUserInfo: function (callback, callError) {
			sendRequest(constant.api.GET_USER_INFO, getRequestParams(), callback, callError);
		},

		/* 获取群组列表 */
		getGroupKbList: function (callback, callError) {
			sendRequest(constant.api.GET_GROUP_LIST, getRequestParams(), callback, callError);
		},

		/* 获取所有目录列表 */
		getAllCategory: function (kbGuid, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			sendRequest(constant.api.CATEGORY_GET_ALL, requestParams, callback, callError);
		},

		/* 获取根节点目录列表 */
		getRootCategory: function (kbGuid, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			sendRequest(constant.api.CATEGORY_GET_ROOT, requestParams, callback, callError);
		},

		/* 获取子节点目录列表 */
		getChildCategory: function (kbGuid, parentValue, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			requestParams.parent_value = parentValue;
			sendRequest(constant.api.CATEGORY_GET_CHILD, requestParams, callback, callError);
		},
		/* 新建目录 */
		createCategory: function (kbGuid, name, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			requestParams.new_name = name
			sendRequest(constant.api.CATEGORY_CREATE, requestParams, callback, callError);
		},

		/* 新建标签 */
		createTag: function(kbGuid, name, parentGuid, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			requestParams.new_name = name;
			// 不能为null
			requestParams.parent_guid = parentGuid || '';
			sendRequest(constant.api.TAG_CREATE, requestParams, callback, callError);
		},

		/* 获取所有标签列表 */
		getAllTag: function (kbGuid, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			sendRequest(constant.api.TAG_GET_ALL, requestParams, callback, callError);
		},

		/* 获取根节点标签列表 */
		getRootTag: function (kbGuid, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			sendRequest(constant.api.TAG_GET_ROOT, requestParams, callback, callError);
		},

		/* 获取子节点标签列表 */
		getChildTag: function (kbGuid, parentValue, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			requestParams.parent_value = parentValue;
			sendRequest(constant.api.TAG_GET_CHILD, requestParams, callback, callError);
		},

		/* 获取文档列表 */
		getDocumentList: function (kbGuid, params, callback, callError) {
			var requestParams = getRequestParams();
			requestParams = mergeParams(requestParams, params);
			requestParams.kb_guid = kbGuid;
			sendRequest(constant.api.DOCUMENT_GET_LIST, requestParams, callback, callError);
		},
		getDocumentBody: function (kbGuid, docGuid, version, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			requestParams.document_guid = docGuid;
			requestParams.action_cmd = 'body';
			requestParams.version = version;
			sendRequest(constant.api.DOCUMENT_GET_INFO, requestParams, callback, callError);
		},

		postDocument: function (kbGuid, docInfo , callback, callError, bQuit) {
			var requestParams = getRequestParams();
			requestParams = mergeParams(requestParams, docInfo);
			requestParams.kb_guid = kbGuid;
			requestParams.kb_guid = kbGuid;
			if (bPostDocLock === true) {
				return;
			}
			// 防止多次提交
			bPostDocLock = true;
			sendRequest(constant.api.DOCUMENT_UPDATE_DATA, requestParams, callback, callError, null, bQuit);
		},

		// web特殊处理部分
		createTempDocument: function (kbGuid, docInfo, callback, callError) {
			var requestParams = getRequestParams();
			requestParams = mergeParams(requestParams, docInfo);
			requestParams.temp = true;
			requestParams.kb_guid = kbGuid;
			sendRequest(constant.api.DOCUMENT_CREATE_DATA, requestParams, callback, callError, null, true);
		},

		deleteDocument: function(kbGuid, docGuid, callback, callError) {
			var requestParams = getRequestParams();
			requestParams.kb_guid = kbGuid;
			requestParams.document_guid = docGuid;
			sendRequest(constant.api.DOCUMENT_DELETE, requestParams, callback, callError);
		},

		/* 保持登陆状态 */
		refreshToken: function (callback, callError) {
			var requestParams = getRequestParams();
			callback = callback ? callback : function(data) {
			};
			callError = callError ? callError : function (err) {
			};
			sendRequest(constant.api.KEEPALIVE, requestParams, callback, callError);
		}

	};


	module.exports = Remote;
});