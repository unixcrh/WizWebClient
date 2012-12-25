define(function( require, exports, module) {
	'use strict';
	function MenuList (setting) {
		this._menuId = setting.menuId;
		this._menuItemClass
	};
	MenuList.prototype._menuId = '';
	MenuList.prototype._menuItemClass = '';
	MenuList.prototype.initOptions = function(setting) {
		this._menuId = setting.menuId;
		this._menuItemClass = setting.menuItemClass;
	};

});