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
		};

	var ScrollBar = function() {

		var _id = {
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
			itemWidth : 130,
			containerElem: null,
			showOverlay: false,
			bThumbCtRamdomBgColor: false,						 // 业务需求，随机每个item的背景颜色值
			autoShow: true,													 // 设置itemList时，是否显示
			showHeader: true,												 // 是否显示头信息
			contentId: ''														 // 如果只有一个视图，则不用填写，如果有多个视图，并且不共享数据，需要设置用以区别
		},
		_mediasContainer = null;//$('.' + _elemClass.mediaOuterContainer);

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
			bindResizeHandler();
			addOperateBtn();
			showByContainer();
			bindResizeHandler();
		}

		function initConfig(config) {
			for (var key in config) {
				_config[key] = config[key];
			}
		}

		function showByContainer() {
			if (_data.itemList.length < 1) {
				return;
			}
			_data.endIndex = _data.pageCount = getNumPerPage();
			show(_data.startIndex, _data.endIndex);
		}

		function getNumPerPage() {
			if (_config.containerElem === null) {
				return 0;
			}
			var containerWidth = $(_config.containerElem).width();
			var itemWidth = _config.itemWidth;
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
			showMediasContainer();
			if (_data.itemList !== []) {
				_data.itemList = [];
				clearItems();
			}
			if (!itemList || itemList.length < 1) {
				return;
			}
			if(itemList) {
				var length = itemList.length;
				for (var i=0; i<length; i++) {
					var itemElem = createAndGetItem(itemList[i], i);
					_data.itemList.push(itemElem);
				}
				showByContainer();
			}
			// 每次更新list的时候，必须要更新btn的状态
			if (operateBtn !== null) {
				operateBtn.record(_data.itemList.length, getNumPerPage());
			}
		}

		function reset() {
			_data.itemList = [];
			clearItems();
			setTitle('');
		}

		function clearItems() {
			_mediasContainer.children('.' + _elemClass.mediaItemContainer).remove();
		}

		function bindHeaderClickHandler() {
			$('.' + _elemClass.header)[0].onclick = switchMediasStatus;
		}

		/**
		 * 获取随机颜色值
		 * @return {[type]} [description]
		 */
		function getRandomColor() {
			var colorList = ['#094ab2', '#5133ab', '#d24726', '#0072c6'],
				index = Math.round(Math.random() * 4);
			return colorList[index];
		}

		function switchMediasStatus() {
			if (_mediasContainer) {
				_mediasContainer.toggle(500);
			}
		}

		/**
		 * 显示items容器
		 * @return {[type]} [description]
		 */
		function showMediasContainer() {
			if (_mediasContainer) {
				_mediasContainer.show(500);
			}
		}


		function bindResizeHandler() {
			// 监听窗口改变的事件
			// TODO 监听容器大小改变的事件，需要手动添加
			var oldFunc = window.onresize;
			window.onresize = function(event) {
				if (operateBtn !== null) {
					console.log(_data.itemList.length);
					console.log(getNumPerPage);
					operateBtn.record(_data.itemList.length, getNumPerPage());
					operateBtn.changeView();
				}
				if (oldFunc) {
					oldFunc(event);
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
			if (_config.contentId === '') {
				_mediasContainer = $('.' + _elemClass.mediaOuterContainer);	
			} else {
				_mediasContainer = $('#' + _config.contentId);
			}
		}

		// 根据配置的linkElem信息确定位置
		function initToLinkElem(containerElem) {
			var headerElem = initAndGetHeader(),
					contentElem = initAndGetContentBody();

			if (_config.showHeader === true) {
				$(containerElem).append(headerElem);
				bindHeaderClickHandler();
			}
			$(containerElem).append(contentElem);

		}

		function createAndGetItem(item, index) {
			var thumbContainer = $(_jqElem.DIV).addClass(_elemClass.thumbContainer),
				thumb = $(_jqElem.IMG).addClass(_elemClass.thumb).attr('src', _config.thumbImgSrc);

				fileNameContainer = $(_jqElem.DIV).addClass(_elemClass.fileDiv).attr('title', item.name),
				fileSpan = $(_jqElem.SPAN).addClass(_elemClass.fileSpan).html(item.name),
				fileItem = $(_jqElem.DIV).addClass(_elemClass.mediaItem).css(_css.relativePos),
				itemCotainer = $(_jqElem.DIV).css(_css.relativePos).addClass(_elemClass.mediaItemContainer).attr('index', index);

			if (_config.bThumbCtRamdomBgColor === true) {
				var colorValueStr = getRandomColor();
				thumbContainer.css({'background-color': colorValueStr});
			}

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

		function initAndGetHeader() {
			var jqHeader = $(_jqElem.DIV).addClass('Header'),
					jqIconBar =	$(_jqElem.DIV).addClass('IconBar'),
					jqIconCt = $(_jqElem.A).addClass('IconContainer'),
					jqIcon = $(_jqElem.DIV).addClass('Icon'),
					jqTitleCt =	$(_jqElem.DIV).addClass('TitleContainer'),
					jqTitle = $(_jqElem.DIV).addClass('Title TitleWithUpper').attr('id', 'scroller_title');

			jqIconCt.append(jqIcon);
			jqIconBar.append(jqIconCt);
			jqTitleCt.append(jqTitle);
			jqHeader.append(jqIconBar).append(jqTitleCt);
			return jqHeader;
		}

		function initAndGetContentBody() {
			var jqContent = $(_jqElem.DIV).addClass('Content'),
					jqTabSelected = $(_jqElem.DIV).addClass('TabSelected'),
					jqMediasCt = $(_jqElem.DIV).addClass('MediaStripOuterContainer').attr('id', _config.contentId);
			jqTabSelected.append(jqMediasCt);
			jqContent.append(jqTabSelected);
			return jqContent;
		}


		function setTitle(title) {
			$('#' + _id.title).html(title);
		}

		function showContainer() {
			if (_config.containerElem) {
				$(_config.containerElem).show();
			}
		}
		function hideContainer() {
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
			if (self.show && self.sum > 0) {
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

	$.fn.scrollbar = ScrollBar;
})(jQuery);