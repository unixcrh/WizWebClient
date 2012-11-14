define(function (require, exports, module) {
	function renderList(docList) {
		console.log('DocList.renderList() ');
		console.log(docList);
		renderDocsList(null, null, docList);
	}

	/**
	 * 展示文档列表
	 */
	function renderDocsList(kbGuid,tagGuid,docs){
	  var docList = $('#docList_containner');  
	  if(docs.length == 0){
	    return ;
	  }

	  var content = '<table class="table table-striped" >';
	  content += '<tbody>';
	  $.each(docs,function(i,item){
	    content += '<tr><td class="CK"></td><td id=' +item.document_guid+ ' style="cursor:pointer" >' 
	      + item.document_title
	      + '<br/><span style="color:#AAAAAA">' + formatDate(item.dt_modified)
	      + '</span></td></tr>';
	  });
	  content +='</tbody>';
	  content +='</table>';
	  docList.empty().append(content);
	}

	function formatDate(dateStr) {
		var date = new Date(dateStr);
		return date.toLocaleDateString();
	}

	//接口
	return {
		show: renderList
	}
});