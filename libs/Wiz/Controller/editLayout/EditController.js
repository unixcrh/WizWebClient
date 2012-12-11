define(function (require, exporst, module) {
	var _id = {
		CategoryCtSpan: 'params_category',
		CategoryTree: 'category_tree',
		TagCtSpan: 'params_tag',
		TagTree: 'tag_tree',
		EditorCt: 'wiz_edit_area',
		TitleInput: 'title_input',
		SaveTipDiv: 'save_tip'
	},
		_class = {
			tagSpan: 'edit-tag-span'
		},

		
		zTreeBase = require('../../../component/zTreeBase'),
		GlobalUtil = require('../../../common/util/GlobalUtil'),
		_locale = require('locale'),

		_lastGuid = null,
		_defaultLocation = _locale,
		_editor = null,
		_docInfo = {},
		// 保存当前选中的标签列表
		_tagsList = [],

		_messageCenter = null,
		_categoryTreeRoot = null,
		_tagTreeRoot = null;

	function EditController () {

		initEditor();

		function show(categoryObj) {
			resetAll();

			// TODO动态加载编辑器的script
			if (typeof categoryObj.location === 'string' && typeof categoryObj.localeLocation === 'string'&& categoryObj.location.length > 2) {
				_docInfo.category = categoryObj.location;
				$('#' + _id.CategoryCtSpan).html(categoryObj.localeLocation);
			} else {
				_docInfo.category = '/My Notes/';
				$('#' + _id.CategoryCtSpan).html('/我的笔记/');
			}
			if (_editor !== null) {
				_editor.setContent('');
			}
			_lastGuid = null;
			$('#' + _id.SaveTipDiv).html('');
			$('#' + _id.TitleInput).val('');
			console.log(_categoryTreeRoot);
			if (_categoryTreeRoot === null) {
				initCateSpanHandler();
			}
		};

		function initEditor() {
	    _editor = new UE.ui.Editor();
	    _editor.render(_id.EditorCt);
		}

		function initTree() {
			var setting = zTreeBase.getDefaultSetting(),
					categoryNodes = _messageCenter.getNodesInfo('category');
					tagNodes = _messageCenter.getNodesInfo('tag');
			setting.callback = {
				onClick : categoryTreeOnClick,
				onExpand: zTreeOnExpand,
				beforeRename: zTreeBeforeRename
			};
			_categoryTreeRoot =  initAndGetRoot(_id.CategoryTree, setting, categoryNodes);
			// 标签的回调方法和目录不一样，单独写
			setting.callback.onClick = tagTreeOnClick;
			setting.callback.onCheck = tagTreeOnCheck;
			setting.check = {
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y" : "", "N" : "" }
			};
			setting.view.dblClickExpand = false;
			_tagTreeRoot = initAndGetRoot(_id.TagTree, setting, tagNodes);
			bindBodyClickHandler();
	    initFrameBodyClickHandler();
		}

		function initAndGetRoot(containerId, setting, nodesInfo) {
			var treeRoot = $.fn.zTree.init($("#" + containerId), setting, nodesInfo);
			var treeElem = $("#" + containerId);
			treeElem.hover(function () {
				if (!treeElem.hasClass("showIcon")) {
					treeElem.fadeIn().addClass("showIcon");
				}
			}, function() {
				treeElem.removeClass("showIcon");
			});
			return treeRoot;
		}


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


		// 标签树点击后触发事件
		function tagTreeOnClick(event, treeId, treeNode) {
			// 点击时，触发check事件
			var checked = treeNode.checked;
			_tagTreeRoot.checkNode(treeNode, !checked, true);
			if (!checked) {
				addAndShowTags(treeNode);
			} else {
				removeTag(treeNode.tag_guid);
			}
		}

		function tagTreeOnCheck(event, treeId, treeNode) {

			if (treeNode.checked === true) {
				addAndShowTags(treeNode);	
			} else {
				removeTag(treeNode.tag_guid);
			}
		}

		// 将当前treeNode加入到tagList中，并显示
		function addAndShowTags(treeNode) {
			if (bTagAdded(treeNode.tag_guid)) {
				return;
			}
			var container = document.getElementById(_id.TagCtSpan);
			if (!_tagsList || _tagsList.length < 1) { 
				removeTagHelp();
			}
			var name = treeNode.name;
			var tagSpan = document.createElement('span');
			tagSpan.innerText = name;
			tagSpan.id = treeNode.tag_guid;
			// 设置默认的style
			tagSpan.className = _class.tagSpan;
			container.appendChild(tagSpan);

			// 缓存
			_tagsList.push(treeNode.tag_guid);
		}

		function showTagHelp() {
			$('#' + _id.TagCtSpan).html("点击此处添加标签");
		}

		function removeTagHelp() {
			console.log('removeTagHelp');
			$('#' + _id.TagCtSpan).html("");
		}

		function bTagAdded(tagGuid) {
			var bAdded = false,
					tagElem = document.getElementById(tagGuid);
			console.log(tagElem);
			if (tagElem ) {
				bAdded = true;
			}
			return bAdded;
		}

		// 切换到编辑页面，重置页面
		function resetAll() {
			_tagsList = [];
			_docInfo = {};
			_lastGuid = null;
			showTagHelp();
			unSelectAllTagNodes();
			hideTreeContainer();
		}

		// 切换到编辑页面时，首先清除上次的选择
		function unSelectAllTagNodes() {
			if (_tagTreeRoot) {
				_tagTreeRoot.checkAllNodes(false);	
			}
		}
		// 切换到编辑页面时，要隐藏之前展开的树节点
		function hideTreeContainer() {
			$('#' + _id.CategoryTree).hide();
			$('#' + _id.TagTree).hide();
		}

		// 取消选择时，删除显示
		function removeTag(tagGuid) {
			$('#' + tagGuid).remove();
			var index = _tagsList.indexOf(tagGuid);
			_tagsList.splice(index, 1);

			// 删除后，需要判断是否是最后一个，如果是最后一个，需要显示帮助信息
			var length = _tagsList.length;
			if (length === 0) {
				showTagHelp();
			}
		}

		function categoryTreeOnClick(event, treeId, treeNode) {
			var nodeLocation = treeNode.location,
				displayLocation = treeNode.displayLocation;
			_docInfo.category = nodeLocation;
			$('#' + _id.CategoryCtSpan).html(displayLocation);
			$("#" + _id.CategoryTree).hide(500);
		}

		function zTreeOnExpand(event, treeId, treeNode) {
			//bLoading参数为了防止多次加载同一数据
 			if (treeNode.bLoading) {
 				return;
 			}
 			zTreeBase.loadingNode(treeNode);
 			console.log(treeNode);
			//获取到当前的kb_guid
			_messageCenter.getChildNodes(treeNode, function(data) {
				var treeRoot = null
				if (treeNode.type === 'category') {
					treeRoot = _categoryTreeRoot;
				} else if (treeNode.type === 'tag') {
					treeRoot = _tagTreeRoot;
				}
				zTreeBase.addChildToNode(treeRoot, data.list, treeNode);
			});
		}

		function initCateSpanHandler() {
			document.getElementById('params_category').onclick = function() {
				// 点击目录信息时再加载左侧树 
				if (_categoryTreeRoot === null) {
					initTree();	
				}
				$("#" + _id.CategoryTree).toggle(500);
			};
			document.getElementById('params_tag').onclick = function() {
				console.log('params_tag click');
				// 点击目录信息时再加载左侧树 
				if (_tagTreeRoot === null) {
					initTree();	
				}
				$("#" + _id.TagTree).toggle(500);
			};
		}

		// 获取当前新建或编辑的文档信息及内容
		function getDocumentInfo() {
			var documentInfo ={};
			documentInfo.body = _editor.getAllHtml();
			documentInfo.category = _docInfo.category;
			documentInfo.title = $('#' + _id.TitleInput).val();
			if (_lastGuid) {
				documentInfo.guid = _lastGuid;
			}
			documentInfo.tag_guids = collectTagGuids();
			console.log(typeof documentInfo.tag_guids);
			if (documentInfo.title === '' || documentInfo.title.length < 0) {
				// TODO 提示
				return null;
			}
			return documentInfo;
		}

		// 获取当前缓存的所有tagGuid
		function collectTagGuids() {
			var tagGuids = ''
			if (_tagsList && _tagsList.length > 0) {
				tagGuids = _tagsList.toString().replace(/\,/g, ';');
			}
			return tagGuids;
		}

		// 正在保存
		function nowSaving() {
			var savingMsg = _locale.EditPage.Saving;
			$('#' + _id.SaveTipDiv).html(savingMsg);
		}

		// 单击保存按钮后，回调方法
		function saveCallback(docGuid) {
			if (_lastGuid === null) {
				_lastGuid = docGuid;
			}
			var savedMsg = _locale.EditPage.Saved;
			var curTime = getCurTime();
			var msg = savedMsg.replace('{time}', curTime);
			$('#' + _id.SaveTipDiv).html(msg);
		}

		function getCurTime() {
			var curDate = new Date();
			var hours = curDate.getHours();
			var minutes = curDate.getMinutes();
			var timeStr = '';
			if (minutes < 10) {
				timeStr = hours + ':0' + minutes; 
			} else {
				timeStr = hours + ':' + minutes; 	
			}
			return timeStr;
		}

		// 点击iframe时，触发document.body.click事件
		function initFrameBodyClickHandler() {
			var fdoc = getFrameDocument(document.getElementById('baidu_editor_0'));
			var oldFunc = fdoc.body.onclick;
			fdoc.body.onclick = function (event) {
				GlobalUtil.fireEvent(document.body, 'click');
				if (oldFunc) {
					oldFunc(event);
				}
			}
		}
		function getFrameDocument(frameObj) {
			var fdoc = (frameObj.contentDocument) ? frameObj.contentDocument
					: frameObj.contentWindow.document;//兼容firefox和ie
			return fdoc;
		}

		function bindBodyClickHandler() {
			$(document).click(function(event){
		  	var menuList = $('.edit-tree');
		  	var length = menuList.length;
		  	var id = null;

		  	var obj = {
		  		'params-tags': 'category_tree',
		  		'params-category': 'tag_tree'
		  	}
		  	if($(event.target).parents('.params-tags')[0]) {
		  		id = 'params-tags';
		  	}
		  	if($(event.target).parents('.params-category')[0]) {
		  		id = 'params-category';
		  	}
		    if(id === null){
		    	for (var i = 0; i < length; i ++) {
		    		$(menuList[i]).hide(500);
		    	}
		    }
		  });
		}

		function initMessageHandler(messageHandler) {
			_messageCenter = messageHandler;
		}

		return {
			show: show,
			getDocumentInfo: getDocumentInfo,
			nowSaving: nowSaving,
			saveCallback: saveCallback,
			initMessageHandler: initMessageHandler
		}
	 }

	module.exports = new EditController();
});