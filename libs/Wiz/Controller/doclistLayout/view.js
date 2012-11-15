define(function (require, exports, module) {
	var node = {
		CLASS: {
			TITLE: 'doc-title',
			CHECK: 'check'
		},
		ID: {

		}
	};

	function renderList(docList) {

	  var docList = $('#doc_list_containner');  
	  if(docs.length == 0){
	    return ;
	  }

	  console.log(content);
	  var content = '<table id="doclist" class="table table-striped" cellspacing="0" cellpadding="0" unselectable="on">';
	  content += '<tbody>';
	  $.each(docs,function(i,item){
	    content += '<tr><td class="CK"><div><input type="checkbox"></div></td><td class="doc-title" >' 
	      + item.document_title
	      + '<br/><span>' + formatDate(item.dt_modified)
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

	return {
		renderList: renderList;
	}
});