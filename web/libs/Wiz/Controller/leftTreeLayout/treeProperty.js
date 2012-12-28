define(["/web/locale/main"], function (require, exports, module) {
	'use strict';
	var DefaultNode = require('/web/locale/main').DefaultNode;

	var initTreeObj = {
		initNodes: [{
				name: DefaultNode.recent,							//显示名称
				level: 1,																//节点层级	
				type: 'keyword',												//子节点类型
				tag_guid: '',
				isParent: false
			},{
				name: DefaultNode.category,							//显示名称
				level: 1,																//节点层级	
				type: 'category',												//子节点类型
				childType: 'category',									//节点类型
				location: '/',													//目录路径	
				isParent: true
			},{
				name: DefaultNode.tag,
				level: 1,
				type: 'tag',
				childType: 'tag',
				isParent: true,
				parentTag: ''														//父标签的GUID，根标签为''
			}],
		createCategoryNodes: {
			name: DefaultNode.createCategory,
			cmd: 'create',
			type: 'category'
		},
		createTagNodes: {
			name: DefaultNode.createTag,
			cmd: 'create',
			type: 'tag'
		}
	};

	module.exports = initTreeObj;
});