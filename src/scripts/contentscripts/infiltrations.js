const infiltrations = async function () {
  try {
    const gameId = await localforage.getItem('currentGameId');
    let planets = await localforage.getItem(`${gameId}-currentPlanets`);

    let farms = [];
    const elements = document.querySelectorAll('.nonclickable table tr');

    return new Promise((resolve) => {
      elements.forEach((el, i) => {
        if (i > 1) {
          window.setTimeout(() => {
            const link = el.querySelectorAll('a')[2]?.getAttribute('href');
            if (link) {
              fetch(link)
                .then((response) => response.text())
                .then((content) => {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(content, 'text/html');
                  const pop = doc.querySelectorAll('.hlight')[3]?.textContent;
                  const name = doc.querySelector('.hugetext.bold')?.textContent;

                  farms.push({
                    name,
                    id: parseInt(link.split('?')[1].split('&')[0].replace('planetid=', '')),
                    pop: pop,
                  });
                });
            }

            if (i === elements.length - 1) {
              resolve(farms);
            }
          }, i * 400);
        }
      });
    });
  } catch (error) {
    console.error('Error in infiltrations:', error);
  }
};

// Ajout de la structure HTML pour afficher les fermes
const nonClickableDiv = document.querySelector('.nonclickable');
if (nonClickableDiv) { // Vérifier si l'élément existe
  const farmsDiv = document.createElement('div');
  farmsDiv.className = 'moves banner';
  farmsDiv.innerHTML = `
    <table class="farms switches" id="farms">
      <thead>
        <tr>
          <td>Name</td>
          <td>Pop</td>
          <td>Variation</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Gathering data...</td>
        </tr>
      </tbody>
    </table>`;
  nonClickableDiv.insertAdjacentElement('beforebegin', farmsDiv);
} else {
  console.error('Element .nonclickable:nth-of-type(3) not found.');
}

const farms = infiltrations().then(async (farms) => {
  try {
    const gameId = await localforage.getItem('currentGameId');
    const localFarms = await localforage.getItem(`${gameId}-farms-${id}`);

    let timestamp = localFarms ? localFarms.lastUpdate : undefined;
    if (!timestamp || new Date().getTime() - timestamp >= 86400000) { // 86400 seconds = 24 hours
      await localforage.setItem(`${gameId}-farms-${id}`, {
        lastUpdate: new Date().getTime(),
        data: farms,
      });
      console.log('%c *** DB: UPDATE FARMS ***', 'background: green; color: white; padding: 5px 10px');
    }

    const tbody = document.querySelector('.farms tbody');
    if (tbody) {
      tbody.querySelector('td').remove(); // Remove "Gathering data..." row

      farms.forEach((item) => {
        const farm = localFarms?.data.find((p) => p.name === item.name);
        const variation = farm ? item.pop - farm.pop : 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.pop}</td><td width="20">${variation}</td>`;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error updating farms:', error);
  }
});
