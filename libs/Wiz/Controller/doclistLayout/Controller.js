define(function (require, exports, module) {
	var _messageCenter = null,
		_node = {
			tableId: 'doc_list',
			trClass: 'doc-single',
			inputId: 'doc-check',
			containerId: 'doc_list_containner',
			sortMenuId: 'sort_menu',
			sortListId: 'sort_list'
		},
		_action = {
			active: 'doc-active'
		},
		_event = {
			CLICK: 'doc_click'
		},
		_data = {
			docList: []
		},
		_containerObj = $('#' + _node.containerId);

		function bindSortHandler() { 
			var sortMenuElem = $('#' + _node.sortMenuId),
					sortListElem = $('#' + _node.sortListId);
			sortMenuElem.click(function (event) {
				event = event || window.event;
				// 阻止默认行为
				event.preventDefault();
				event.returnValue = false;
				var visible = sortListElem.css('visibility');
				if (visible === 'visible') {
					sortListElem.css('visibility', 'hidden');
				} else {
					// 必须用DOM来操作，jQuery是获取当前元素对应文档的坐标。
					// 这里只需要获取到同胞元素的坐标即可---lsl---2012-11-27
					var top = document.getElementById(_node.sortMenuId).offsetTop + sortMenuElem.height();
					sortListElem.css('top', top + 'px');
					sortListElem.css('visibility', 'visible');
				}
			});

			// 绑定menu list事件
			var cmdLinkList = sortListElem.children('li').children('a'),
					listLength = cmdLinkList.length;
			for(var index=0; index < listLength; index ++) {
				var cmdLink = cmdLinkList[index];
				$(cmdLink).click(function (event) {
					sortListElem.css('visibility', 'hidden');
					// 阻止默认行为
					if (event.preventDefault) {
						event.preventDefault();	
					} else {
						event.returnValue = false;	
					}
					var target = event.target;
					var nodeName = target.nodeName.toLowerCase();
					if (nodeName !== 'a') {
						target = $(target).parent('a')[0];
					}
					// 根据排序命令刷新当前文档列表
					refreshList($(target).attr('cmd'), $(target).attr('bDes'));
					$('.sort-item-selected').removeClass('sort-item-selected');
					$(target).children('img').addClass('sort-item-selected');
				});
			}
		}

	function bIe() {
		if(document.all) {
			return true;
		}
		return false;
	}

	function initHandler() {
		if (!_containerObj) {
			console.error('DocList Controller Error: _containerObj not found.')
			return;
		}
		_containerObj.delegate('tr', 'click', function (evt) {
			evt = evt || window.event;
			$('.' + _action.active).removeClass(_action.active);
			var curTarget = $(evt.currentTarget);
			curTarget.addClass(_action.active);
			requestDocumentBody(this.id);
		});
		_containerObj.delegate('tr', 'mouseup', function (evt) {
			evt = evt || window.event;
			$('.' + _action.active).removeClass(_action.active);
			var curTarget = $(evt.currentTarget);
			curTarget.addClass(_action.active);
		})
		// 绑定排序功能事件
		bindSortHandler();
	}


	function requestDocumentBody(docGuid) {
		var doc = getDocbyGuid(docGuid);
		_messageCenter.requestDocumentBody(doc);
	}

	function getDocbyGuid(docGuid) {
		var length = _data.docList.length;
		for(var index=0; index<length; index++) {
			var doc = _data.docList[index];
			if (docGuid === doc.document_guid) {
				return doc;
			}
		}
	}

	function refreshList(cmd, bDes) {
		var docList = sortDocList(_data.docList, cmd, bDes);
		// 首先清空当前文档
		flushAll();
		// 开始加载
		view.renderList(docList, null, cmd);
	}
	

	function sortDocList(docList, cmd, bDes) {
		docList.sort(function(a, b) {
			try {
				if (bDes === 'false') {
					return a[cmd].localeCompare(b[cmd]);	
				} else {
					return b[cmd].localeCompare(a[cmd]);
				}
			} catch (error) {
				// TODO记录
			}
			// 默认按照修改日期降序
			return b.dt_modified.localeCompare(a.dt_modified);
		});
		return docList;
	}

	function View(id) {
		var _containerId = id;

		function renderList (docs, bSelectFirst, dateCmd) {
			// 清空文档
			flushAll();

			if ('document_title' === dateCmd) {
				dateCmd = null;
			}

		  var docList = $('#' + _containerId);  
		  if(docs.length == 0){
		    return ;
		  }

		  var content = '<table id="'
		  		+ _node.tableId 
		  		+'" class="table table-striped" cellspacing="0" cellpadding="0" unselectable="on">';
		  content += '<tbody>';
		  $.each(docs,function(i,doc){
		    content += '<tr class = '
		    	+ _node.trClass
		    	+ ' id=' + doc.document_guid
		    	+ '><td class="CK"><div><input type="checkbox"></div></td><td class="info"><div class="tnd"><div class="dt"><span><a><span>' + formatDate(doc[dateCmd?dateCmd:'dt_modified'])
		      + '</span></a></span></div><div class="title"><span><a>'
		      + doc.document_title
		      + '</a></span></div></div><div></div></td></tr>';

		  });
		  content +='</tbody>';
		  content +='</table>';
		  docList.empty().append(content);

		  // 只有初次加载页面时会触发
		  if (bSelectFirst) {
		  	selectFirstNode();
		  }
		}
		// 选择文档列表第一个
		function selectFirstNode() {
			try {
				var firstNodeId = document.getElementById(_node.tableId).firstChild.firstChild.id;
				$('#' + firstNodeId).trigger('click');
			} catch (error) {
				// 无需对此处理
				console.error('Doclist Controller selectFirstNode Error:' + error);
			}
		}

		this.renderList = renderList;
	}

	function formatDate(dateStr) {
		//标准游览器，如果数组里面最后一个字符为逗号，JS引擎会自动剔除它。
		//参考https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Values,_variables,_and_literals?redirectlocale=en-US&redirectslug=Core_JavaScript_1.5_Guide%2FValues%2C_Variables%2C_and_Literals#Literals
		var ie = bIe();
		if (ie) {
			//ie6,7下 new Date(dateStr) 不支持dateStr为xxxx-xx-xx格式，需要转换格式
			dateStr = dateStr.replace(/\-/ig, '/').split('.')[0];
		}
		var date = new Date(dateStr);
		return date.toLocaleDateString();
	}

	function init(messageCenter) {
		_messageCenter = messageCenter;
		initHandler();
	}

	function showDocList(docs, bSelectFirst) {
		_data.docList = sortDocList(docs);
		view.renderList(_data.docList, bSelectFirst);
	}

	// 清空文档列表
	function flushAll() {
		var children = _containerObj.children();
		if (children && children.length > 0) {
			$(children[0]).remove();
		}
	}

	var view = new View(_node.containerId);
	//接口
	return {
		show: showDocList,
		init: init
	}
});