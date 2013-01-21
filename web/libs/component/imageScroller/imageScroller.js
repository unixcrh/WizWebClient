(function($) {
	var _elemClass = {
		mediaOuterContainer: 'MediaStripOuterContainer',
		mediaItemContainer: 'MediaItemContainer',
		mediaItem: 'MediaItem File',
		thumbContainer: 'ThumbContainer',
		thumb: 'Thumb',
		fileDiv: 'FileName',
		fileSpan: 'TextSizeSmall',
		overLay: 'Overlay',
		overlaySpan: 'FloatRight TextSizeSmall',
		overLayLink: 'FloatRight'
	},
	_id = {
		title: 'mpf0_hmlvControl_title'
	},
	_data = {
		itemList: [],
		startIndex: -1,
		endIndex: -1,
		totalCount: -1
	}
	_parentContainer = null,
	mediasContainer = null;//$('.' + _elemClass.mediaOuterContainer);


	var outerHTML = '<div class="attachment-containner">' 
				+ '<div class="Header">' 
				+ '<div class="IconBar" id="mpf0_hmlvControl_uib">'
					+ '<a href="#" class="IconContainer" iconindex="1">'
					+ '<div style="background-image: url(https://a.gfx.ms/attachment.png);" class="Icon">'
					+ '</div>'
		 		+ '</a>'
				+ '</div>'
				+ '<div class="TitleContainer">'
				+ '<div class="Title TitleWithUpper" id="mpf0_hmlvControl_title" >'
				+ '</div>'
				+ '</div>'
				+ '</div>'

				+ '<div class="Content">'
				+ '<div class="TabSelected">'
				// TODO 左右滑动控制
				+ '<div class="MediaStripOuterContainer"></div>'
				+ '</div></div>',

			thumbHTML = '<div class="ThumbContainer" style="height: 160px; width: 120px; background-color: rgb(167, 167, 167);" >'
				+ '<img class="Thumb" src="https://a.gfx.ms//txt_57.png" style="padding-top: 52px;"></div>',
			overlayLinkHTML = '<a href="#" class="FloatRight"><img src="https://a.gfx.ms/liveview_download.png"></a>';
	var ScrollBar = function() {

		/**
		 * 初始化函数，唯一接口	
		 * @param  {[Array]} config [ ]
		 * @return {[type]}        [description]
		 */
		function init(config) {
			initToLinkElem(config.linkElem);
			initContainer(config.linkElem);
			setItemList(config.items);
			bindHeaderClickHandler();
			showByContainer();
		}

		function showByContainer() {
			_data.endIndex = _data.pageCount = getPageCount();
			console.log(_data.endIndex);
			show(_data.startIndex, _data.endIndex);
		}

		function getPageCount() {
			var containerWidth = mediasContainer.width();
			console.log(containerWidth);
			var itemWidth = 130;
			var pageCount = Math.ceil(containerWidth/itemWidth);
			return pageCount;
		}


		/**
		 * 通过指定的开始和结束显示
		 * @param  {[type]} beginIndex [description]
		 * @param  {[type]} endIndex   [description]
		 * @return {[type]}            [description]
		 */
		function show(beginIndex, endIndex) {
			var curList = _data.itemList.slice(beginIndex, endIndex),
				length = curList.length;

			for (var i=0; i<length; i++) {
				mediasContainer.append(curList[i]);	
			}
		}


		function setItemList(itemList) {
			if (_data.itemList !== []) {
				 removeCurList();
			}
			if(itemList) {
				var length = itemList.length;
				for (var i=0; i<length; i++) {
					var itemElem = createItemAndBind(itemList[i], i);
					_data.itemList.push(itemElem);
					mediasContainer.append(itemElem);
				}
			}
		}

		/**
		 * 清除当前显示的列表
		 * @return {[type]} [description]
		 */
		function removeCurList() {
			reset();
			mediasContainer.html('');
			console.log(mediasContainer);
		}

		function reset() {
			_data = {
				itemList: [],
				startIndex: -1,
				endIndex: -1,
				totalCount: -1
			};
		}

		function bindHeaderClickHandler() {
			$('.Header')[0].onclick = switchMediasStatus;
		}

		function switchMediasStatus() {
			$('.Content').toggle(500);
		}

		/**
		 * get parent element
		 * @param  {[type]} linkElem [description]
		 * @return {[type]}          [description]
		 */
		function initContainer(linkElem) {
			if(linkElem) {
				_parentContainer = $(linkElem).parent();
			} else {
				_parentContainer = $(document.body);
			}
			mediasContainer = $('.' + _elemClass.mediaOuterContainer);
		}

		// 根据配置的linkElem信息确定位置
		function initToLinkElem(linkElem) {
			console.log(linkElem);
			if (linkElem) {
				console.log('insertAfter');
				$(outerHTML).insertAfter($(linkElem));
			} else {
				$(document.body).append(outerHTML);
			}
		}		
		function createItemAndBind(item, index) {
			var thumbContainer = $(thumbHTML),
				fileNameContainer = $('<div/>').addClass(_elemClass.fileDiv).attr('title', item.name),
				fileSpan = $('<span/>').addClass(_elemClass.fileSpan).html(item.name),
				overlay = $('<div/>').addClass(_elemClass.overLay).attr('title', item.name),
				overlaySpan = $('<span/>').addClass(_elemClass.overlaySpan).html('下载'),
				overlayLink = $(overlayLinkHTML),
				fileItem = $('<div/>').addClass(_elemClass.mediaItem).css({'position': 'relative'}),
				itemCotainer = $('<div>').css({'position': 'relative'}).addClass(_elemClass.mediaItemContainer).attr('index', index);

			fileNameContainer.append(fileSpan);
			overlay.append(overlaySpan);
			overlay.append(overlayLink);
			fileItem.append(thumbContainer).append(fileNameContainer).append(overlay);
			itemCotainer.append(fileItem);

			if (item.linkHref) {
				itemCotainer[0].onclick = function() {
					window.open(item.linkHref);
				}	
			} else if(item.onItemclick && typeof item.onItemclick === 'function') {
				itemCotainer[0].onclick = item.onItemclick;
			}
			return itemCotainer;
		}

		function refreshItems(itemList) {
			reset();
			initItemList(itemList);
		}

		function reset() {
			_data.itemList = [];
		}

		function setTitle(title) {
			$('#' + _id.title).html(title);
		}

		return {
			init: init,
			setItemList: setItemList,
			setTitle: setTitle
		}
	};
	$.fn.scrollbar = new ScrollBar();
})(jQuery);