define(function (require, exporst, module) {
	'use strict';
	// 页面中元素对应的id值
	var _id = {
		categoryCtSpan: 'params_category',
		categoryTree: 'category_tree',
		categoryTip: 'params_category_tip',
		tagCtSpan: 'params_tag',
		tagTree: 'tag_tree',
		tagTip: 'params_tag_tip',
		editorCt: 'wiz_edit_area',
		titleInput: 'title_input',
		saveTipDiv: 'save_tip',
		FrameBase: 'wiz_frame_base',
		editorFrame: 'baidu_editor_0'
	},
		_class = {
			tagDiv: 'edit-tag-span'
		},

		keyCode = {
			S: 83
		},

		zTreeBase = require('/libs/component/zTreeBase'),
		GlobalUtil = require('/libs/common/util/GlobalUtil'),
		_locale = require('/locale/main').EditPage,

		// 编辑器实例
		_editor = null,
		// 缓存当前编辑的文档信息
		_docInfo = {},
		// 保存当前选中的标签列表
		_tagsList = [],
		// 
		_messageCenter = null,
		// 
		_categoryTreeRoot = null,
		_tagTreeRoot = null,
		_baseElem = null,
		_frameDocument = null;

	function EditController () {

		// 初始化操作
		initEditor();
		localizePageMessage();

		function show(docInfo, bNew) {
			resetAll();
			_docInfo = docInfo;
			// 设置目录信息，这里目录需要特殊处理，因为新建的文档也需要有目录信息   2012-12-12 lsl
			// 目录信息必须要显示，所以在判断外
			showCategory();
			if (!bNew) {
				showDoc(docInfo);	
			}
			// TODO 顺序不能变，需要一个单独的开关来控制初始化函数
			// lsl 2012-12-20
			// TODO动态加载编辑器的script
			if (_categoryTreeRoot === null) {
				// 注册监听事件
				initParamsSpanHandler();
				// 初始化树控件
				initTree();
			}
			// 选择相应的标签
    	selectCurTags();
		};

		function showCategory() {
			if (_docInfo.document_location) {
				$('#' + _id.categoryCtSpan).html(_docInfo.displayLocation);
			} else {
				// 如果文档模型中没有category则加载默认category
				_docInfo.document_location = _locale.DefaultFolderObj.location;
				$('#' + _id.categoryCtSpan).html(_locale.DefaultFolderObj.display);
			}
		}

		// 根据文档信息显示
		function showDoc(docInfo) {
			// 文档标题
			$('#' + _id.titleInput).val(_docInfo.document_title);	
			// 设置文档内容			
			_editor.setContent(docInfo.document_body);
			// 设置并选择标签列表
			showAndSaveTags(docInfo.document_tag_guids);
		}

		// 根据标签guid列表，显示名称
		function showAndSaveTags(tagGuids) {
			if (!tagGuids) {
				return [];
			}
			var nameList = [];
			var guidsList = tagGuids.split('*');
			var length = guidsList.length;
			for (var index = 0; index < length; index ++) {
				nameList.push(_messageCenter.getTagName(guidsList[index]));
				addAndShowTags({'tag_guid': guidsList[index], 'name': _messageCenter.getTagName(guidsList[index])});
				_tagsList.push(guidsList[index]);
			}
		}

		function initEditor() {
	    _editor = new UE.ui.Editor();
	    _editor.render(_id.editorCt);
	    _editor.addListener("ready",function(){
	    	editorKeyDownhandler();
			})
		}

		/**
		 * 注册文本输入区域的keydown事件
		 * 调用Ctrl+s保存功能
		 * @return {[type]} [description]
		 */
		function editorKeyDownhandler() {
			var editFrameElem = document.getElementById(_id.editorFrame),
					editorDoc = getFrameDocument(editFrameElem);

      editorDoc.onkeydown = function(event) {
      	event = event || editFrameElem.contentWindow.event;
      	// cmd + s || ctrl + s
      	if ((event.charCode || event.keyCode) === keyCode.S && (event.ctrlKey || event.metaKey)) {
      	 	preventDefaultEvent(event);
      	 _messageCenter.saveDocument(false);
      	}
      };
		}

		/**
		 * TODO 提取到eventHelper中
		 * 阻止默认事件
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
    function preventDefaultEvent(event) {
    	if ( event.preventDefault) {
    	 event.preventDefault();
    	} else {
    	 event.returnValue = false;
    	}
    }

		// 显示本地化页面的显示文字 
		function localizePageMessage() {
			$('#' + _id.categoryTip).html(_locale.FolderSpan);
			$('#' + _id.tagTip).html(_locale.TagSpan);
			$('#' + _id.titleInput).attr('placeholder', _locale.DefaultTitle);
		}

		// 显示的时候再初始化树空间
		function initTree() {
			if (_categoryTreeRoot || _tagTreeRoot) {
				// 存在，则表示已经初始化过 
				return;
			}
			var setting = zTreeBase.getDefaultSetting(),
					categoryNodes = _messageCenter.getNodesInfo('category'),
					tagNodes = _messageCenter.getNodesInfo('tag');
			setting.callback = {
				onClick : categoryTreeOnClick,
				onExpand: zTreeOnExpand,
				beforeRename: zTreeBeforeRename
			};
			_categoryTreeRoot =  initAndGetRoot(_id.categoryTree, setting, categoryNodes);
			// 标签的回调方法和目录不一样，单独写
			setting.callback.onClick = tagTreeOnClick;
			setting.callback.onCheck = tagTreeOnCheck;
			setting.check = {
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y" : "", "N" : "" }
			};
			setting.view.dblClickExpand = false;
			_tagTreeRoot = initAndGetRoot(_id.tagTree, setting, tagNodes);
			bindBodyClickHandler();
			// 注册事件是和tree控件相关联的，所以必须放在初始化tree控件后执行
	    initFrameBodyClickHandler();
		}

		// 初始化树控件，并且获取treeRoot的对象
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


		// 暂时未使用。以后增加树控件修改或新增时，需要该方法
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

		// 标签选中或者取消时的注册事件
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
			var container = document.getElementById(_id.tagCtSpan);
			if (!_tagsList || _tagsList.length < 1) { 
				removeTagHelp();
			}
			var name = treeNode.name;
			var tagDiv = document.createElement('div');
			tagDiv.innerText = name;
			tagDiv.id = treeNode.tag_guid;
			// 设置默认的style
			tagDiv.className = _class.tagDiv;
			container.appendChild(tagDiv);

			// 缓存
			_tagsList.push(treeNode.tag_guid);
		}

		// 显示标签的帮助信息--一般在标签列表为空的时候，显示在标签区域
		function showTagHelp() {
			$('#' + _id.tagCtSpan).html(_locale.TagHelpSpan);
		}

		// 当选中标签时，需要隐藏标签的帮助信息
		function removeTagHelp() {
			$('#' + _id.tagCtSpan).html("");
		}

		// 判断标签是否已经增加
		function bTagAdded(tagGuid) {
			var bAdded = false,
					tagElem = document.getElementById(tagGuid);
			if (tagElem ) {
				bAdded = true;
			}
			return bAdded;
		}

		// 编辑页面重置所有
		function resetAll() {
			_tagsList = [];
			_docInfo = {};
			showTagHelp();
			unSelectAllTagNodes();
			hideTreeContainer();
			// 清空标题
			$('#' + _id.titleInput).val('');
			// 清空保存信息
			$('#' + _id.saveTipDiv).html('');
			// 清空文档内容显示
			_editor.setContent('');		
		}

		// 切换到编辑页面时，首先清除上次的选择
		function unSelectAllTagNodes() {
			if (_tagTreeRoot) {
				_tagTreeRoot.checkAllNodes(false);	
			}
		}
		// 切换到编辑页面时，要隐藏之前展开的树节点
		function hideTreeContainer() {
			$('#' + _id.categoryTree).hide();
			$('#' + _id.tagTree).hide();
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

		/**
		 * 编辑页面目录树点击事件触发方法	
		 * @param  {[type]} event    [description]
		 * @param  {[type]} treeId   [description]
		 * @param  {[type]} treeNode [description]
		 * @return {[type]}          [description]
		 */
		function categoryTreeOnClick(event, treeId, treeNode) {
			changeDocLocation(treeNode);
		}

		// 更改文档的目录信息，并更新显示
		function changeDocLocation(treeNode) {
			var nodeLocation = treeNode.location,
				displayLocation = treeNode.displayLocation;
			_docInfo.document_location = nodeLocation;
			$('#' + _id.categoryCtSpan).html(displayLocation);
			$("#" + _id.categoryTree).hide(500);
		}

		function zTreeOnExpand(event, treeId, treeNode) {
			//bLoading参数为了防止多次加载同一数据
 			if (treeNode.bLoading) {
 				return;
 			}
 			zTreeBase.loadingNode(treeNode);
			//获取到当前的kb_guid
			_messageCenter.getChildNodes(treeNode, function(data) {
				var treeRoot = null;
				if (treeNode.type === 'category') {
					treeRoot = _categoryTreeRoot;
				} else if (treeNode.type === 'tag') {
					treeRoot = _tagTreeRoot;
				}
				var childList = zTreeBase.addChildToNode(treeRoot, data.list, treeNode);
				// TODO 增加后，应该根据当前文档已有的tag_guid来选中结点
				selectCurTags(treeNode.children);
			});
		}

		// 
		function selectCurTags(nodeList) {
			if (_tagsList.length < 1) {
				return;
			}
			if (!nodeList) {
				var nodeList = _tagTreeRoot.getNodes();
			}
			var length = nodeList.length
				, index = 0
				,	node = null;
			for (; index < length; index ++) {
				if ((GlobalUtil.lastIndexOfArray(_tagsList, nodeList[index].tag_guid)) > 0) {
					_tagTreeRoot.checkNode(nodeList[index], true, true);
				}
			}
		}

		/**
		 * 注册标签和目录信息span的事件
		 * @return {[type]} [description]
		 */
		function initParamsSpanHandler() {
			document.getElementById('params_category').onclick = function() {
				// 点击目录信息时再加载左侧树 
				if (_categoryTreeRoot === null) {
					initTree();	
				}
				$("#" + _id.categoryTree).toggle(500);
			};
			document.getElementById('params_tag').onclick = function() {
				// 点击目录信息时再加载左侧树 
				if (_tagTreeRoot === null) {
					initTree();	
				}
				$("#" + _id.tagTree).toggle(500);
			};
		}

		// 获取当前新建或编辑的文档信息及内容
		function getDocumentInfo() {
			if ($('#' + _id.titleInput).val() === '' || $('#' + _id.titleInput).val().length < 0) {
				// TODO 提示
				return null;
			}

			var documentInfo ={};
			documentInfo.document_body = _editor.getAllHtml();
			documentInfo.document_category = _docInfo.document_location;
			documentInfo.document_title = $('#' + _id.titleInput).val();
			documentInfo.document_guid = _docInfo.document_guid;
			var tags = collectTagGuids();
			// 为空不传，如果传入的话，会造成openapi端请求错误
			if (tags && tags.length > 0) {
				documentInfo.document_tag_guids = tags;	
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
			var savingMsg = _locale.Saving;
			$('#' + _id.saveTipDiv).html(savingMsg);
		}

		// 单击保存按钮后，回调方法
		function saveCallback(docGuid) {
			var savedMsg = _locale.Saved;
			var curTime = getCurTime();
			var msg = savedMsg.replace('{time}', curTime);
			$('#' + _id.saveTipDiv).html(msg);
		}

		/**
		 * 获取当前时间，只显示hour:minutes
		 * 数字小于10补零
		 * @return {[type]} [description]
		 */
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
			var fdoc = getFrameDocument(document.getElementById(_id.editorFrame));
			var oldFunc = fdoc.body.onclick;
			fdoc.body.onclick = function (event) {
				// jQuery注册的事件，必须用jQuery触发，否则ie下会出问题
				$(document).trigger('click');
				// GlobalUtil.fireEvent(document.body, 'click');
				if (oldFunc) {
					oldFunc(event);
				}
			}
		}

		/**
		 * 获取iframe的document对象
		 * @param  {[type]} frameObj [description]
		 * @return {[type]}          [description]
		 */
		function getFrameDocument(frameObj) {
			var fdoc = (frameObj.contentDocument) ? frameObj.contentDocument
					: frameObj.contentWindow.document;//兼容firefox和ie
			return fdoc;
		}

		/**
		 * 绑定页面被点击时候的事件
		 * 用来监听是否隐藏左侧树
		 * @return {[type]} [description]
		 */
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

		// 初始化消息中心，负责和主控制器交互消息
		function initMessageHandler(messageHandler) {
			_messageCenter = messageHandler;
		}

		// 公开的接口
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