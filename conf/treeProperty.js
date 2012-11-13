define(function (require, exports, module) {
	var DefaultNode = require('locale').DefaultNode;

	var initTreeObj = [{
		children: [{
			name: DefaultNode.category,			//显示名称
			level: 1,																//节点层级	
			type: 'category',												//子节点类型
			childType: 'category',									//节点类型
			location: '/',													//目录路径	
			isParent: true
		},
		{
			name: DefaultNode.tag,
			level: 1,
			type: 'tag',
			childType: 'tag',
			isParent: true,
			parentTag: ''											//父标签的GUID，根标签为''
		}], 
		name: DefaultNode.personal,
		level: 0,
		open: true
	},
	{
		children: [],
		name: DefaultNode.group,
		level: 0,
		type: 'group',
		childType: 'tag',
		isParent: true
	}];
	console.log(initTreeObj);

	module.exports = initTreeObj;
});