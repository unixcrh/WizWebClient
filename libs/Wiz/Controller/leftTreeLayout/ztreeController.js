define(function (require, exports, module) {
	var treeProperty = require('./treeProperty'),
		_messageCenter = null,
		zTree = require('ztree'),
		zTreeBase = require('../../../component/zTreeBase'),

		locale= require('locale'),
		specialLocation = locale.DefaultCategory,

		_curCategory = {}

	function ZtreeController() {
		
		var treeObj = null;
		var zNodesObj = treeProperty.initNodes;
		var setting = zTreeBase.getDefaultSetting();
		setting.callback = {
			onClick : zTreeOnClick,
			onExpand: zTreeOnExpand,
			onRightClick: zTreeOnRightClick,
			beforeRename: zTreeBeforeRename
		};
		setting.view.showIcon = showIconForTree;


		function zTreeBeforeRename(treeId, treeNode, newName) {

			if(zTreeBase.checkNewName(newName) === false) {
				return;
			}
			// 新建目录
			var location = '/' + newName + '/';
			treeNode.location = location;
			_messageCenter.requestCreateItem(newName, treeNode.type, function (data) {
				if (data.code != '200') {
					// 创建失败，删除该节点
					// TODO 提示
					treeObj.removeNode(treeNode, false);
				} else {
					treeObj.updateNode(treeNode);
				}
			});
			return true;
		}

		function isConSpeCharacters (value) {
			var special = '\\,/,:,<,>,*,?,\",&,\'',
				specialList = special.split(',');
			for(var index=0, length=specialList.length; index < length; index++) {
				if (value.indexOf(specialList[index]) > -1) {
					return true;
				}
			}
			return false;
		}

		function addDiyDom(treeId, treeNode) {
			var spaceWidth = 10;
			var switchObj = $("#" + treeNode.tId + "_switch"),
			icoObj = $("#" + treeNode.tId + "_ico");
			icoObj.before(switchObj);

			if (treeNode.level > 1) {
				var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
				switchObj.before(spaceStr);
			}
			// 修改新建功能的子节点显示样式
			if (treeNode.level === 1 && treeNode.cmd === 'create') {
				var hypertextObj = $('#' + treeNode.tId + '_a');
				hypertextObj.addClass('create-link');
			}
		}

		function showIconForTree(treeId, treeNode) {
			return treeNode.level !== 0;
		};


		function zTreeOnRightClick(event, treeId, treeNode) {
			event.preventDefault();
			event.returnValue = false;
		}


		// 节点正在加载中
		function loadingNode(treeNode) {
			var switchIconId = treeNode.tId + '_switch';
			$('#' + switchIconId).addClass('ico_loading');
		}
		// 节点加载完成
		function loadedNode(treeNode) {
			var switchIconId = treeNode.tId + '_switch';
			$('#' + switchIconId).removeClass('ico_loading');
		}

		function zTreeOnExpand(event, treeId, treeNode) {
			//bLoading参数为了防止多次加载同一数据
 			if (treeNode.bLoading) {
 				return;
 			}
 			var childList = [];
 			zTreeBase.loadingNode(treeNode);
			_messageCenter.getChildNodes(treeNode, function(data) {
				childList = zTreeBase.addChildToNode(treeObj, data.list, treeNode);
				if (treeNode.level === 0) {
					_messageCenter.saveNodesInfos(treeNode.type, childList);
				}
				if (treeNode.type === 'category') {
					addDefaultNodes(treeNode, treeNode.type);	
				}
			});
		}

		// 目录排序
		function sortCategoryList(respList, type) {
			// TODO 根据KV提供的folders_pos来进行排序
			respList.sort(function(a, b) {
				if (a.position) {
					return a.position - b.position;
				}
				// 如果没有顺序信息，则直接通过名称排序
				return a[type + '_name'].localeCompare(b[type + '_name']);
			});
			return respList;
		}
		// 增加默认的一些节点，如：新用户下默认的目录、新建目录
		function addDefaultNodes(treeNode, type) {
			var newNode = null;
			if (type === 'category') {
				newNode = treeProperty.createCategoryNodes;
			} else if (type === 'tag') {
				newNode = treeProperty.createTagNodes;
			} else {
				console.error('addDefaultNodes Error: type can not be none');
				return;
			}
			treeObj.addNodes(treeNode, newNode, true);
		}

		// 点击事件
		function zTreeOnClick(event, treeId, treeNode) {
			if (treeNode.cmd === 'create') {
				var parentNode = treeNode.getParentNode(),
						newNode = treeObj.addNodes(parentNode, {'name': '', 'type': treeNode.type}, true);
				treeObj.editName(newNode[0])
				// 删除当前新建目录的节点
				treeObj.removeNode(treeNode);
				// 在最后增加
				addDefaultNodes(parentNode, treeNode.type);
				return;
			}
			if (treeNode.type === 'category') {
				_curCategory.location = treeNode.location;
				_curCategory.localeLocation = zTreeBase.changeSpecilaLocation(treeNode.location);
			}
			if (treeNode.level === 0) {
				if (treeNode.type === 'keyword') {
					_messageCenter.requestDocList(getParamsFromTreeNode(treeNode));
				} else {
					treeObj.expandNode(treeNode);
					zTreeOnExpand(event, treeId, treeNode);
				}
			} else if (treeNode.level > 0) {
				_messageCenter.requestDocList(getParamsFromTreeNode(treeNode));
			}
		}

		/* 从treenode中获取请求的数据		 */
		function getParamsFromTreeNode(treeNode) {
			var params = {};
			params.action_cmd = treeNode.type;
			params.action_value = treeNode.location ? treeNode.location : treeNode.tag_guid;
			params.count = 200;
			return params;
		}

		function initTree(id) {
			treeObj =zTree.init($('#' + id), setting, zNodesObj);
			var treeElem = $('#' + id);
			treeElem.hover(function () {
				if (!treeElem.hasClass("showIcon")) {
					treeElem.fadeIn().addClass("showIcon");
				}
			}, function() {
				treeElem.removeClass("showIcon");
			});
			// 树加载完成后，默认选择首项
			setFirstNodeSelectd();
			// $("#leftTree_1_a").offset( {left:10});
			// $("#leftTree_2_a").offset( {left:10});
		}

		function setFirstNodeSelectd() {
			// 选中第一个节点
			var nodes = treeObj.getNodes();
			if (nodes.length>0) {
				$('#' + nodes[0].tId + '_a').trigger('click');
				treeObj.selectNode(nodes[0]);
			}
		}

		/**
		 * 对特殊的文件夹处理，返回相应的显示名
		 */
		function changeSpecilaLocation(location) {
			// 'use strict' ;
			$.each(specialLocation, function (key, value) {
				var index = location.indexOf(key);

				if (index === 0 && location === key) {
					location = value;
					return false;
				}
				if (index === 1 && location.indexOf('/') === 0) {
					location = '/' + value + location.substr(key.length + 1);
					return false;
				}
			});
			return location;
		}

		function init(id, messageHandler) {
			_messageCenter = messageHandler;
			initTree(id);
			// 首次加载默认展开目录
			expandCategory();
		}

		// 默认展开根目录节点
		function expandCategory(){
			var nodes = treeObj.getNodes();
			if (nodes.length>1) {
				treeObj.expandNode(nodes[1], true, true, true);
				zTreeOnExpand(null, null, nodes[1]);
			}
			if (nodes.length>2) {
				treeObj.expandNode(nodes[2], true, true, true);
				zTreeOnExpand(null, null, nodes[2]);
			}
		}

		// 获取当前目录
		function getCurrentCategory() {
			return _curCategory;
		}

		// 设置选中的node，触发click事件
		function selectNode(key, value) {
			var nodes = treeObj.getNodesByParam(key, value, null);

			if (nodes.length === 1) {
				zTreeOnClick(null, null, nodes[0]);
				treeObj.selectNode(nodes[0]);
			}
		}


		this.init = init;
		this.getCurrentCategory = getCurrentCategory;
		this.selectNode = selectNode;
	}
	var controller = new ZtreeController();

	module.exports = controller;
});