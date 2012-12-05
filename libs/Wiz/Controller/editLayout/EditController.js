define(function (require, exporst, module) {
	var _id = {
		CONTAINER: 'edit_page',
		SAVEANDQUITCT: 'save_and_quit_ct',
		SAVECT: 'save_ct',
		CANCELCT: 'cancel_ct'
	},
			_locale = require('locale'),
			_defaultLocation = _locale;

	function EditController () {
		initEditor();

		function show(category) {
			// TODO动态加载编辑器的script
			$('#' + _id.CONTAINER).removeClass('hidden');
			$('#' + _id.SAVEANDQUITCT).removeClass('hidden');
			$('#' + _id.SAVECT).removeClass('hidden');
			$('#' + _id.CANCELCT).removeClass('hidden');
			if (typeof category === 'string' && category.length > 2) {
				$('#params_category').html(category);
			} else {
				$('#params_category').html('/我的笔记/');
			}
		};
		function initEditor() {
	    var editor = new UE.ui.Editor();
	    editor.render("wiz_edit_area");	
		}

		return {
			show: show
		}
	 }

	module.exports = new EditController();
});