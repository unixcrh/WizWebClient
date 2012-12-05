define(function (require, exporst, module) {
	var _id = {
		CONTAINER: 'edit_page',
		SAVEANDQUITCT: 'save_and_quit_ct',
		SAVECT: 'save_ct',
		CANCELCT: 'cancel_ct'
	};

	 function EditController () {

		function show() {
			// TODO动态加载编辑器的script
			$('#' + _id.CONTAINER).removeClass('hidden');
			$('#' + _id.SAVEANDQUITCT).removeClass('hidden');
			$('#' + _id.SAVECT).removeClass('hidden');
			$('#' + _id.CANCELCT).removeClass('hidden');
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