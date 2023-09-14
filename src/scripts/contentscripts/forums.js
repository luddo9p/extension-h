var params = {};

$('body').addClass('forum-page');

$.each(location.search.substr(1).split('&'), function (_, pair) {
	var split = pair.split('=');
	params[split[0]] = split[1];
});

var url;
if (params.action == 'fdispmsg' && params.limit === undefined && params.gotolast) {
	url = $('.paging a').eq(-2).attr('href');
	if (url) {
		location.href = url;
	}
}

$('a').each(function (_, element) {
	element = $(element);
	var url = element.attr('href'),
		matches = /Forums\?action=fdispmsg&forumid=(\d+)&threadid=\d+&fatherthreadid=0$/.exec(url),
		forumId;

	if (matches && matches.length) {
		forumId = parseFloat(matches[1]);
		url += '&gotolast=1';
		element.after([
			' ',
			$('<a>').attr('href', url).text('⇒').attr('title', 'Last page')
		]);

		element.closest('.msgForum').find('a[href*="Alliance?tagid="]').each(function (_, element) {
			element = $(element);
			var matches = /(^\[[^\]]+\]) (.+)$/.exec(element.text());
			element.replaceWith([
				$('<a>').text(matches[1]).attr('href', element.attr('href')),
				' ',
				$('<a>').text(matches[2]).attr('href', 'Forums?action=fenter&forumid=' + forumId)
			]);
		});
	}
});