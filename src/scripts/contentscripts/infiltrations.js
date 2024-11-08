
// Fonction pour ajouter la colonne 'Population' à l'en-tête
const addPopulationHeader = () => {
  const headerRow = document.querySelector('.nonclickable table tr#stdArray');
  if (headerRow) {
    const populationHeader = document.createElement('td');
    populationHeader.textContent = 'Population';
    populationHeader.className = 'hc';
    populationHeader.style.width = '100px';
    headerRow.appendChild(populationHeader);
  }
};

// Fonction pour ajouter les cellules 'Population' aux lignes de données
const addPopulationCells = () => {
  const dataRows = document.querySelectorAll('.nonclickable table tr.bgLine');
  dataRows.forEach(row => {
    const popCell = document.createElement('td');
    popCell.className = 'hc population-cell';
    row.appendChild(popCell);
  });
};

// Fonction principale pour récupérer les données et mettre à jour le tableau
const infiltrations = async function () {
  try {
    const gameId = await localforage.getItem('currentGameId');
    let planets = await localforage.getItem(`${gameId}-currentPlanets`);

    let farms = [];
    const elements = document.querySelectorAll('.nonclickable table tr.bgLine');

    let countElements = 0;
    const totalElements = elements.length;

    showToast(`Traitement de 0/${totalElements} planètes...`);

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      const link = el.querySelectorAll('a')[2]?.getAttribute('href');
      if (link) {
        const response = await fetch(link);
        const content = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const pop = doc.querySelectorAll('.hlight')[3]?.textContent.trim();
        const name = doc.querySelector('.hugetext.bold')?.textContent.trim();

        farms.push({
          name,
          id: parseInt(link.split('?')[1].split('&')[0].replace('planetid=', '')),
          pop: pop,
        });


        // Mettre à jour la cellule de population dans le tableau HTML
        const popCell = el.querySelector('.population-cell');
        if (popCell) {
          popCell.textContent = pop || 'N/A';
        }
      }
      localforage.setItem(`${gameId}-farms`, farms);
      countElements += 1;
      showToast(`Traitement de ${countElements}/${totalElements} planètes...`);

      // Délai entre chaque requête pour éviter de surcharger le serveur
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    localforage.setItem(`${gameId}-farms`, farms);

    showToast('Toutes les planètes ont été traitées avec succès !');
    setTimeout(() => {
      const toast = document.querySelector('.toast');
      if (toast) {
        toast.style.display = 'none';
      }
    }, 5000);

    return farms;
  } catch (error) {
    console.error('Error in infiltrations:', error);
  }
};

// Appeler les fonctions pour modifier le tableau et récupérer les données
addPopulationHeader();
addPopulationCells();
window.setTimeout(infiltrations(),1000);
