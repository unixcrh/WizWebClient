define(function (require, exporst, module) {
	var _id = {
		CONTAINER: 'edit_page'
	};

	 function EditController () {

		function show() {
			// TODO动态加载编辑器的script
			$('#' + _id.CONTAINER).removeClass('hidden');
			initEditor();
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