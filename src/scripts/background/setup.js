chrome.runtime.onInstalled.addListener(function (details) {
	chrome.storage.local.set({browserActionId: ''});

	chrome.storage.sync.get('cfg', function (storage) {
		function mergeObjects(a, b) {
			var k;
			for (k in b) {
				if (typeof a[k] == 'undefined') {
					a[k] = b[k];
				} else if (typeof b[k] == 'object') {
					mergeObjects(a[k], b[k]);
				}
			}
			return a;
		}

		chrome.storage.sync.set({cfg: mergeObjects(storage.cfg || {}, {
			auth: {
				remember: false,
				nickname: ''
			},
			external: {
				isEnabled: false,
				urlPattern: ''
			},
			notifications: {
				periodInMinutes: 1,
				isBadgeOnClickEnabled: false,
				isEnabled: {
					battle: true,
					events: true,
					forums: true,
					pm: true
				},
				isTtsEnabled: {
					battle: false,
					events: false,
					forums: false,
					pm: false
				},
				tick: {
					Build: {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					},
					Battle: {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					},
					Cash: {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					},
					Energy: {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					},
					'Move/Control': {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					},
					'N/A': {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					},
					'Planet': {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					},
					Tech: {
						isEnabled: false,
						isTtsEnabled: false,
						minutesBefore: 5
					}
				},
				ticks: {
					ttsPattern: '%TICK_NAME% tick in %MINUTES_BEFORE% minutes.'
				}
			},
			tts: {
				isEnabled: false,
				voiceName: 'native'
			},
			creditStats: []
		})});
	});

	var notification = {
		type: 'basic',
		title: 'Hyperiums7',
		iconUrl: '/assets/icon_48.png'
	};
	switch (details.reason) {
	case 'install':
		notification.message = 'Hyperiums7 has been installed';
		break;
	case 'update':
		notification.message = 'Hyperiums7 has been updated';
		break;
	case 'chrome_update': break;
	}
	if (notification.message) {
		chrome.notifications.create('installed', notification, function () {});
	}
});
