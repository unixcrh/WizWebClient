<<<<<<< HEAD:libs/component/opacity.js
define(function(require, exports, module) {
	var _opacityElem = null;
	var OPACITY_CLASS = 'opacity-layer';

	function initOpacity() {
		_opacityElem = document.createElement('div');
		_opacityElem.className = OPACITY_CLASS;
		document.body.appendChild(_opacityElem);
	};

	function show() {
		if (_opacityElem === null) {
			initOpacity();
		}
		_opacityElem.style.display = 'block';
	}

	function remove() {
		if (_opacityElem.remove){
			_opacityElem.remove();
		} else {
			document.body.removeChild(_opacityElem);
		}
		_opacityElem = null;
	}

	function hide() {
		_opacityElem.style.display = 'none';
	}

	exports.show = show;
	exports.remove = remove;
=======
define(function(require, exports, module) {
	var _opacityElem = null;
	var OPACITY_CLASS = 'opacity-layer';

	function initOpacity() {
		_opacityElem = document.createElement('div');
		_opacityElem.className = OPACITY_CLASS;
		document.body.appendChild(_opacityElem);
	};

	function show() {
		if (_opacityElem === null) {
			initOpacity();
		}
		_opacityElem.style.display = 'block';
	}

	function remove() {
		if (_opacityElem.remove){
			_opacityElem.remove();
		} else {
			document.body.removeChild(_opacityElem);
		}
		_opacityElem = null;
	}

	function hide() {
		_opacityElem.style.display = 'none';
	}

	exports.show = show;
	exports.remove = remove;
>>>>>>> origin/DEV:libs/component/opacity.js
});