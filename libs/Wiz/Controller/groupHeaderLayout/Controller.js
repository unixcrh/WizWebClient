define(function (require, exports, module) {

	var _messageCenter = null;
	var remote = require('Wiz/remote');

	var _node = {
		groupClass: 'group-per',
		listClass: 'group-list'
	}

	$('#group_ctrl').bind('click',	function (evt){
		$('.header_group_ct').show();
		$('.header_group_ct').animate({height: '126px'}, 200);
		$('body').append('<div class="header_group_bg"></div>');

		$('.header_group_bg').bind('click', function (evt){
			$('.header_group_ct').animate({height: '0'}, 200);

			setTimeout(function(){
				$('.header_group_ct').hide();
				$('.header_group_bg').remove();
			}, 200);
		});
	});

	function renderList(kbList) {
		var content = '<div><ul class="'
			+ _node.listClass + '">';
		$.each(kbList, function (index, kb) {
			console.log(index);
			content = content + '<li><a class ="'
				+ _node.groupClass 
				+ '"><span></span><span>'
				+ kb.kb_name
				+ '</span></a></li>';
		});
		content += '</ul></div>';
		$('.header_group_ct').append(content);
	}


	function initList() {
		remote.getGroupKbList(function (data) {
			renderList(data.list);
		});
	}

	function init(messageCenter) {
		_messageCenter = messageCenter;
		initList();
	}

	return {
		init: init
	}
});