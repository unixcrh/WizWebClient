define(function (require, exports, module) {
	var treeProterty = require('/conf/treeProperty');
	var GlobalCtrl = require('Wiz/Controller/GlobalController');	//全局的控制器
	var zTree = require('ztree');

	var remote = require('Wiz/remote');
	var context = require('Wiz/context');

	var locale= require('locale');
	var specialLocation = locale.DefaultCategory;

	function ZtreeController() {
		
		var treeObj = null;
		// 'use strict';
		var setting = {
			view : {
				dblClickExpand : dblClickExpand,
				showLine : false,
				selectedMulti : false,
				showIcon: false,
				showIcon: showIconForTree,
				addDiyDom: addDiyDom
			},
			data : {
				simpleData : {
					enable : false
				}

			},
			callback : {
				onClick : zTreeOnClick,
				onExpand: zTreeOnExpand
			}

		},
			zNodesObj = treeProterty;


		function dblClickExpand(treeId, treeNode) {

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
		}

		function showIconForTree(treeId, treeNode) {
			return treeNode.level !== 0;
		};

		function zTreeOnExpand(event, treeId, treeNode) {
			//bLoading参数为了防止多次加载同1数据
 			if (treeNode.bLoading) {
 				return;
 			}
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
			treeNode.bLoading = true;
		} 

		function zTreeOnClick(event, treeId, treeNode) {
			if (treeNode.level === 0 || treeNode.level === 1) {
				treeObj.expandNode(treeNode);
				zTreeOnExpand(event, treeId, treeNode);
			} else if (treeNode.level > 1) {
				// GlobalCtrl.showDocumentList(); 	
			}
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


		this.initTree = initTree;
	}
	var controller = new ZtreeController();

	exports.init = controller.initTree;
});