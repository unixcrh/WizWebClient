seajs.config({
	alias: {
		'jquery': '/web/libs/common/jquery/jquery-1.7.2.js',
		'cookie': '/web/libs/common/jquery/jquery.cookie.js',
		'common': '/web/libs/common',
		'Wiz': '/web/libs/Wiz'
	},
	map: [
	// 时间戳控制版本管理
    [ /^(.*\/libs\/.*\.(?:css|js))(?:.*)$/i, '$1?201212251828' ]
  ],
	preload: [
		'jquery'
	]
});
seajs.modify('jquery', function(require, exports, module) {
	module.exports = jQuery = $;
});
seajs.modify('cookie', function(require, exports, module) {
	module.exports = $.cookie;
});
seajs.use('/web/libs/entity/login');