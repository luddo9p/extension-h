function setBrowserAction(action) {
	action = action || {};
	chrome.storage.local.set({
		browserActionId: action.id
	});
	chrome.browserAction.setTitle({title: action.title || ''});
	if (action.badge && action.badge.text) {
		chrome.browserAction.setBadgeText({text: action.badge.text});
		chrome.browserAction.setBadgeBackgroundColor({color: action.badge.color || 'white'});
	} else {
		chrome.browserAction.setBadgeText({text: ''});
	}
	if (action.id) {
		chrome.storage.sync.get('cfg', function (storage) {
			if (storage.cfg.notifications.isBadgeOnClickEnabled) {
				chrome.browserAction.setPopup({popup: ''});
			}
		});
	} else {
		chrome.browserAction.setPopup({popup: 'pages/popup.html'});
	}
}

function clearNotification(notificationId) {
	chrome.storage.local.get('browserActionId', function (storage) {
		if (storage.browserActionId == notificationId) {
			setBrowserAction();
		}
	});
	chrome.notifications.clear(notificationId, function (wasCleared) {
	});
}

function onButtonClicked(notificationId, buttonIndex) {
	var viewUrl, acknowledgeUrl;
	switch (notificationId) {
	case 'events':
		viewUrl = Hyperiums7.getServletUrl('Planet?newplanetevents=');
		acknowledgeUrl = Hyperiums7.getServletUrl('Home?ackallpendingevents');
		break;
	case 'forums':
		viewUrl = Hyperiums7.getServletUrl('Forums?action=lastmsg&allforums=no');
		break;
	case 'pm':
		viewUrl = Hyperiums7.getServletUrl('Player?page=Inbox');
		break;
	case 'battle':
		viewUrl = Hyperiums7.getServletUrl('Player?page=Reports');
		break;
	}
	if (viewUrl && buttonIndex == 0) {
		if (!acknowledgeUrl) { // no acknowledge url means events are acknowledged on view
			clearNotification(notificationId);
		}
		window.open(viewUrl);
	} else if (acknowledgeUrl && buttonIndex == 1) {
		clearNotification(notificationId);
		window.open(acknowledgeUrl);
	}
}

chrome.notifications.onClicked.addListener(function (notificationId) {
	onButtonClicked(notificationId, 0);
});

chrome.notifications.onButtonClicked.addListener(onButtonClicked);

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.storage.local.get('browserActionId', function (storage) {
		onButtonClicked(storage.browserActionId, 0);
	});
});

(function (alarmName) {
	chrome.alarms.onAlarm.addListener(function (alarm) {
		if (alarm.name == alarmName) {
			// direct request to avoid caching
			$.ajax(Hyperiums7.getServletUrl('Planet?newplanetevents=')).
				done(function (data, textStatus, jqXHR) {
					Hyperiums7.checkHtmlForEvents(data);
				});
		}
	});

	chrome.storage.sync.get('cfg', function (storage) {
		chrome.alarms.create(alarmName, {
			delayInMinutes: 0,
			periodInMinutes: storage.cfg.notifications.periodInMinutes
		});
	});
})('Hyperiums7.events');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.request == 'updateNotifications') {
		var action, notifications = [], notification;
		if (message.hasForumMessage) {
			action = {
				id: 'forums',
				title: 'New post in alliances forums',
				badge: {text: 'COM', color: '#3c59aa'}
			};
			notifications.push({
				id: action.id,
				options: {
					title: action.title,
					buttons: [{title: 'Click to view last 20 messages from alliances forums'}]
				}
			});
		} else {
			clearNotification('forums');
		}

		if (message.hasPersonalMessage) {
			action = {
				id: 'pm',
				title: 'New personal message',
				badge: {text: 'PM', color: '#5fd077'}
			};
			notifications.push({
				id: action.id,
				options: {
					title: action.title,
					buttons: [{title: 'Click to view message'}]
				}
			});
		} else {
			clearNotification('pm');
		}

		if (message.hasEvents) {
			action = {
				id: 'events',
				title: message.events.length + ' new events',
				badge: {
					text: message.events.length.toString(),
					color: '#ff4444'
				}
			};
			notification = {
				id: action.id,
				options: {
					title: action.title,
					type: 'list',
					items: [],
					buttons: [
						{title: 'Click to view events'},
						{title: 'Click to acknowledge events'}
					]
				}
			};
			$.each(message.events, function (_, event) {
				notification.options.items.push({
					title: moment(event.date).utc().format('D/MM HH:mm'),
					message: event.message
				});
			});
			notifications.push(notification);
		} else {
			clearNotification('events');
		}

		if (message.hasBattleReport) {
			action = {
				id: 'battle',
				title: 'New battle report',
				badge: {text: 'BT', color: '#ff4444'}
			};
			notifications.push({
				id: action.id,
				options: {
					title: action.title,
					buttons: [{title: 'Click to view battle report'}]
				}
			});
		} else {
			clearNotification('battle');
		}

		if (action) {
			chrome.storage.local.get('browserActionId', function (storage) {
				if (storage.browserActionId != action.id) {
					chrome.storage.sync.get('cfg', function (storage) {
						if (
							storage.cfg.tts.isEnabled &&
							storage.cfg.notifications.isTtsEnabled[action.id]
						) {
							chrome.tts.speak(action.title, {voiceName: storage.cfg.tts.voiceName});
						}
					});
				}
			});
		}

		setBrowserAction(action);
		chrome.storage.sync.get('cfg', function (storage) {
			$.each(notifications, function (_, notification) {
				if (storage.cfg.notifications.isEnabled[notification.id]) {
					notification.options.type = notification.options.type || 'basic';
					notification.options.iconUrl = '/assets/icon_48.png';
					notification.options.message = notification.options.message || notification.options.title;
					chrome.notifications.create(
						notification.id,
						notification.options,
						function (notificationId) {
						}
					);
				}
			});
		});
	}
});

