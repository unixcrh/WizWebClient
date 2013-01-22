define(function (require, exports, module) {
	'use strict'
	var _messageCenter = null,
		_node = {
			groupClass: 'group-per',
			listClass: 'group-list',
			bgClass: 'header-group-bg',						//背景div，为了遮挡页面内的其他内容
			containerClass: 'header-group-ct',
			groupEntryId: 'group_ctrl'
		},
		_setting = {
			height: '126px',
			animate_delay_ms: 200
		},
		_groupScrollerCtrl =  new $.fn.scrollbar(),
		mainContainer = getJqElemByClassName(_node.containerClass);

	function getJqElemByClassName(className) {
		return $('.' + className);
	}

	function getJqElemById(id) {
		return $('#' + id);
	}

	function initialize() {
		var entrySelector = getJqElemById(_node.groupEntryId),
				containerSelector = getJqElemByClassName(_node.containerClass);

		entrySelector.css('display', 'inline-block');
		entrySelector.bind('click',	function (evt){
			containerSelector.show();
			containerSelector.animate({height: _setting.height}, _setting.animate_delay_ms);

		// 增加浮动层，防止点击页面内其他内容
			addBackgroundDiv(containerSelector);
		});
	}

	function initScroller() {
		var config = {
			containerElem: mainContainer,
			thumbImgSrc: 'https://a.gfx.ms/is/invis.gif',
			overlayText:  '群组入口',
			contentId: 'group_list_wrap',
			bThumbCtRamdomBgColor: true,
			showHeader: false,
			autoShow: false
		};
		_groupScrollerCtrl.init(config);
	}


	function addBackgroundDiv(containerSelector) {
		$('body').append('<div class="'+ _node.bgClass + '"></div>');
		// 动态注入的元素，需要加载后再获取选择器对象
		var bgSelector = getJqElemByClassName(_node.bgClass);
		var hideContainner = function (evt) {
			var evt = evt ? evt : window.event,
					target = evt.srcElement ? evt.srcElement : evt.target;
			if (target.className ==='group-per') {
				return;
			}
			containerSelector.animate({height: '0'}, _setting.animate_delay_ms);

			setTimeout(function(){
				containerSelector.hide();
				bgSelector.remove();
			}, 200);
		};
		bgSelector.bind('click', hideContainner);
		containerSelector.bind('click', hideContainner);

	}


	function renderList(kbList) {
		var content = '<div><ul class="'
			+ _node.listClass + '">';
		$.each(kbList, function (index, kb) {
			content = content + '<li><a class ="'
				+ _node.groupClass
				+ '" id="' + kb.kb_guid
				+ '"><span></span><span>'
				+ kb.kb_name
				+ '</span></a></li>';
		});
		content += '</ul></div>';
		$('.header_group_ct').append(content);
	}

	function init(messageCenter) {
		_messageCenter = messageCenter;
		// renderList(list);
		initialize();
		initScroller();
	}

	function setGroupList(list) {
		var length = list.length, i;
		for(i=0; i<length; i++) {
			list[i].name = list[i].kb_name;
		}
		_groupScrollerCtrl.setItemList(list);
	}

	return {
		init: init,
		setGroupList: setGroupList
	}
});