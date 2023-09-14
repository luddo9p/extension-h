moment.duration.fn.format = function () {
	var hours = this.asHours(), days, out = [];
	if (hours > 24) {
		days = Math.floor(hours / 24);
		hours = hours % 24;
	}

	if (days == 1) {
		out.push('1 day');
	} else if (days > 1) {
		out.push(days + ' days');
	}

	if (hours == 1) {
		out.push('1 hour');
	} else {
		out.push(hours + ' hours');
	}
	return out.join(' ');
}

