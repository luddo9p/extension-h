chrome.runtime.sendMessage({
	request: 'getNumBackupBuddyLoginsIn7Days'
}, function (numLogins) {
	$('input[name="loginas"]').each(function (_, element) {
		element = $(element);
		var playerId = parseFloat(element.closest('form').
			find('input[name="contactid"]').val());

		element.
			val(element.val() + ' (' + (numLogins[playerId] || 0) + ' login(s) in 7 days)').
			click(function (event) {
				chrome.runtime.sendMessage({
					request: 'recordBackupBuddyLogin',
					playerId: playerId
				});
		});
	});
});

