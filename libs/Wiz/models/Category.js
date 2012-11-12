define(function (require, exports, module) {

	function Category() {
	}
	Category.changeSpecilaLoction = function (location) {
	// $.each(specialLocation, function (key, value) {
	// 	var index = location.indexOf(key);

	// 	if (index === 0 && location === key) {
	// 		location = value;
	// 		return false;
	// 	}
	// 	if (index === 1 && location.indexOf('/') === 0) {
	// 		location = '/' + value + location.substr(key.length + 1);
	// 		return false;
	// 	}
	// });
	return location;
}
	//需要国际化的目录名称
	Category.specialLocation = {
		// 'My Notes' : chrome.i18n.getMessage('MyNotes'),
		// 'My Mobiles' : chrome.i18n.getMessage('MyMobiles'),
		// 'My Drafts' : chrome.i18n.getMessage('MyDrafts'),
		// 'My Journals' : chrome.i18n.getMessage('MyJournals'),
		// 'My Events' : chrome.i18n.getMessage('MyEvents'),
		// 'My Contacts' : chrome.i18n.getMessage('MyContacts'),
		// 'My Tasks' : chrome.i18n.getMessage('MyTasks'),
		// 'Deleted Items' : chrome.i18n.getMessage('DeletedItems'),
		// 'My Sticky Notes' : chrome.i18n.getMessage('MyStickyNotes'),
		// 'Inbox' : chrome.i18n.getMessage('Inbox'),
		// 'Completed' : chrome.i18n.getMessage('Completed'),
		// 'My Photos' : chrome.i18n.getMessage('MyPhotos'),
		// 'My Emails' : chrome.i18n.getMessage('MyEmails')
	}

	module.exports = Category;
});