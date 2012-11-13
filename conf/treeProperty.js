define(function (require, exports, module) {

	var initTreeObj = [{
		children: [{
			name: '文件夹',													//显示名称
			level: 1,																//节点层级	
			type: 'category',												//子节点类型
			childType: 'category',												//节点类型
			location: '/',													//目录路径	
			isParent: true
		},
		{
			name: '标签',
			level: 1,
			type: 'tag',
			childType: 'tag',
			isParent: true,
			parentTag: ''											//父标签的GUID，根标签为''
		}], 
		name: '我的笔记',
		level: 0,
		open: true
	},
	{
		children: [],
		name: '我的群组',
		level: 0,
		type: 'group',
		childType: 'tag',
		isParent: true
	}];

	module.exports = initTreeObj;
});