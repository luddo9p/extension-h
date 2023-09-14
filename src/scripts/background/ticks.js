(function (alarmName) {
	chrome.alarms.onAlarm.addListener(function (alarm) {
		if (alarm.name == alarmName) {
			chrome.storage.sync.get('cfg', function (storage) {
				var cfg = storage.cfg,
					isTtsEnabled = cfg.tts.isEnabled,
					ttsPattern = cfg.notifications.ticks.ttsPattern,
					voiceName = cfg.tts.voiceName;

				var now = new Date;
				$.each(Hyperiums7.ticks, function (_, tick) {
					var tickCfg = cfg.notifications.tick[tick.name],
						nextDate = tick.getNextDate(now),
						minutesBefore = Math.round((nextDate.getTime() - now.getTime()) / 60000),
						text = ttsPattern.
							replace('%TICK_NAME%', tick.name).
							replace('%MINUTES_BEFORE%', Math.max(minutesBefore, 1)),
						localStorageName = 'tick.' + tick.name + '.nextDate',
						notificationId = 'tick.' + tick.name;

					if (minutesBefore < tickCfg.minutesBefore) {
						chrome.storage.local.get(localStorageName, function (storage) {
							if (nextDate.getTime() == storage[localStorageName]) {
								return;
							} else {
								storage[localStorageName] = nextDate.getTime();
								chrome.storage.local.set(storage);
								chrome.notifications.clear(notificationId, function (wasCleared) {
								});
							}

							if (tickCfg.isEnabled) {
								chrome.notifications.create(notificationId, {
									title: text,
									message: moment(nextDate).utc().format('YYYY-MM-DD HH:mm:ss'),
									type: 'basic',
									iconUrl: '/assets/icon_48.png'
								}, function (notificationId) {
								});
							}
							if (isTtsEnabled && tickCfg.isTtsEnabled) {
								chrome.tts.speak(text, {
									voiceName: voiceName,
									enqueue: true
								});
							}
						});
					}
				});
			});
		}
	});

	chrome.storage.sync.get('cfg', function (storage) {
		chrome.alarms.create(alarmName, {
			delayInMinutes: 0,
			periodInMinutes: storage.cfg.notifications.periodInMinutes
		});
	});
})('Hyperiums7.ticks');

