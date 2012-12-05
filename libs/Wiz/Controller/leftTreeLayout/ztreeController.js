define(function (require, exports, module) {
	var treeProperty = require('./treeProperty'),
		messageCenter = null,
		zTree = require('ztree'),
		remote = require('../../remote'),
		context = require('../../context'),

		locale= require('locale'),
		specialLocation = locale.DefaultCategory,

		_curCategory = null;

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
			if (isConSpeCharacters(newName)) {
				alert('Folder name can not contain flowing characters: \\,/,:,<,>,*,?,\",&,\'');
				return false;
			}
			// 新建目录
			var location = '/' + newName + '/';
			treeNode.location = location;
			messageCenter.requestCreateItem(newName, treeNode.type, function (data) {
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
			// 排序
			var childList = [];
			var removeIndex = null;
			// 加入到子节点中
			$.each(respList, function (index, child){

				if (child.location === '/Deleted Items/') {
					// 记录需要删除的节点
					removeIndex = index; 
					return;
				}
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
				childList.push(child);
			});


			childList = sortCategoryList(childList, treeNode.type);
			treeObj.addNodes(treeNode, childList, true);
			// 暂时只对文件夹开放新建功能 lsl 2012-11-29
			if (treeNode.level === 0 && treeNode.type === 'category') {
				console.log(treeNode);
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
			if (treeNode.type === 'category') {
				_curCategory = treeNode.location;
				console.log(treeNode);
				console.log(_curCategory);	
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
			messageCenter = messageHandler;
			initTree(id);
			// 首次加载默认展开目录
			expandCategory();
		}

		// 默认展开根目录节点
		function expandCategory(){
			var nodes = treeObj.getNodes();
			if (nodes.length>1) {
				treeObj.expandNode(nodes[1], true, true, true);
				// expandNode不能响应自定义的事件，需要自行调用一下-----lsl 2012-12.05
				zTreeOnExpand(null, null, nodes[1]);
			}

		}

		// 获取当前目录
		function getCurrentCategory() {
			return _curCategory;
		}

		this.init = init;
		this.getCurrentCategory = getCurrentCategory;
	}
	var controller = new ZtreeController();

	exports.init = controller.init;
	exports.getCurrentCategory = controller.getCurrentCategory;
});