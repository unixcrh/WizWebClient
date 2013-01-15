/**
 * 常量
 */
define(function (require, exports, module) {
	'use strict';
	var BASE_URL = '',
			API_BASE = BASE_URL + '/api',
			CATEGORY_BASE = API_BASE + '/category',
			TAG_BASE = API_BASE + '/tag',
			DOCUMENT_BASE = API_BASE + '/document',
			ATTACHMENT_BASE =API_BASE + '/attachment',
			LOGIN_URL = BASE_URL + '/login';

	var remote = {
		CLIENT_TYPE: 'web2.0',
		API_VERSION: 3,
		KEEP_ALIVE_TIME_MS:  8 * 60 * 1000														//保持自动登陆时间间隔
	};

	var url = {
		LOGIN : 'http://debug.wiz.cn/login',
		user: {
			account_setting: 'http://service.wiz.cn/wizkm/html/user_zh_CN.html',
			change_password: 'http://service.wiz.cn/wizkm/html/change_password_zh_CN.html',
			usage: 'http://service.wiz.cn/wizkm/html/profile_zh_CN.html?tab=viewusage',
			vip: 'http://service.wiz.cn/wizkm/html/pay_zh_CN.html',
			invite: 'http://service.wiz.cn/wizkm/html/invite_zh_CN.html',
			logoff: 'http://service.wiz.cn/wizkm/a/logout?url='
		}
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
	  CATEGORY_CREATE: {
	  	url: CATEGORY_BASE + '/item',
	  	action: 'post',
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
	  	url: TAG_BASE + '/item',
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
	  // 该接口只在openapi内创建一个临时的缓存目录
	  // 只有当用户真正点击保存后，才会把相关信息上传到服务器端
	  DOCUMENT_CREATE_DATA: {
	  	url: DOCUMENT_BASE + '/data',
	  	action: 'post',
	  	async: true
	  },
	  // 编辑文档
	  DOCUMENT_UPDATE_DATA: {
	  	url: DOCUMENT_BASE + '/data',
	  	action: 'put',
	  	async: true
	  },
	  DOCUMENT_RENAME: {
	  	url: DOCUMENT_BASE + '/name',
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
	  	url: DOCUMENT_BASE + '/data',
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

		REGISTER_SUCCESS_URL: BASE_URL + '/register',

		WEB_URL: BASE_URL + '/web'
	};

	exports.api = api;
	exports.remote = remote;
	exports.url = url;

});