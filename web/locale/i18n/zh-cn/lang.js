define({
	title: '为知笔记（Wiz）网页版',
	DELETE_DOC_TITLE: '删除笔记',
	DELETE_DOC_AFFIRM: '确认删除笔记',
	DELETE_DOC_PROCESSING: '正在删除，请稍后...',
	//目录相关
	DefaultCategory : {
		"Completed": "已完成",
		"Deleted Items": "已删除",
		"Inbox": "收集箱",
		"My Contacts": "我的联系人",
		"My Drafts": "我的草稿",
		"My Emails": "我的邮件",
		"My Events": "我的事件",
		"My Journals": "我的日记",
		"My Mobiles": "我的手机",
		"My Notes": "我的笔记",
		"My Photos": "我的照片",
		"My Sticky Notes": "我的桌面便笺",
		"My Tasks": "我的任务"
	},
	//根节点名称
	DefaultNode: {
		'recent': '最近修改',
		'category': '文件夹',
		'tag': '标签',
		'group': '我的群组',
		'personal': '我的笔记',
		'createCategory': '新建文件夹...',
		'createTag': '新建标签...'
	},
	// 显示用户设置相关
	UserSetting: {
		account_setting: '帐号设置',// 个人设置
		// change_password: 'http://service.wiz.cn/wizkm/html/profile_zh_CN.html',// 账号信息
		change_password: '修改密码',// 修改密码
		vip: '升级到VIP', // mykbs
		usage: '使用量',// 支付
		invite: '邀请好友',// 邀请
		logoff: '注销'
	},
	// 文档列表排序国际化资源
	DocSortArea: {
		'menuName': '选择排序方式',
		'items': [
			'按创建时间(降序)',
			'按创建时间(升序)',
			'按修改时间(降序)',
			'按修改时间(升序)',
			'按名称(降序)',
			'按名称(升序)'
		]
	},
	HeadMenuForDoc: {
		Create: '新建笔记',
		Save: '保存',
		SaveAndQuit: '保存并阅读',
		Sending: '正在保存...',
		Cancel: '取消',
		Edit: '编辑',
		Delete: '删除'
	},
	EditPage: {
		Saving: '正在保存...',
		Saved: '笔记已于 {time} 保存',
		FolderSpan: '文件夹: ',
		DefaultFolderObj:  {
			display: '/我的笔记/',
			location: '/My Notes/'
		},
		DefaultTitle: '未命名',
		TagHelpSpan: '点击添加标签',
		TagSpan: '标签: ', 
		UntitledWarn: '无法保存无标题的笔记.',
		UntitledBtn: '确定'
	},
	HelpPage: {
		loading: '<html><head><style type="text/css">#load_word{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";font-size:142%;padding:30px}</style></head><body><div><p id=load_word>加载中……</p></div>',
		'protected': '<html><head><style type="text/css">#protected_word{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";font-size:142%;color:#fc1d1c;padding:30px}</style></head><body><div><p id=protected_word class=protected>加密文件暂时无法在网页端查看</p></div>',
		welcomeTitle: '欢迎使用为知笔记',
		welcome: '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html> <head> <meta =content-type ="text/html; charset=UTF-8"> <style>body{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";background-color:#fff;font-size:14px;padding:.5em;margin:1em;line-height:2}h1,h2,h3,h4,h5{padding:0 0 1em 0}h1,h2,h3,h4{display:inline}h1{font-size:1.5em}.feature_cloud{background:no-repeat url(web/style/images/introcss.png) 0 0;width:42px;height:42px}.feature_pc{background:no-repeat url(web/style/images/introcss.png) 0 -42px;width:42px;height:42px}.feature_mobile{background:no-repeat url(web/style/images/introcss.png) 0 -84px;width:42px;height:42px}.feature-description{line-height:2}</style> </head> <body><p class=intro style=text-align:left> Wiz能帮您快速条理化保存、方便与人分享、多终端随时随地浏览、永久安全云存储。更能让您做到：不同电脑、平板电脑（iPad等）、智能手机（iPhone、Android）之间云同步，相互之间便利地查看您的个人知识库！ </p> <table border=0 cellpadding=0 cellspacing=0 width="95%"> <tbody> <tr> <td class=feature-image><div class=feature_cloud> <td class=feature-description><b>免费笔记服务</b><br> 您可以免费的使用Wiz笔记软件和服务；云存储技术，无限空间。   <tr> <td class=feature-image><div class=feature_pc> <td class=feature-description><b>PC客户端</b><br> Wiz PC客户端是目前速度最快、功能最全的笔记客户端。<a href=http://www.wiz.cn/wiznote-windows.html target=_blank>下载Windows客户端</a>   <tr> <td class=feature-image><div class=feature_mobile> <td class=feature-description><b>手机客户端</b><br> 您可以通过iPhone、iPad、Android使用Wiz。<a href="http://www.wiz.cn/download#mobile" target=_blank>下载手机客户端</a>    </table> '
	},
	AttachmentArea: {
		OverlayText: '下载',
		HeaderTitle: '&nbsp;个附件'
	}
	
})