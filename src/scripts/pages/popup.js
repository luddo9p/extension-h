Hyp.getSession().
	done(function (session) {
		location.href = '/pages/popup/menu.html';
	}).
	fail(function (error) {
		location.href = '/pages/login.html';
	});

