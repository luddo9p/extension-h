function markup(tag, textarea) {
	const p0 = textarea.selectionStart;
	const p1 = textarea.selectionEnd;
	const text = textarea.value;
  
	textarea.value = text.substring(0, p0) +
	  '<' + tag + '>' +
	  text.substring(p0, p1) +
	  '</' + tag + '>' +
	  text.substring(p1);
  }
  
  function insertText(insert, textarea) {
	const p1 = textarea.selectionEnd || 0;
	const text = textarea.value;
  
	textarea.value = text.substring(0, p1) + insert + text.substring(p1);
  }
  
  // Gestionnaire pour l'appui sur la touche entrée dans le sujet
  document.querySelector('input[name="subject"]').addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
	  event.preventDefault();
	  document.querySelector('textarea').focus();
	}
  });
  
  // Gestion des boutons et de la sélection des options dans les textareas
  let ownOptGroup, foreignOptGroup, brSelect;
  
  document.querySelectorAll('textarea[name="msg"], textarea[name="message"]').forEach((element) => {
	const textarea = element;
	const parent = textarea.parentNode;
  
	const boldButton = document.createElement('button');
	boldButton.textContent = 'B';
	boldButton.style.fontWeight = 'bold';
	boldButton.title = 'Bold';
	boldButton.type = 'button';
	boldButton.tabIndex = 100;
	boldButton.addEventListener('click', () => {
	  markup('b', textarea);
	});
  
	const italicButton = document.createElement('button');
	italicButton.textContent = 'I';
	italicButton.style.fontStyle = 'italic';
	italicButton.title = 'Italic';
	italicButton.type = 'button';
	italicButton.tabIndex = 100;
	italicButton.addEventListener('click', () => {
	  markup('i', textarea);
	});
  
	const preButton = document.createElement('button');
	preButton.textContent = 'pre';
	preButton.style.fontFamily = 'monospace';
	preButton.title = 'Pre-formated';
	preButton.type = 'button';
	preButton.tabIndex = 100;
	preButton.addEventListener('click', () => {
	  markup('pre', textarea);
	});
  
	const fleetLabel = document.createElement('label');
	fleetLabel.textContent = 'Fleets:';
  
	const fleetSelect = document.createElement('select');
	fleetSelect.tabIndex = 100;
	fleetSelect.innerHTML = `
	  <option>Please select...</option>
	`;
	ownOptGroup = document.createElement('optgroup');
	ownOptGroup.label = 'Controlled planets';
	foreignOptGroup = document.createElement('optgroup');
	foreignOptGroup.label = 'Foreign planets';
	fleetSelect.appendChild(ownOptGroup);
	fleetSelect.appendChild(foreignOptGroup);
	fleetSelect.addEventListener('change', () => {
	  insertText(`\n[*FL=${fleetSelect.value}]\n`, textarea);
	});
  
	const battleLabel = document.createElement('label');
	battleLabel.textContent = 'Battles:';
  
	brSelect = document.createElement('select');
	brSelect.tabIndex = 100;
	brSelect.innerHTML = '<option>Please select...</option>';
	brSelect.addEventListener('change', () => {
	  insertText(`\n[*BR=${brSelect.value}]\n`, textarea);
	});
  
	parent.insertBefore(document.createElement('br'), textarea);
	parent.insertBefore(boldButton, textarea);
	parent.insertBefore(document.createTextNode(' '), textarea);
	parent.insertBefore(italicButton, textarea);
	parent.insertBefore(document.createTextNode(' '), textarea);
	parent.insertBefore(preButton, textarea);
	parent.insertBefore(document.createTextNode(' '), textarea);
	parent.insertBefore(fleetLabel, textarea);
	parent.insertBefore(fleetSelect, textarea);
	parent.insertBefore(document.createTextNode(' '), textarea);
	parent.insertBefore(battleLabel, textarea);
	parent.insertBefore(brSelect, textarea);
	parent.insertBefore(document.createElement('br'), textarea);
  });
  
  // Fonction pour ajouter des planètes aux listes déroulantes
  function appendPlanets(planets, optGroup) {
	planets.sort((a, b) => a.name.localeCompare(b.name));
	planets.forEach((planet) => {
	  if (planet) {
		const option = document.createElement('option');
		option.textContent = planet.name;
		optGroup.appendChild(option);
	  }
	});
  }
  
  if (ownOptGroup) {
	Hyp.getControlledPlanets().then((planets) => {
	  appendPlanets(planets, ownOptGroup);
	});
  }
  
  if (foreignOptGroup) {
	Hyp.getForeignPlanets().then((planets) => {
	  appendPlanets(planets, foreignOptGroup);
	});
  }
  
  if (brSelect) {
	Hyp.getBattleReports().then((reports) => {
	  const byPlanetName = {};
	  const planetNames = [];
  
	  reports.forEach((report) => {
		if (!byPlanetName[report.planetName]) {
		  planetNames.push(report.planetName);
		  byPlanetName[report.planetName] = [];
		}
		byPlanetName[report.planetName].push(report);
	  });
  
	  planetNames.sort((a, b) => a.localeCompare(b));
  
	  planetNames.forEach((planetName) => {
		const optGroup = document.createElement('optgroup');
		optGroup.label = planetName;
  
		byPlanetName[planetName].forEach((report) => {
		  const option = document.createElement('option');
		  option.value = report.id;
		  option.textContent = moment(report.date).utc().format('YY-MM-DD HH:mm');
		  optGroup.appendChild(option);
		});
  
		brSelect.appendChild(optGroup);
	  });
	});
  }
  