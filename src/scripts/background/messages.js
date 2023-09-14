chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	switch (message.request) {
	case 'getCookie':
		chrome.cookies.get({
			url: Hyp.url(),
			name: 'HypII2'
		}, function (cookie) {
			sendResponse(cookie);
		});
		return true;
	case 'getAjaxCache':
		chrome.storage.local.get(message.url, function (storage) {
			storage[message.url] = storage[message.url] || { time: 0 };
			var now = new Date().getTime();
			if (storage[message.url].time + 600000 < now) {
				$.ajax(message.url, message.settings).done(function (data) {
					storage[message.url].time = now;
					storage[message.url].data = data;
					chrome.storage.local.set(storage);
					sendResponse(data);
				});
			} else {
				sendResponse(storage[message.url].data);
			}
		});
		return true;
	case 'updateAjaxCache':
		var storage = {};
		storage[message.url] = {
			time: new Date().getTime(),
			data: message.data
		};
		chrome.storage.local.set(storage);
		return true;
	case 'recordBackupBuddyLogin':
		var key = 'backupBuddyLogins.' + message.playerId;
		chrome.storage.sync.get(key, function (storage) {
			if (!storage[key]) {
				storage[key] = [];
			}
			storage[key].push(new Date().getTime());
			chrome.storage.sync.set(storage);
		});
		return false;
	case 'getNumBackupBuddyLoginsIn7Days':
		var sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
		chrome.storage.sync.get(function (storage) {
			var numLogins = [];
			$.each(storage, function (key, logins) {
				var match = /^backupBuddyLogins\.(\d+)$/.exec(key), playerId;
				if (match && match[1]) {
					playerId = parseFloat(match[1]);
					numLogins[playerId] = 0;
					$.each(logins, function (_, login) {
						if (sevenDaysAgo < login) {
							numLogins[playerId]++;
						}
					});
				}
			});
			sendResponse(numLogins);
		});
		return true;
	}
});

