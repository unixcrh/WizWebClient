/**
 * 常量
 */
define(function (require, exports, module) {
	var BASE_URL = 'http://localhost';
	var API_BASE = BASE_URL + '/api';
	var CATEGORY_BASE = API_BASE + '/category';
	var TAG_BASE = API_BASE + '/tag';
	var DOCUMENT_BASE = API_BASE + '/document';
	var ATTACHMENT_BASE =API_BASE + '/attachment';
	var LOGIN_URL = BASE_URL + '/loginweb_zh_CN.html';

	var remote = {
		CLIENT_TYPE: 'web2.0',
		API_VERSION: 3,
		KEEP_ALIVE_TIME_MS:  8 * 60 * 1000														//保持自动登陆时间间隔
	};

	var url = {
		LOGIN : BASE_URL + '/loginweb_zh_CN.html'
	};


	//http GET---获取数据
	//http POST---新增数据
	//http PUT---更新数据
	//http DELETE---删除数据
	var api = {

		LOGIN: API_BASE + '/login',
	  LOGOUT: API_BASE + '/logout',
		REGISTER: API_BASE + '/register',
	  KEEPALIVE: { url: API_BASE + '/keepalive', action: 'post' },

		GET_USER_INFO: { url: API_BASE + '/user/info', action: 'get' },
		GET_GROUP_LIST: { url: API_BASE + '/user/grouplist', action: 'get' },

	  //目录相关接口
	  CATEGORY_GET_ALL: { url: CATEGORY_BASE + '/all', action: 'get' },
	  CATEGORY_GET_ROOT: { url: CATEGORY_BASE + '/root', action: 'get' },
	  CATEGORY_GET_CHILD: { url: CATEGORY_BASE + '/child', action: 'get' },
	  CATEGORY_RENAME: { url: CATEGORY_BASE + '/rename', action: 'put' },
	  CATEGORY_DELETE: { url: CATEGORY_BASE, action: 'delete' },

	  //标签相关接口
	  TAG_GET_ALL: { url: TAG_BASE + '/all', action: 'get' },
	  TAG_GET_ROOT: { url: TAG_BASE + '/root', action: 'get' },
	  TAG_GET_CHILD: { url: TAG_BASE + '/child', action: 'get' },
	  TAG_CREATE: { url: TAG_BASE, action: 'post' },
	  TAG_DELETE: { url: TAG_BASE, action: 'delete' },
	  TAG_RENAME: { url: TAG_BASE + '/rename', action: 'put' },

	  // 文档相关接口
	  DOCUMENT_GET_LIST: { url: DOCUMENT_BASE + '/list', action: 'get' },
	  DOCUMENT_GET_DATA: { url: DOCUMENT_BASE + '/data',	action: 'get' },
	  DOCUMENT_GET_INFO: { url: DOCUMENT_BASE + '/info', action: 'get' },	
	  DOCUMENT_POST_DATA: { url: DOCUMENT_BASE + '/data', action: 'post' },
	  DOCUMENT_RENAME: { url: DOCUMENT_BASE + '/rename', action: 'put' },
	  DOCUMENT_LELETE_TAG: { url: DOCUMENT_BASE + '/tag', action: 'delete' },
	  DOCUMENT_ADD_TAG: { url: DOCUMENT_BASE + '/tag', action: 'post' },
	  DOCUMENT_DELETE: { url: DOCUMENT_BASE, action: 'delete' },
	  DOCUMENT_CHANGET_CATEGORY: { url: DOCUMENT_BASE + '/move', action: 'put' },
	  DOCUMENT_COPY_TO_GROUP: { url: DOCUMENT_BASE + '/share', action: 'post' },
	  DOCUMENT_COPY_TO_PRIVATE: { url: DOCUMENT_BASE + '/copy', action: 'post' },
	  
	  // 附件接口
	  ATTACHMENT_DELETE: { url: ATTACHMENT_BASE, action: 'delete' },
	  ATTACHMENT_RENAME: { url: ATTACHMENT_BASE + '/rename', action: 'put' },
	  ATTACHMENT_GET_BY_DOC: { url: ATTACHMENT_BASE, action: 'get' },

		REGISTER_SUCCESS_URL: BASE_URL + '/regSuccess_zh_CN.html',

		WEB_URL: BASE_URL + '/index.html'
	};

	exports.api = api;
	exports.remote = remote;
	exports.url = url;

});