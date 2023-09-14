chrome.storage.local.get(function (storage) {
	var reUrl = /^http:\/\/hyp2.hyperiums.com\//,
		tbody = $('#cache'),
		urls = [];
	$.each(storage, function (url, cache) {
		if (reUrl.test(url)) {
			urls.push(url);
			tbody.append($('<tr>').append([
				$('<td>').append(
					$('<a target="_blank">').attr('href', url).text(url)
				),
				$('<td class="fixed-width">').text(
					moment(cache.time).format('YYYY-MM-DD HH:mm:ss')
				),
			]));
		}
	});

	$('button').click(function () {
		$(this).prop('disabled', true).text('Clearing...');
		chrome.storage.local.remove(urls, function () {
			location.reload(true);
		});
	});
});

