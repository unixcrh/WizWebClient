define(function (require, exports, module) {
	function renderList(docList) {
		console.log('DocList.renderList() ');;
		console.log(docList);
	}

	return {
		show: renderList
	}
});