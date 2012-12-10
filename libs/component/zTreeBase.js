define(function (require, exports, module) {

	var locale= require('locale'),
			specialLocation = locale.DefaultCategory;

	

	
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

	var ZtreeBaseComponent = {
		// 应用outlook样式，ztree配置view.addDiyDom的函数
		addDiyDom: function(treeId, treeNode) {
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
		},
			/**
		 * 根据返回的列表，显示相应的树节点
		 * @param {Array} respList 服务端返回的列表
		 * @param {object} treeNode 当前的节点
		 */
		addChildToNode: function(treeObj, respList, treeNode) {
			ZtreeBaseComponent.loadedNode(treeNode);
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
				if ('category' === treeNode.type) {
					child.name = ZtreeBaseComponent.changeSpecilaLocation(child.name);
					child.displayLocation = ZtreeBaseComponent.changeSpecilaLocation(child.location);
					// 增加对location的本地化处理，方便其他组件使用
				}
				childList.push(child);
			});


			childList = sortCategoryList(childList, treeNode.type);
			treeObj.addNodes(treeNode, childList, true);
			treeNode.bLoading = true;
			console.log(childList);
			return childList;
		},

		// 增加默认的一些节点，如：新用户下默认的目录、新建目录
		addDefaultNodes: function(treeObj, treeNode, node) {
			var newNode = node;
			treeObj.addNodes(treeNode, newNode, true);
		},
		checkNewName: function(newName) {
			if (newName === '') {
				alert('Folder name can not be null');
				return false;
			}
			if (isConSpeCharacters(newName)) {
				alert('Folder name can not contain flowing characters: \\,/,:,<,>,*,?,\",&,\'');
				return false;
			}
			return true;
		},
		// 节点正在加载中
		loadingNode: function(treeNode) {
			var switchIconId = treeNode.tId + '_switch';
			$('#' + switchIconId).addClass('ico_loading');
		},
		// 节点加载完成
		loadedNode: function(treeNode) {
			var switchIconId = treeNode.tId + '_switch';
			$('#' + switchIconId).removeClass('ico_loading');
		},
		/**
		 * 对特殊的文件夹处理，返回相应的显示名
		 */
		changeSpecilaLocation: function(location) {
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
		},
		getDefaultSetting: function() {
			var setting = {
				view : {
					showLine : false,
					selectedMulti : false,
					showIcon: false,
					addDiyDom: ZtreeBaseComponent.addDiyDom
				},
				data : {
					simpleData : {
						editNameSelectAll: true,
						enable : false
					}
				},
				edit : {
					enable: true,
					drag: {
						isCopy: false,
						isMove: false
					}
				}
			};
	
			return setting;
		}
	};


	module.exports = ZtreeBaseComponent;
	
});