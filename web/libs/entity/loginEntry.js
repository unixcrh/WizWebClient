seajs.config({
	alias: {
		'common': '/web/libs/common',
		'Wiz': '/web/libs/Wiz'
	},
	map: [
	// 时间戳控制版本管理
    [ /^(.*\/libs\/.*\.(?:css|js))(?:.*)$/i, '$1?201212251828' ]
  ]
});
seajs.use('/web/libs/entity/login');