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
		};


	// 格式化日期
	function formatDate(dateStr) {
		var date = new Date(dateStr);
		return date.toLocaleDateString();
	}

	function initHandler() {
		var doc = $('#' + _node.containerId);
		doc.delegate('tr', 'click', function (evt) {
			evt = evt || window.event;
			$('.' + _action.active).removeClass(_action.active);
			var curTarget = $(evt.currentTarget);
			curTarget.addClass(_action.active);
			console.log(this.id);
			requestDocumentBody(this.id);
		});
		doc.delegate('tr', 'mouseup', function (evt) {
			evt = evt || window.event;
			$('.' + _action.active).removeClass(_action.active);
			var curTarget = $(evt.currentTarget);
			curTarget.addClass(_action.active);
		})
	}


	function requestDocumentBody(docGuid) {
		var doc = _data.docList[docGuid];
		_messageCenter.requestDocumentBody(docGuid, doc.version);
	}
	

	function View(id) {
		var _containerId = id;

		function renderList (docs) {
			console.log(docs);
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
		    	+ '><td class="CK"><div><input type="checkbox"></div></td><td class="info"><div class="tnd"><div class="dt"><span><a><span>' + formatDate(doc.dt_modified)
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
		}
		this.renderList = renderList;
	}
	
	function init(messageCenter) {
		console.log('docList Controller init');
		_messageCenter = messageCenter;
		initHandler();
	}

	var view = new View(_node.containerId);
	//接口
	return {
		show: view.renderList,
		init: init
	}
});