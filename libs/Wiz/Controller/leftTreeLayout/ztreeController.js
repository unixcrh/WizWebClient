define(function (require, exports, module) {
	var treeProperty = require('/conf/treeProperty'),
		messageCenter = null,
		zTree = require('ztree'),
		GlobalUtil = require('common/util/GlobalUtil'),
		remote = require('Wiz/remote'),
		context = require('Wiz/context'),

		locale= require('locale'),
		specialLocation = locale.DefaultCategory;

	function ZtreeController() {
		
		var treeObj = null;
		// 'use strict';
		var setting = {
			view : {
				showLine : false,
				selectedMulti : false,
				showIcon: false,
				showIcon: showIconForTree,
				addDiyDom: addDiyDom
			},
			data : {
				simpleData : {
					editNameSelectAll: true,
					enable : false
				}
			},
			edit : {
				enable: true
			},
			callback : {
				onClick : zTreeOnClick,
				onExpand: zTreeOnExpand,
				onRightClick: zTreeOnRightClick,
				beforeRename: zTreeBeforeRename
			}

		},
			zNodesObj = treeProperty.initNodes;


		function zTreeBeforeRename(treeId, treeNode, newName) {
			if (newName === '') {
				alert('Folder name can not be null');
				return false;
			}
			if (GlobalUtil.isConSpeCharacters(newName)) {
				alert('Folder name can not contain flowing characters: \\,/,:,<,>,*,?,\",&,\'');
				return false;
			}
			// 新建目录
			console.log(treeNode.type);
			messageCenter.requestCreateItem(newName, treeNode.type);
			return true;
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
				console.log(treeNode);
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
 			loadingNode(treeNode);
			//获取到当前的kb_guid
			var kbGuid = treeNode.kb_guid ? treeNode.kb_guid : context.userInfo.kb_guid;
			if ('category' === treeNode.type) {
				remote.getChildCategory(kbGuid, treeNode.location, function (data){ 
					addChildToNode(data.list, treeNode);
				});
			} else if ('tag' === treeNode.type) {
				//获取父标签的GUID，如果没有，则设为''
				var parentTagGuid = treeNode.tag_group_guid ? treeNode.tag_group_guid : '';
				remote.getChildTag(kbGuid, parentTagGuid, function (data) {
					addChildToNode(data.list, treeNode);
				});

			} else if ('group' === treeNode.type) {
				remote.getGroupKbList(function (data) {
					addChildToNode(data.list, treeNode);
				});
			}
		}

		/**
		 * 根据返回的列表，显示相应的树节点
		 * @param {Array} respList 服务端返回的列表
		 * @param {object} treeNode 当前的节点
		 */
		function addChildToNode(respList, treeNode) {
			loadedNode(treeNode);
			if (!respList) {
				return;
			}
			$.each(respList, function (key, child){
				if (child.kb_name) {
					child.name = child.kb_name;
					child.isParent = true;
				} else {
					child.name = child.tag_name ? child.tag_name : child.category_name;
				}
				child.type = treeNode.childType ? treeNode.childType: treeNode.type;
				if (!child.kb_guid) {
					child.kb_guid = treeNode.kb_guid;
				}

				//目录需要经过国际化处理
				if ('category' === treeNode.type && specialLocation[child.name]) {
					child.name = changeSpecilaLocation(child.name);
				}
			});

			treeObj.addNodes(treeNode, respList, true);
			if (treeNode.level === 0) {
				addDefaultNodes(treeNode, treeNode.type);
			}
			treeNode.bLoading = true;
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
			if (treeNode.level === 0) {
				if (treeNode.type === 'keyword') {
					messageCenter.requestDocList(getParamsFromTreeNode(treeNode));
				} else {
					treeObj.expandNode(treeNode);
					zTreeOnExpand(event, treeId, treeNode);
				}
			} else if (treeNode.level > 0) {
				messageCenter.requestDocList(getParamsFromTreeNode(treeNode));
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
					treeElem.addClass("showIcon");
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
			messageCenter = messageHandler;
			initTree(id);
		}

		this.init = init;
	}
	var controller = new ZtreeController();

	exports.init = controller.init;
});