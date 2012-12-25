seajs.config({
	// alias: {
	// 	'common': '/libs/common',																//通用库
	// 	'component': '/libs/component',													//小组件
	// 	'config': '/conf/config',																//web的配置
	// 	'Wiz': '/libs/Wiz',																			//Wiz相关模块
	// 	'locale': '/locale/main'
	// },
	map: [
	// 时间戳控制版本管理
    [ /^(.*\/libs\/.*\.(?:css|js))(?:.*)$/i, '$1?201212251828' ]
  ],

	locale: 'zh-cn'																						//默认语言包
});
seajs.use(['seajs/plugins/plugin-i18n', './libs/entity/web-main']);//'./libs/entity/web-main');