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
		LOGIN : BASE_URL + '/loginweb_zh_CN.html',
		LOGOFF: 'http://service.wiz.cn/wizkm/a/logout?url='
	};

	//每个API对象属性如下:
	//url：api的请求地址
	//action：http action (get---获取、post---新增、put---更新、delete---删除)
	//async: ajax请求是否异步
	var api = {

		LOGIN: API_BASE + '/login',
	  LOGOUT: API_BASE + '/logout',
		REGISTER: API_BASE + '/register',
	  KEEPALIVE: {
	  	url: API_BASE + '/keepalive',
	  	action: 'post',
	  	async: true
	  },

		GET_USER_INFO: {
			url: API_BASE + '/user/info',
			action: 'get',
	  	async: false
		},
		GET_GROUP_LIST: {
			url: API_BASE + '/user/grouplist',
			action: 'get',
	  	async: true
		},

	  //目录相关接口
	  CATEGORY_GET_ALL: {
	  	url: CATEGORY_BASE + '/all',
	  	action: 'get',
	  	async: true
	  },
	  CATEGORY_GET_ROOT: {
	  	url: CATEGORY_BASE + '/root',
	  	action: 'get',
	  	async: true
	  },
	  CATEGORY_GET_CHILD: {
	  	url: CATEGORY_BASE + '/child',
	  	action: 'get',
	  	async: true
	  },
	  CATEGORY_RENAME: {
	  	url: CATEGORY_BASE + '/rename',
	  	action: 'put',
	  	async: true
	  },
	  CATEGORY_DELETE: {
	  	url: CATEGORY_BASE,
	  	action: 'delete',
	  	async: true
	  },

	  //标签相关接口
	  TAG_GET_ALL: {
	  	url: TAG_BASE + '/all',
	  	action: 'get',
	  	async: true
	  },
	  TAG_GET_ROOT: {
	  	url: TAG_BASE + '/root',
	  	action: 'get',
	  	async: true
	  },
	  TAG_GET_CHILD: {
	  	url: TAG_BASE + '/child',
	  	action: 'get',
	  	async: true
	  },
	  TAG_CREATE: {
	  	url: TAG_BASE,
	  	action: 'post',
	  	async: true
	  },
	  TAG_DELETE: {
	  	url: TAG_BASE,
	  	action: 'delete',
	  	async: true
	  },
	  TAG_RENAME: {
	  	url: TAG_BASE + '/rename',
	  	action: 'put',
	  	async: true
	  },

	  // 文档相关接口
	  DOCUMENT_GET_LIST: {
	  	url: DOCUMENT_BASE + '/list',
	  	action: 'get',
	  	async: true
	  },
	  DOCUMENT_GET_DATA: {
	  	url: DOCUMENT_BASE + '/data',
	  	action: 'get',
	  	async: true
	  },
	  DOCUMENT_GET_INFO: {
	  	url: DOCUMENT_BASE + '/info',
	  	action: 'get',
	  	async: true
	  },	
	  DOCUMENT_POST_DATA: {
	  	url: DOCUMENT_BASE + '/data',
	  	action: 'post',
	  	async: true
	  },
	  DOCUMENT_RENAME: {
	  	url: DOCUMENT_BASE + '/rename',
	  	action: 'put',
	  	async: true
	  },
	  DOCUMENT_LELETE_TAG: {
	  	url: DOCUMENT_BASE + '/tag',
	  	action: 'delete',
	  	async: true
	  },
	  DOCUMENT_ADD_TAG: {
	  	url: DOCUMENT_BASE + '/tag',
	  	action: 'post',
	  	async: true
	  },
	  DOCUMENT_DELETE: {
	  	url: DOCUMENT_BASE,
	  	action: 'delete',
	  	async: true
	  },
	  DOCUMENT_CHANGET_CATEGORY: {
	  	url: DOCUMENT_BASE + '/move',
	  	action: 'put',
	  	async: true
	  },
	  DOCUMENT_COPY_TO_GROUP: {
	  	url: DOCUMENT_BASE + '/share',
	  	action: 'post',
	  	async: true
	  },
	  DOCUMENT_COPY_TO_PRIVATE: {
	  	url: DOCUMENT_BASE + '/copy',
	  	action: 'post',
	  	async: true
	  },
	  
	  // 附件接口
	  ATTACHMENT_DELETE: {
	  	url: ATTACHMENT_BASE,
	  	action: 'delete',
	  	async: true
	  },
	  ATTACHMENT_RENAME: {
	  	url: ATTACHMENT_BASE + '/rename',
	  	action: 'put',
	  	async: true
	  },
	  ATTACHMENT_GET_BY_DOC: {
	  	url: ATTACHMENT_BASE,
	  	action: 'get',
	  	async: true
	  },

		REGISTER_SUCCESS_URL: BASE_URL + '/regSuccess_zh_CN.html',

		WEB_URL: BASE_URL + '/index.html'
	};

	exports.api = api;
	exports.remote = remote;
	exports.url = url;

});