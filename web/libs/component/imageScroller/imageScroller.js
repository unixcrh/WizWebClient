(function($) {
	var _elemClass = {
		mainContainer: 'attachment-containner',
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
		startIndex: 0,
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
		var operateBtn = null;
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
			bindResizeHandler();
			showByContainer();
			addOperateBtn();
		}

		function showByContainer() {
			_data.endIndex = _data.pageCount = getNumPerPage();
			show(_data.startIndex, _data.endIndex);
		}

		function getNumPerPage() {
			var containerWidth = mediasContainer.width();
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
			clearItems();
			var curList = _data.itemList.slice(beginIndex, endIndex),
				length = curList.length;

			for (var i=0; i<length; i++) {
				mediasContainer.append(curList[i]);	
			}
		}
		function addOperateBtn() {
			operateBtn = new NavButton(_data.itemList.length, getNumPerPage(), show);
			operateBtn.insertInto(mediasContainer);
		}


		function setItemList(itemList) {
			if (_data.itemList !== []) {
				 reset();
			}
			if(itemList) {
				var length = itemList.length;
				for (var i=0; i<length; i++) {
					var itemElem = createItemAndBind(itemList[i], i);
					_data.itemList.push(itemElem);
				}
				showByContainer();
			}
			// 每次更新list的时候，必须要更新btn的状态
			if (operateBtn !== null) {
				operateBtn.record(_data.itemList.length, getNumPerPage());
				operateBtn.changeView();
			}
		}

		function reset() {
			_data.itemList = [];
			clearItems();
		}

		function clearItems() {
			$('.' + _elemClass.mediaItemContainer).remove();
		}

		function bindHeaderClickHandler() {
			$('.Header')[0].onclick = switchMediasStatus;
		}

		function switchMediasStatus() {
			$('.Content').toggle(500);
		}

		function bindResizeHandler() {
			// 监听窗口改变的事件
			// TODO 监听容器大小改变的事件，需要手动添加			
			window.onresize = function() {
				if (operateBtn !== null) {
					operateBtn.record(_data.itemList.length, getNumPerPage());
				}
			};
		}

		function unbindResizeHandler() {
			window.onresize = null;
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
			if (linkElem) {
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
		function setTitle(title) {
			$('#' + _id.title).html(title);
		}

		function showContainer() {
			$('.' + _elemClass.mainContainer).show();
			bindResizeHandler();
		}
		function hideContainer() {
			$('.' + _elemClass.mainContainer).hide();
			unbindResizeHandler();
		}

		return {
			init: init,
			setItemList: setItemList,
			setTitle: setTitle,
			show: showContainer,
			hide: hideContainer
		}
	};


	var NavButton = function (sum, numPerPage, showFunction) {
		this.jqPrevBtnElem = $('<a/>').addClass('NavButton Prev').hide();
		this.jqNextBtnElem = $('<a/>').addClass('NavButton Next').hide();
		this.record(sum, numPerPage);
		this.show = showFunction;
		this.init();
	};
	NavButton.prototype.init = function () {
		this.initEventHandler();
		this.changeView();
	};
	NavButton.prototype.record = function(sum, numPerPage) {
		var self = this;
		self.sum = sum;
		self.numPerPage = numPerPage;
		self.curPageNum = self.curPageNum ? self.curPageNum : 1;
		self.pageCount = Math.ceil(sum/numPerPage);
		self.changeView();
	};

	NavButton.prototype.initEventHandler = function() {
		var self = this;
		self.jqPrevBtnElem[0].onmousedown = function() {
			self.jqPrevBtnElem.addClass('Press');
		};
		self.jqNextBtnElem[0].onmousedown = function() {
			self.jqNextBtnElem.addClass('Press');
		};
		self.jqPrevBtnElem[0].onmouseup = function() {
			self.jqPrevBtnElem.removeClass('Press');
		};
		self.jqNextBtnElem[0].onmouseup = function() {
			self.jqNextBtnElem.removeClass('Press');
		};
		self.jqPrevBtnElem[0].onmouseover = function() {
			self.jqPrevBtnElem.addClass('Hover');
		};
		self.jqNextBtnElem[0].onmouseover = function() {
			self.jqNextBtnElem.addClass('Hover');
		};
		self.jqPrevBtnElem[0].onmouseout = function() {
			self.jqPrevBtnElem.removeClass('Hover');
		};
		self.jqNextBtnElem[0].onmouseout = function() {
			self.jqNextBtnElem.removeClass('Hover');
		};
		self.jqPrevBtnElem[0].onclick = function() {
			self.showPrev();
		};
		self.jqNextBtnElem[0].onclick = function() {
			self.showNext();
		};
	};
	NavButton.prototype.insertInto = function(jqContainer) {
		jqContainer.append(this.jqPrevBtnElem);
		jqContainer.append(this.jqNextBtnElem );
	};

	NavButton.prototype.showNext = function () {
		if(this.pageCount <= 1 || this.curPageNum === this.pageCount) {
			return;
		}
		this.curPageNum += 1;
		if (this.curPageNum === this.pageCount) {
			this.jqNextBtnElem.hide();
		}
		this.show((this.curPageNum - 1) * this.numPerPage, this.curPageNum * this.numPerPage);
		this.changeView();
	};
	NavButton.prototype.showPrev = function () {
		if (this.pageCount <= 1 || this.curPageNum === 1) {
			return;
		}
		this.curPageNum -= 1;
		if (this.curPageNum === 1) {
			this.jqPrevBtnElem.hide();
		}
		this.show((this.curPageNum - 1) * this.numPerPage, this.curPageNum * this.numPerPage);
		this.changeView();
	};

	NavButton.prototype.changeView = function() {
		var self = this;
		if (self.pageCount <= 1) {
			self.jqNextBtnElem.hide();
			self.jqPrevBtnElem.hide();
			if (self.show) {
				self.show(0, self.sum);
				self.curPageNum = 1;
			}
		} else if (self.curPageNum === 1) {
			self.jqNextBtnElem.show();
			self.jqPrevBtnElem.hide();
		} else if (self.curPageNum === self.pageCount) {
			self.jqNextBtnElem.hide();
			self.jqPrevBtnElem.show();
		} else {
			self.jqNextBtnElem.show();
			self.jqPrevBtnElem.show();
		}
	};

	$.fn.scrollbar = new ScrollBar();
})(jQuery);