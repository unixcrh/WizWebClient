(function($) {
	var _elemClass = {
		mediaOuterContainer: 'MediaStripOuterContainer',
		mediaItemContainer: 'MediaItemContainer',
		mediaItem: 'MediaItem File',
		thumbContainer: 'ThumbContainer',
		thumb: 'Thumb',
		fileDiv: 'FileName',
		fileSpan: 'TextSizeSmall',
		overlay: 'Overlay',
		overlaySpan: 'FloatRight TextSizeSmall',
		overlayLink: 'FloatRight'
	},
	_id = {
		title: 'scroller_title'
	},
	_data = {
		itemList: [],
		startIndex: 0,
		endIndex: -1,
		totalCount: -1
	},
	_css = {
		relativePos: {'position': 'relative'}
	},
	// 初始化默认设置
	_config = {
		thumbImgSrc: '/web/style/images/txt_57.png',
		overlayLinkSrc: '/web/style/images/liveview_download.png',
		overlayText: 'overlay-text',
		showOverlay: false
	},
	mediasContainer = null;//$('.' + _elemClass.mediaOuterContainer);


	var outerHTML = '<div class="Header">' 
				+ '<div class="IconBar" >'
					+ '<a href="#" class="IconContainer" iconindex="1">'
					+ '<div class="Icon">'
					+ '</div>'
		 		+ '</a>'
				+ '</div>'
				+ '<div class="TitleContainer">'
				+ '<div class="Title TitleWithUpper" id="scroller_title" >'
				+ '</div>'
				+ '</div>'
				+ '</div>'

				+ '<div class="Content">'
				+ '<div class="TabSelected">'
				// TODO 左右滑动控制
				+ '<div class="MediaStripOuterContainer"></div></div>';

	var ScrollBar = function() {
		var operateBtn = null;
		/**
		 * 初始化函数，唯一接口	
		 * @param  {[Array]} config [ ]
		 * @return {[type]}        [description]
		 */
		function init(config) {
			initConfig(config);
			initToLinkElem(config.containerElem);
			initContainer();
			setItemList(config.items);
			bindHeaderClickHandler();
			bindResizeHandler();
			showByContainer();
			addOperateBtn();
		}

		function initConfig(config) {
			for (var key in config) {
				_config[key] = config[key];
			}
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
			mediasContainer = $('.' + _elemClass.mediaOuterContainer);
		}

		// 根据配置的linkElem信息确定位置
		function initToLinkElem(containerElem) {
			$(containerElem).append(outerHTML);
		}

		function createItemAndBind(item, index) {
			var thumbContainer = $('<div/>').addClass(_elemClass.thumbContainer),
				thumb = $('<img/>').addClass(_elemClass.thumb).attr('src', _config.thumbImgSrc);

				fileNameContainer = $('<div/>').addClass(_elemClass.fileDiv).attr('title', item.name),
				fileSpan = $('<span/>').addClass(_elemClass.fileSpan).html(item.name),
				fileItem = $('<div/>').addClass(_elemClass.mediaItem).css(_css.relativePos),
				itemCotainer = $('<div>').css(_css.relativePos).addClass(_elemClass.mediaItemContainer).attr('index', index);

			thumbContainer.append(thumb);
			fileNameContainer.append(fileSpan);
			fileItem.append(thumbContainer).append(fileNameContainer);
			if (_config.showOverlay === true) {
				fileItem.append(initAndGetOverlayCt(item));
			}
			itemCotainer.append(fileItem);

			// 绑定事件
			if (item.linkHref) {
				itemCotainer[0].onclick = function() {
					window.open(item.linkHref);
				}	
			} else if(item.onItemclick && typeof item.onItemclick === 'function') {
				itemCotainer[0].onclick = item.onItemclick;
			}
			return itemCotainer;
		}


		function initAndGetOverlayCt(item) {
			var overlay = $('<div/>').addClass(_elemClass.overlay).attr('title', item.name),
					overlaySpan = $('<span/>').addClass(_elemClass.overlaySpan).html(_config.overlayText),
					overlayLink = $('<a/>').addClass(_elemClass.overlayLink).append($('<img/>').attr('src', _config.overlayLinkSrc));
			overlay.append(overlaySpan);
			overlay.append(overlayLink);
			return overlay;
		}


		function setTitle(title) {
			$('#' + _id.title).html(title);
		}

		function showContainer() {
			bindResizeHandler();
		}
		function hideContainer() {
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