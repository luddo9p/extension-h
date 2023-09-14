function markup(tag, textarea) {
	var p0 = parseInt(textarea.prop('selectionStart')),
		p1 = parseInt(textarea.prop('selectionEnd'))
		text = textarea.val();

	textarea.val(
		text.substring(0, p0) +
		'<' + tag + '>' +
		text.substring(p0, p1) +
		'</' + tag + '>' +
		text.substring(p1)
	);
}

function insertText(insert, textarea) {
	var p1 = parseInt(textarea.prop('selectionEnd')) || 0,
		text = textarea.val();

	textarea.val(
		text.substring(0, p1) +
		insert +
		text.substring(p1)
	);
}

$('input[name="subject"]').keydown(function (event) {
	if (event.which == 13) {
		event.preventDefault();
		$('textarea').focus();
	}
});

var ownOptGroup, foreignOptGroup, brSelect;
$('textarea[name="msg"], textarea[name="message"]').each(function (i, element) {
	var textarea = $(element);
	textarea.parent();
	textarea.before([
		$('<br/><button tabindex="100" type="button" style="text-weight:bold" title="Bold">B</button>').click(function () {
			markup('b', textarea);
		}),
		' ',
		$('<button tabindex="100" type="button" style="font-style:italic" title="Italic">I</button>').click(function () {
			markup('i', textarea);
		}),
		' ',
		$('<button tabindex="100" type="button" style="font-family:monospace" title="Pre-formated">pre</button><br/><br/>').click(function () {
			markup('pre', textarea);
		}),
		' ',
		$('<label>Fleets:</label>').append(
			$('<select tabindex="100">').
				append([
					'<option>Please select...</option>',
					ownOptGroup = $('<optgroup label="Controlled planets"></optgroup>'),
					foreignOptGroup = $('<optgroup label="Foreign planets"></optgroup>')
				]).
				change(function () {
					insertText('\n[*FL=' + $(this).val() + ']\n', textarea);
				})
		),
		'&nbsp; - &nbsp;',
		$('<label>Battles:</label>').append(
			brSelect = $('<select tabindex="100">').
				append('<option>Please select...</option>').
				change(function () {
					insertText('\n[*BR=' + $(this).val() + ']\n', textarea);
				})
		)
	]);
});

function appendPlanets(planets, optGroup) {
	planets.sort(function (a, b) {
		return a.name.localeCompare(b.name);
	});
	$.each(planets, function (i, planet) {
		if (planet) {
			optGroup.append($('<option>').text(planet.name));
		}
	});
};

if (ownOptGroup) {
	Hyp.getControlledPlanets().done(function (planets) {
		appendPlanets(planets, ownOptGroup);
	});
}
if (foreignOptGroup) {
	Hyp.getForeignPlanets().done(function (planets) {
		appendPlanets(planets, foreignOptGroup);
	});
}

if (brSelect) {
	Hyp.getBattleReports().done(function (reports) {
		var byPlanetName = {};
		var planetNames = [];

		$.each(reports, function (i, report) {
			if (!byPlanetName[report.planetName]) {
				planetNames.push(report.planetName);
				byPlanetName[report.planetName] = [];
			}
			byPlanetName[report.planetName].push(report);
		});

		planetNames.sort(function (a, b) {
			return a.localeCompare(b);
		});

		$.each(planetNames, function (i, planetName) {
			var optGroup = $('<optgroup>').attr('label', planetName);
			$.each(byPlanetName[planetName], function (i, report) {
				optGroup.append($('<option>').val(report.id).text(
					moment(report.date).utc().format('YY-MM-DD HH:mm')
				));
			});
			brSelect.append(optGroup);
		});
	});
}

