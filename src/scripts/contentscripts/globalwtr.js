const globalwtr = async () => {
  try {
    const gameId = await localforage.getItem('currentGameId');
    const planets = await localforage.getItem(`${gameId}-currentPlanets`);

    // Sélection de toutes les lignes avec les classes .line1 et .line0
    const rows = document.querySelectorAll('.line1, .line0');
    rows.forEach((el) => {
      const planetLink = el.querySelector('.std');
      const planetId = planetLink.getAttribute('href').split('=')[1];
      const planet = planets.data.find(p => p.id === parseInt(planetId));

      if (planet) {
        const popCell = document.createElement('td');
        popCell.innerHTML = `<strong>${planet.pop}M</strong>`;
        el.appendChild(popCell);

        const ecoCell = document.createElement('td');
        ecoCell.innerHTML = `<strong class="eco eco-${planet.eco}">${planet.eco}</strong>`;
        el.appendChild(ecoCell);

        console.log(planet);
      }
    });

    // Insertion du sélecteur pour "Global wtr"
    const formElement = document.querySelector('form');
    const selectDiv = document.createElement('div');
    selectDiv.className = 'select';
    selectDiv.innerHTML = `
      Global wtr : 
      <select class="thin select-all" name="wtr_0" size="1">
        <option value="0">----</option>
        <option value="0">0</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="35">35</option>
        <option value="40">40</option>
        <option value="45">45</option>
        <option value="50">50</option>
      </select>`;
    formElement.insertAdjacentElement('beforebegin', selectDiv);
    formElement.insertAdjacentHTML('beforebegin', '<br>');

    // Ajout des colonnes "Pop" et "Eco"
    const firstRow = formElement.querySelector('tr');
    const popHeader = document.createElement('td');
    popHeader.innerHTML = '<center>Pop</center>';
    firstRow.appendChild(popHeader);

    const ecoHeader = document.createElement('td');
    ecoHeader.innerHTML = '<center>Eco</center>';
    firstRow.appendChild(ecoHeader);

    // Gestionnaire d'événements pour les changements dans le sélecteur "Global wtr"
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('select-all')) {
        const wtr = parseInt(e.target.value);
        document.querySelectorAll('form select').forEach((select) => {
          select.value = wtr;
          select.dispatchEvent(new Event('change')); // Simuler l'événement "change"
        });
      }
    });
  } catch (error) {
    console.error('An error occurred in globalwtr:', error);
  }
};

globalwtr();
