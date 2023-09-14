chrome.storage.sync.get('cfg', function(storage) {
	var cfg = storage.cfg;

	var nicknameInput = $('[name="auth.nickname"]');
	$('[name="auth.remember"]').change(function () {
		var isChecked = $(this).is(':checked');
		nicknameInput.prop({
			disabled: !isChecked,
			required: isChecked
		});
		if (!isChecked) {
			nicknameInput.val('');
		}
	});

	var urlPatternInput = $('[name="external.urlPattern"]');
	$('[name="external.isEnabled"]').change(function () {
		var isChecked = $(this).is(':checked');
		urlPatternInput.prop({
			disabled: !isChecked,
			required: isChecked
		});
	});

	var voiceNameSelect = $('[name="tts.voiceName"]');
	chrome.tts.getVoices(function (voices) {
		voices.sort(function (a, b) {
			return a.voiceName.localeCompare(b.voiceName);
		});
		$.each(voices, function (_, voice) {
			voiceNameSelect.append($('<option>').text(voice.voiceName));
		});
		voiceNameSelect.val(cfg.tts.voiceName);
	});

	$('[name="tts.isEnabled"]').change(function () {
		var isChecked = $(this).is(':checked');
		voiceNameSelect.prop({
			disabled: !isChecked,
			required: isChecked
		});
		$('#test-tts').prop({
			disabled: !isChecked
		});
	});

	var notificationsTBody = $('#notifications tbody');
	$.each({
		battle: 'Battle Report',
		events: 'Event',
		forums: 'Forum post',
		pm: 'Personal message'
	}, function (name, label) {
		notificationsTBody.append($('<tr>').append([
			$('<th>').text(label),
			$('<td class="fixed-width">').append(
				$('<input type="checkbox">').attr('name',
					'notifications.isEnabled.' + name
				)
			),
			$('<td class="fixed-width">').append(
				$('<input type="checkbox">').attr('name',
					'notifications.isTtsEnabled.' + name
				)
			)
		]));
	});

	var ticksTBody = $('#ticks tbody');
	$.each(Hyperiums7.ticks, function (_, tick) {
		ticksTBody.append($('<tr>').append([
			$('<th>').text(tick.name),
			$('<td class="fixed-width">').append(
				$('<input type="checkbox">').attr('name',
					'notifications.tick.' + tick.name + '.isEnabled'
				)
			),
			$('<td class="fixed-width">').append(
				$('<input type="checkbox">').attr('name',
					'notifications.tick.' + tick.name + '.isTtsEnabled'
				)
			),
			$('<td class="fixed-width">').append(
				$('<input class="tiny-number" type="number" min="2" required>').attr('name',
					'notifications.tick.' + tick.name + '.minutesBefore'
				)
			)
		]));
	});

	$('#all-ticks-enable, #all-ticks-enable-tts').change(function () {
		var checkbox = $(this);
		var td = checkbox.closest('td, th');
		td.
			closest('table').
			find('tbody tr td:nth-child(' + (td.index() + 1) + ') input').
			prop('checked', checkbox.prop('checked'));
	});

	$('#all-ticks-minutes-before').on('keyup change', function () {
		var input = $(this);
		var td = input.closest('td, th');
		td.
			closest('table').
			find('tbody tr td:nth-child(' + (td.index() + 1) + ') input').
			val(input.val());
	});

	$('#test-tts').click(function (event) {
		var voiceName = voiceNameSelect.val();
		chrome.tts.speak(voiceName, {voiceName: voiceName});
	});

	$('#test-tick-tts').click(function (event) {
		var voiceName = voiceNameSelect.val();
		var text = $('[name="notifications.ticks.ttsPattern"]').val().
			replace('%TICK_NAME%', 'Battle').
			replace('%MINUTES_BEFORE%', 5);
		chrome.tts.speak(text, {voiceName: voiceName});
	});

	$('#save-and-close').click(function () {
		$('form').data('close', true);
	});

	function setElementValues(values, parentKey) {
		$.each(values, function (key, value) {
			if (parentKey) {
				key = parentKey + '.' + key;
			}
			if (typeof value == 'object') {
				setElementValues(value, key);
			} else {
				var element = $('[name="' + key + '"]');
				if (typeof value == 'boolean') {
					element.prop('checked', value).change();
				} else {
					element.val(value);
				}
			}
		});
	}
	setElementValues(cfg);

	function setConfigValue(key, value) {
		var parentCfg = cfg,
			keys = key.split('.'),
			lastKeyIndex = keys.length - 1;

		$.each(keys, function (i, key) {
			if (lastKeyIndex == i) {
				if (typeof parentCfg[key] == 'boolean') {
					parentCfg[key] = value;
				} else if (typeof parentCfg[key] == 'number') {
					parentCfg[key] = parseFloat(value);
				} else if (typeof parentCfg[key] == 'string') {
					parentCfg[key] = '' + value;
				}
				return;
			}

			if (parentCfg[key] === undefined) {
				parentCfg[key] = {};
			}
			parentCfg = parentCfg[key];
		});
	}

	$('form').submit(function (event) {
		event.preventDefault();
		var form = $(this);

		$('input[name], select[name], textarea[name]').each(function (_, element) {
			element = $(element);
			var value;
			if (element.attr('type') == 'checkbox') {
				value = element.is(':checked');
			} else {
				value = element.val();
			}
			setConfigValue(element.attr('name'), value);
		});

		chrome.storage.sync.set({cfg: cfg}, function () {
			alert('Options have been saved.');
			// reload background page because of alarm setting
			chrome.runtime.getBackgroundPage(function (backgroundPage) {
			});
			if (form.data('close')) {
				window.close();
			}
		});
	});
});

