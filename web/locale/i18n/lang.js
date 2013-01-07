define({
	title: 'WizNote Web',
	//目录相关
	DefaultCategory : {
	  "Completed": "Completed",
		"Deleted Items": "Deleted Items",
		"Inbox": "Inbox",
		"My Contacts": "My Contacts",
		"My Drafts": "My Drafts",
		"My Emails": "My Emails",
		"My Events": "My Events",
		"My Journals": "My Journals",
		"My Mobiles": "My Mobiles",
		"My Notes": "My Notes",
		"My Photos": "My Photos",
		"My Sticky Notes": "My Sticky Notes",
		"My Tasks": "My Tasks"
	},
	//根节点名称
	DefaultNode: {
		'recent': 'Recent Modified',
		'category': 'Folders',
		'tag': 'Tags',
		'group': 'My Groups',
		'personal': 'My Notes',
		'createCategory': 'New folder...',
		'createTag': 'New tag...'
	},
	// 显示用户设置相关
	UserSetting: {
		account_setting: 'Account Information',// 个人设置
		// change_password: 'http://service.wiz.cn/wizkm/html/profile_zh_CN.html',// 账号信息
		change_password: 'Change Password',// 修改密码
		usage: 'Usage', // mykbs
		vip: 'Upgrade to Vip',// 支付
		invite: 'Invite Friends...',// 邀请
		logoff: 'Sing out'
	},
	// 文档列表排序国际化资源
	DocSortArea: {
		'menuName': 'Arrange By',
		'items': [
			'Date created(Descending)',
			'Date created(Ascending)',
			'Date modified(Descending)',
			'Date modified(Descending)',
			'Title(Descending)',
			'Title(Ascending)'
		]
	},
	HeadMenuForDoc: {
		Create: 'New Note',
		Save: 'Save',
		SaveAndQuit: 'Save and Read',
		Sending: 'Sending...',
		Cancel: 'Cancel',
		Edit: 'Edit'
	},
	EditPage: {
		Saving: 'Saving...',
		Saved: 'The document has to save at {time}',
		FolderSpan: 'Folder: ',
		DefaultFolderObj:  {
			display: '/My Notes/',
			location: '/My Notes/'
		},
		DefaultTitle: 'Untitled',
		TagHelpSpan: 'Click to add tags',
		TagSpan: 'Tag: '
	},
	HelpPage: {
		loading: '<html><head><style type="text/css">#load_word{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";font-size:142%;padding:30px}</style></head><body><div><p id=load_word>加载中……</p></div>',
		'protected': '<html><head><style type="text/css">#protected_word{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";font-size:142%;color:#fc1d1c;padding:30px}</style></head><body><div><p id=protected_word class=protected>加密文件暂时无法在网页端查看</p></div>',
		welcomeTitle: 'Welcome to WizNote',
		welcome: '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html> <head> <meta =content-type ="text/html; charset=UTF-8"> <style>body{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";background-color:#fff;font-size:14px;padding:.5em;margin:1em;line-height:2}h1,h2,h3,h4,h5{padding:0 0 1em 0}h1,h2,h3,h4{display:inline}h1{font-size:1.5em}.feature_cloud{background:no-repeat url(img/introcss.png) 0 0;width:42px;height:42px}.feature_pc{background:no-repeat url(img/introcss.png) 0 -42px;width:42px;height:42px}.feature_mobile{background:no-repeat url(img/introcss.png) 0 -84px;width:42px;height:42px}.feature-description{line-height:2}</style> </head> <body><p class=intro style=text-align:left> Wiz能帮您快速条理化保存、方便与人分享、多终端随时随地浏览、永久安全云存储。更能让您做到：不同电脑、平板电脑（iPad等）、智能手机（iPhone、Android）之间云同步，相互之间便利地查看您的个人知识库！ </p> <table border=0 cellpadding=0 cellspacing=0 width="95%"> <tbody> <tr> <td class=feature-image><div class=feature_cloud> <td class=feature-description><b>免费笔记服务</b><br> 您可以免费的使用Wiz笔记软件和服务；云存储技术，无限空间。   <tr> <td class=feature-image><div class=feature_pc> <td class=feature-description><b>PC客户端</b><br> Wiz PC客户端是目前速度最快、功能最全的笔记客户端。<a href=http://www.wiz.cn/wiznote-windows.html target=_blank>下载Windows客户端</a>   <tr> <td class=feature-image><div class=feature_mobile> <td class=feature-description><b>手机客户端</b><br> 您可以通过iPhone、iPad、Android使用Wiz。<a href="http://www.wiz.cn/download#mobile" target=_blank>下载手机客户端</a>    </table> '
	}
})