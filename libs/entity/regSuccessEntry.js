seajs.config({
	alias: {
		'jquery': '/libs/common/jquery/jquery-1.7.2.js',
		'cookie': '/libs/common/jquery/jquery.cookie.js',
		'common': '/libs/common',
		'Wiz': '/libs/Wiz'
	},
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
seajs.use('/libs/entity/regSuccess' , function(regSuccess) {
	regSuccess.initialize();
});