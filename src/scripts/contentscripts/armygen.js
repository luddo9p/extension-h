const armyGen = async function () {
  try {
    const gameId = await localforage.getItem('currentGameId');
    let planets = await localforage.getItem(`${gameId}-currentPlanets`);

    let xillors = [];
    let azterks = [];
    let humans = [];

    const formTable = document.querySelector('form table');
    const rows = formTable.querySelectorAll('tr');

    rows.forEach((row, i) => {
      if (i === 0) {
        const newTd = document.createElement('td');
        newTd.width = '120';
        newTd.textContent = 'Race';
        row.querySelectorAll('td')[1].after(newTd);
      } else {
        const planetElement = row.querySelector('td a');
        const planetName = planetElement.textContent.trim();

        const findPlanet = planets.data.find(p => p.name === planetName);

        if (findPlanet) {
          const armyCountText = row.querySelectorAll('td')[3].textContent.trim();
          const armyCount = isNaN(armyCountText) || armyCountText === '' ? 0 : Math.round(Number(armyCountText));

          // Ajout du nombre d'armées dans les bonnes catégories en fonction de raceId
          switch (findPlanet.raceId) {
            case 2:
              xillors.push(armyCount);
              break;
            case 1:
              azterks.push(armyCount);
              break;
            case 0:
              humans.push(armyCount);
              break;
          }

          const raceTd = document.createElement('td');
          raceTd.className = 'highlight';
          raceTd.textContent = Hyp.races[findPlanet.raceId];
          row.querySelectorAll('td')[1].after(raceTd);

          const checkbox = row.querySelector('.checkbox');
          checkbox.classList.add('race-' + findPlanet.raceId);
          checkbox.checked = false;
        }
      }
    });

    const form = document.querySelector('form');
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats';
    statsDiv.innerHTML = `
      <span class="highlight">Xillors: ${xillors.reduce((a, b) => a + b, 0)}/day</span> - 
      <span class="highlight">Azterks: ${azterks.reduce((a, b) => a + b, 0)}/day</span> - 
      <span class="highlight">Humans: ${humans.reduce((a, b) => a + b, 0)}/day</span>
    `;
    form.before(statsDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';
    buttonsDiv.innerHTML = `
      <button class="switch-race" data-check="1" data-race="2">🔘 Xillors</button>
      <button class="switch-race" data-check="1" data-race="1">🔘 Azterk</button>
      <button class="switch-race" data-check="1" data-race="0">🔘 Humans</button>
    `;
    form.before(buttonsDiv);

    // Gestion des clics sur les boutons de changement de race
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('switch-race')) {
        const raceId = parseInt(e.target.getAttribute('data-race'));
        const checked = parseInt(e.target.getAttribute('data-check'));

        document.querySelectorAll(`.race-${raceId}`).forEach(checkbox => {
          checkbox.checked = checked ? true : false;
        });

        e.target.setAttribute('data-check', checked ? 0 : 1);
      }
    });
  } catch (error) {
    console.error('An error occurred while generating armies:', error);
  }
};

if (document.querySelector('.formTitle')?.textContent === 'Global armies generation manager') {
  armyGen();
}