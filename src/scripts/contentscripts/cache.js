chrome.runtime.sendMessage({
	request: 'updateAjaxCache',
	url: location.href,
	data: document.documentElement.outerHTML
});

