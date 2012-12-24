define({
	title: '為知筆記（Wiz）網頁版',
	//目录相关
	DefaultCategory : {
		"Completed": "已完成",
		"Deleted Items": "已刪除",
		"Inbox": "收集箱",
		"My Contacts": "我的聯絡人",
		"My Drafts": "我的草稿",
		"My Emails": "我的郵件",
		"My Events": "我的事件",
		"My Journals": "我的日記",
		"My Mobiles": "我的手機",
		"My Notes": "我的筆記",
		"My Photos": "我的照片",
		"My Sticky Notes": "我的桌面筆記",
		"My Tasks": "我的任務"
	},
	//根节点名称
	DefaultNode: {
		'recent': '最近修改',
		'category': '文件夾',
		'tag': '標簽',
		'group': '我的群組',
		'personal': '我的筆記',
		'createCategory': '新建文件夾...',
		'createTag': '新建標簽...'
	},
	// 显示用户设置相关
	UserSetting: {
		'singOut': '註銷'
	},
	// 文档列表排序国际化资源
	DocSortArea: {
		'menuName': '選擇排序方式',
		'items': [
			'按創建時間(降序)',
			'按創建時間(升序)',
			'按修改時間(降序)',
			'按修改時間(升序)',
			'按名稱(降序)',
			'按名稱(升序)'
		]
	},
	HeadMenuForDoc: {
		Create: '新建筆記',
		Save: '保存',
		SaveAndQuit: '保存並閱讀',
		Sending: 'Sending...',
		Cancel: '取消',
		Edit: '編輯'
	},
	EditPage: {
		Saving: '正在保存...',
		Saved: '筆記已於 {time} 保存',
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
		loading: '<html><head><style type="text/css">#load_word{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";font-size:142%;padding:30px}</style></head><body><div><p id=load_word>加載中……</p></div>',
		'protected': '<html><head><style type="text/css">#protected_word{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";font-size:142%;color:#fc1d1c;padding:30px}</style></head><body><div><p id=protected_word class=protected>加密文件暫時無法在網頁端查看</p></div>',
		welcome: '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html> <head> <meta =content-type ="text/html; charset=UTF-8"> <style>body{font-family:"Microsoft Yahei",Verdana,Simsun,"Segoe UI","Segoe UI Web Regular","Segoe UI Symbol","Helvetica Neue","BBAlpha Sans","S60 Sans",Arial,"sans-serif";background-color:#fff;font-size:14px;padding:.5em;margin:1em;line-height:2}h1,h2,h3,h4,h5{padding:0 0 1em 0}h1,h2,h3,h4{display:inline}h1{font-size:1.5em}.feature_cloud{background:no-repeat url(style/images/introcss.png) 0 0;width:42px;height:42px}.feature_pc{background:no-repeat url(style/images/introcss.png) 0 -42px;width:42px;height:42px}.feature_mobile{background:no-repeat url(style/images/introcss.png) 0 -84px;width:42px;height:42px}.feature-description{line-height:2}</style> </head> <body> <h1>歡迎使用為知Wiz</h1> <p class=intro style=text-align:left> Wiz能幫您快速條理化保存、方便與人分享、多終端隨時隨地瀏覽、永久安全雲存儲。更能讓您做到：不同電腦、平板電腦（iPad等）、智能手機（iPhone、Android）之間雲同步，相互之間便利地查看您的個人知識庫！ </p> <table border=0 cellpadding=0 cellspacing=0 width="95%"> <tbody> <tr> <td class=feature-image><div class=feature_cloud> <td class=feature-description><b>免費筆記服務</b><br> 您可以免費的使用Wiz筆記軟件和服務；雲存儲技術，無限空間。   <tr> <td class=feature-image><div class=feature_pc> <td class=feature-description><b>PC客戶端</b><br> Wiz PC客戶端是目前速度最快、功能最全的筆記客戶端。<a href=http://debug.wiz.cn/download target=_blank>下載Windows客戶端</a>   <tr> <td class=feature-image><div class=feature_mobile> <td class=feature-description><b>手機客戶端</b><br> 您可以通過iPhone、iPad、Android使用Wiz。<a href="http://www.wiz.cn/download#mobile" target=_blank>下載手機客戶端</a>    </table> '
	}
})