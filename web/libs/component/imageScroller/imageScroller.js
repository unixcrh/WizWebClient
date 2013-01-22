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
		overlayLink: 'FloatRight',
		header: 'Header',
		content: 'Content',
		btnNext: 'NavButton Next',
		btnPrev: 'NavButton Prev',
		btnPress: 'Press',
		btnHover: 'Hover'
	},
	_jqElem = {
		A: '<a/>',
		DIV: '<div>',
		SPAN: '<span/>',
		IMG: '<img/>'
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
		containerElem: null,
		showOverlay: false
	},
	_mediasContainer = null;//$('.' + _elemClass.mediaOuterContainer);


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
			if (_config.containerElem === null) {
				return 0;
			}
			var containerWidth = $(_config.containerElem).width();
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
				_mediasContainer.append(curList[i]);	
			}
		}
		function addOperateBtn() {
			operateBtn = new NavButton(_data.itemList.length, getNumPerPage(), show);
			operateBtn.insertInto(_mediasContainer);
		}


		function setItemList(itemList) {
			// 要先显示容器，否则分页部分会出错导致无法显示
			showMedias();
			if (_data.itemList !== []) {
				_data.itemList = [];
				clearItems();
			}
			if (!itemList) {
				return;
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
			setTitle('');
		}

		function clearItems() {
			$('.' + _elemClass.mediaItemContainer).remove();
		}

		function bindHeaderClickHandler() {
			$('.' + _elemClass.header)[0].onclick = switchMediasStatus;
		}

		function switchMediasStatus() {
			$('.' + _elemClass.content).toggle(500);
		}
		function showMedias() {
			$('.' + _elemClass.content).show(500);
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
			_mediasContainer = $('.' + _elemClass.mediaOuterContainer);
		}

		// 根据配置的linkElem信息确定位置
		function initToLinkElem(containerElem) {
			$(containerElem).append(outerHTML);
		}

		function createItemAndBind(item, index) {
			var thumbContainer = $(_jqElem.DIV).addClass(_elemClass.thumbContainer),
				thumb = $(_jqElem.IMG).addClass(_elemClass.thumb).attr('src', _config.thumbImgSrc);

				fileNameContainer = $(_jqElem.DIV).addClass(_elemClass.fileDiv).attr('title', item.name),
				fileSpan = $(_jqElem.SPAN).addClass(_elemClass.fileSpan).html(item.name),
				fileItem = $(_jqElem.DIV).addClass(_elemClass.mediaItem).css(_css.relativePos),
				itemCotainer = $(_jqElem.DIV).css(_css.relativePos).addClass(_elemClass.mediaItemContainer).attr('index', index);

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
			var overlay = $(_jqElem.DIV).addClass(_elemClass.overlay).attr('title', item.name),
					overlaySpan = $(_jqElem.SPAN).addClass(_elemClass.overlaySpan).html(_config.overlayText),
					overlayLink = $(_jqElem.A).addClass(_elemClass.overlayLink).append($(_jqElem.IMG).attr('src', _config.overlayLinkSrc));
			overlay.append(overlaySpan);
			overlay.append(overlayLink);
			return overlay;
		}


		function setTitle(title) {
			$('#' + _id.title).html(title);
		}

		function showContainer() {
			bindResizeHandler();
			if (_config.containerElem) {
				$(_config.containerElem).show();
			}
		}
		function hideContainer() {
			unbindResizeHandler();
			if (_config.containerElem) {
				$(_config.containerElem).hide();
			}
		}

		return {
			init: init,
			setItemList: setItemList,
			setTitle: setTitle,
			show: showContainer,
			hide: hideContainer,
			reset: reset
		}
	};


	var NavButton = function (sum, numPerPage, showFunction) {
		this.jqPrevBtnElem = $(_jqElem.A).addClass(_elemClass.btnPrev).hide();
		this.jqNextBtnElem = $(_jqElem.A).addClass(_elemClass.btnNext).hide();
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
			self.jqPrevBtnElem.addClass(_elemClass.btnPress);
		};
		self.jqNextBtnElem[0].onmousedown = function() {
			self.jqNextBtnElem.addClass(_elemClass.btnPress);
		};
		self.jqPrevBtnElem[0].onmouseup = function() {
			self.jqPrevBtnElem.removeClass(_elemClass.btnPress);
		};
		self.jqNextBtnElem[0].onmouseup = function() {
			self.jqNextBtnElem.removeClass(_elemClass.btnPress);
		};
		self.jqPrevBtnElem[0].onmouseover = function() {
			self.jqPrevBtnElem.addClass(_elemClass.btnHover);
		};
		self.jqNextBtnElem[0].onmouseover = function() {
			self.jqNextBtnElem.addClass(_elemClass.btnHover);
		};
		self.jqPrevBtnElem[0].onmouseout = function() {
			self.jqPrevBtnElem.removeClass(_elemClass.btnHover);
		};
		self.jqNextBtnElem[0].onmouseout = function() {
			self.jqNextBtnElem.removeClass(_elemClass.btnHover);
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