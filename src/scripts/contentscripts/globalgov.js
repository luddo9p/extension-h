const globalgov = async function () {
  try {
    const gameId = await localforage.getItem('currentGameId');
    let planets = await localforage.getItem(`${gameId}-currentPlanets`);

    // Ajout des boutons pour changer de gouvernement
    const formElement = document.querySelector('form');
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');
    buttonsDiv.innerHTML = `
      <button class="switch-gov" data-check="1" data-gov="2">🔘 Demo</button>
      <button class="switch-gov" data-check="1" data-gov="1">🔘 Auth</button>
      <button class="switch-gov" data-check="1" data-gov="0">🔘 Dict</button>
    `;
    formElement.insertAdjacentElement('beforebegin', buttonsDiv);
    formElement.insertAdjacentHTML('beforebegin', '<br>');

    // Gestionnaire d'événements pour changer de gouvernement
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('switch-gov')) {
        const govId = parseInt(e.target.getAttribute('data-gov'));
        document.querySelectorAll('select').forEach((el) => {
          el.value = govId;
          const event = new Event('change');
          el.dispatchEvent(event); // Simule un événement "change"
        });
      }
    });

    const planetsInfo = await Hyp.getPlanetInfo(); // Appel API Hypothetical pour les infos des planètes
    planetsInfo.forEach((planet) => {
      console.log(planet);
      let color = planet.governmentId === 0 ? '#7c4242' : '';

      // Sélection des éléments en fonction de l'ID de la planète
      const planetLink = document.querySelector(`[href="Planet?planetid=${planet.id}"]`);
      if (planetLink) {
        const parentRow = planetLink.closest('tr');
        const firstCell = parentRow.children[0];
        firstCell.innerHTML += ` - E: <span style="color:yellow">${numeral(planet.numExploits).format('0,0')}</span><br/>`;
      }
    });
  } catch (error) {
    console.error('An error occurred in globalgov:', error);
  }
};

globalgov();
