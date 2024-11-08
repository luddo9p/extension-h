const trading = () => {
    const createDiv = document.createElement('div');
    createDiv.className = 'trading-container';
  
    // Ajout d'un textarea au-dessus des boutons
    const textAreaFilter = document.createElement('textarea');
    textAreaFilter.rows = 4;
    textAreaFilter.cols = 50;
    textAreaFilter.placeholder = 'Paste your list of planets here... (from tactmap scan)';
    textAreaFilter.className = 'textarea-filter';
  
    // Ajout des boutons dans une div séparée
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'trading-buttons';
  
    const btnFilterWithoutBH = document.createElement('button');
    btnFilterWithoutBH.textContent = 'No BH';
    btnFilterWithoutBH.classList.add('btn', 'btn-primary');
    buttonsDiv.appendChild(btnFilterWithoutBH);
  
    const btnFilterNoProt = document.createElement('button');
    btnFilterNoProt.textContent = 'No Prot';
    btnFilterNoProt.classList.add('btn', 'btn-primary');
    buttonsDiv.appendChild(btnFilterNoProt);
  
    const btnFilterNoTag = document.createElement('button');
    btnFilterNoTag.textContent = 'No Tag';
    btnFilterNoTag.classList.add('btn', 'btn-primary');
    buttonsDiv.appendChild(btnFilterNoTag);
  
    // Ajout du textarea et des boutons au container principal
    createDiv.appendChild(textAreaFilter);
    createDiv.appendChild(buttonsDiv);
  
    document.querySelector('#queryForm').nextElementSibling.after(createDiv);
  
    const getList = document.querySelectorAll('.line0,.line1, .lineCenteredOn');
    const planetLists = [];
  
    getList.forEach((tr) => {
      const links = tr.getElementsByTagName('a');
  
      let planetName = '';
      const isBhed = tr.getElementsByTagName('td')[0].innerHTML.includes('/themes/theme4/misc/BH.gif');
  
      if (isBhed) {
        planetName = tr.getElementsByTagName('td')[0].innerText;
      } else {
        if (links.length > 2) {
          planetName = links[2].innerText;
        } else {
          planetName = tr.getElementsByTagName('td')[0].innerText.replace('@', '').trim();
        }
      }
    
      const hasTag = tr.querySelector('.publicTag') ? true : false;
      const isProt = tr.getElementsByTagName('td')[4].innerText.includes('Hyp.');
  
      const info = {
        planetName,
        isBhed,
        hasTag,
        isProt,
      };
  
      // Ajout à la liste des planètes seulement si planetName existe
      if (planetName) {
        planetLists.push(info);
        tr.classList.add('trading-planet');  // Ajout d'une classe générique pour identifier les planètes
      }
    });
    
    // Gestion des états des filtres
    let filterStates = {
      noBH: false,
      noProt: false,
      noTag: false,
      planetNames: [], // Ajout pour stocker les planètes extraites du textarea
    };
  
    // Fonction pour normaliser les noms (suppression des espaces, conversion en minuscules, suppression des caractères non pertinents)
    const normalizeName = (name) => {
      return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ''); // Supprime tous les caractères non-alphanumériques
    };
  
    // Fonction pour afficher/masquer les lignes selon les filtres actifs
    const applyFilters = () => {
      getList.forEach((tr) => {
        let planetNameInTable = '';
        const isBhed = tr.getElementsByTagName('td')[0].innerHTML.includes('/themes/theme4/misc/BH.gif');
  
        if (isBhed) {
          planetNameInTable = tr.getElementsByTagName('td')[0].innerText;
        } else {
          if (tr.getElementsByTagName('a').length === 2) {
            planetNameInTable = tr.getElementsByTagName('td')[0].innerText.replace('@', '').trim();
          } else {
            planetNameInTable = tr.getElementsByTagName('td')[0].innerText.trim();
          }
        }
  
        const isProt = tr.getElementsByTagName('td')[4].innerText.includes('Hyp.');
        const hasTag = tr.querySelector('.publicTag') ? true : false;
  
        let show = true;
  
        // Appliquer les filtres boutons
        if (filterStates.noBH && isBhed) show = false;
        if (filterStates.noProt && isProt) show = false;
        if (filterStates.noTag && hasTag) show = false;
  
        // Appliquer le filtre de noms de planètes
        // const normalizedPlanetNameInTable = normalizeName(planetNameInTable);
        // const normalizedPlanetNamesFromTextarea = filterStates.planetNames.map(normalizeName);
        if(planetNameInTable === 'Doom') {
        console.log('Planet name in table:', filterStates.planetNames);
        console.log('planetNameInTable:', planetNameInTable);
        }
        if (filterStates.planetNames.includes(planetNameInTable)) {
          console.log('Planet', planetNameInTable, 'should be shown:', show);
          show = false;
        }

  
        tr.style.display = show ? '' : 'none';
      });
    };
  
    // Fonction pour gérer l'inversion du bouton et son état actif
    const toggleFilter = (button, filterKey) => {
      filterStates[filterKey] = !filterStates[filterKey];
      button.style.filter = filterStates[filterKey] ? 'invert(1)' : 'invert(0)';
      applyFilters();
    };
  
    // Gestionnaire d'événements pour les boutons
    btnFilterWithoutBH.addEventListener('click', () => {
      toggleFilter(btnFilterWithoutBH, 'noBH');
    });
  
    btnFilterNoProt.addEventListener('click', () => {
      toggleFilter(btnFilterNoProt, 'noProt');
    });
  
    btnFilterNoTag.addEventListener('click', () => {
      toggleFilter(btnFilterNoTag, 'noTag');
    });
  
    // Fonction pour extraire les noms des planètes de la liste
    const extractPlanetNames = (text) => {
      const planetNames = [];
      const lines = text.split('\n'); // Sépare le texte ligne par ligne
      lines.forEach((line) => {
        const match = line.match(/\)\s(.*?):\sF:/); // Extrait le nom entre la coordonnée et "F:"
        if (match && match[1]) {
          planetNames.push(match[1].trim());
        }
      });
      return planetNames;
    };
  
    // Gestionnaire pour le textarea pour filtrer par liste de planètes
    textAreaFilter.addEventListener('change', (event) => {
      const planetListText = event.target.value;
      const planetNames = extractPlanetNames(planetListText);
      filterStates.planetNames = planetNames; // Mettre à jour le filtre des planètes
      applyFilters(); // Réappliquer les filtres avec les noms de planètes
    });
  };
  
  window.setTimeout(trading, 300);
  