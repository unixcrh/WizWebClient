define(function (require, exports, module) {
	var _messageCenter = null,
		_node = {
			tableId: 'doc_list',
			trClass: 'doc-single',
			inputId: 'doc-check',
			containerId: 'doc_list_containner'
		},
		_action = {
			active: 'doc-active'
		},
		_event = {
			CLICK: 'doc_click'
		},
		_data = {
			docList: {}
		},
		GlobalUtil = require('common/util/GlobalUtil'),
		_containerObj = GlobalUtil.getJqueryObjById(_node.containerId);


	

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
	}


	function requestDocumentBody(docGuid) {
		var doc = _data.docList[docGuid];
		_messageCenter.requestDocumentBody(doc);
	}
	

	function View(id) {
		var _containerId = id;

		function renderList (docs, bSelectFirst) {
			// 清空文档
			flushAll();

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
		    	+ '><td class="CK"><div><input type="checkbox"></div></td><td class="info"><div class="tnd"><div class="dt"><span><a><span>' + GlobalUtil.formatDate(doc.dt_modified)
		      + '</span></a></span></div><div class="title"><span><a>'
		      + doc.document_title
		      + '</a></span></div></div><div></div></td></tr>';

		      try {
		  			_data.docList[doc.document_guid] = doc;
		  		} catch (error) {
		  			console.log(error);
		  		}
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
	
	function init(messageCenter) {
		_messageCenter = messageCenter;
		initHandler();
	}

	// 清空文档列表
	function flushAll() {
		var children = _containerObj.chidren;
		if (children && children.length > 0) {
			_containerObj.chidren[0].remove();
		}
	}

	var view = new View(_node.containerId);
	//接口
	return {
		show: view.renderList,
		init: init
	}
});