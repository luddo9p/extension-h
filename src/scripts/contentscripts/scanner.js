function extractFleetValue(text) {
  if (typeof text !== 'string') {
    throw new Error('Le paramètre fourni doit être une chaîne de caractères');
  }

  text = text.replace(/\s+/g, '');
  let terms = text.split('+');
  let totalValue = 0;

  for (let term of terms) {
    let match = term.match(/^([\d.]+)([MK]?)/i);
    if (match) {
      let num = parseFloat(match[1]);
      let unit = match[2].toUpperCase();

      if (unit === 'M') {
        totalValue += num * 1e6;
      } else if (unit === 'K') {
        totalValue += num * 1e3;
      } else {
        totalValue += num;
      }
    }
  }

  if (totalValue >= 1e6) {
    return (totalValue / 1e6).toFixed(1) + 'M';
  } else if (totalValue >= 1e3) {
    return (totalValue / 1e3).toFixed(1) + 'K';
  } else {
    return totalValue.toString();
  }
}

function parsePlanetTable(planetTable, sharedBy) {
  let planetNameElement = planetTable.querySelector('.vc');
  if (!planetNameElement) return null;
  let planetName = planetNameElement.textContent.trim();

  let publicTagElement = planetTable.querySelector('.publicTag');
  if (publicTagElement) {
    let publicTagText = publicTagElement.textContent.trim();
    planetName = planetName.replace(publicTagText, '').trim();
  }

  let hasStasis = planetTable.querySelector('.flagStasis') ? ' (stasis)' : '';
  let hasNeutral = planetTable.querySelector('.highlight') ? ' (neutral)' : '';

  let scMatch = planetName.match(/SC\d+\(([-\d]+),([-\d]+)\)/);
  let sc = scMatch ? `(${scMatch[1]},${scMatch[2]})` : 'N/A';

  planetName = planetName.replace(/SC\d+\([-\d]+,[-\d]+\)/, '').trim();

  let nrg = '';
  let energyElement = planetTable.querySelector('.energy');
  if (energyElement) {
    let lastEnergyCell = energyElement.querySelector('td:last-child');
    if (lastEnergyCell) {
      nrg = `(${lastEnergyCell.textContent.trim()} nrg)`;
    }
  }

  let barAlly = '';
  let barNmy = '';
  let bars = planetTable.querySelectorAll('.bars');

  bars.forEach((bar) => {
    let barText = bar.textContent.trim();

    if (barText.includes('Space AvgP:') && !barAlly) {
      let fleetValueElement = bar.querySelector('tr > td.vb');
      if (fleetValueElement) {
        let fleetValue = extractFleetValue(fleetValueElement.textContent.trim());
        barAlly = `F: ${fleetValue}`;
      } else {
        barAlly = 'F: N/A';
      }
    }

    if (barText.includes('Enemy space AvgP:') && !barNmy) {
      let textContent = bar.textContent.replace('Enemy space AvgP:', '').trim();
      textContent = textContent.replace(/^x\d+\s*/, '');
      let fleetValue = extractFleetValue(textContent);
      barNmy = fleetValue ? `E: ${fleetValue}` : 'E: N/A';
    }
  });

  barAlly = barAlly || 'F: N/A';
  barNmy = barNmy || 'E: N/A';

  if (planetName && sc !== 'N/A') {
    return {
      sc: sc,
      planetName: planetName,
      line: `${sc} ${planetName}: ${barAlly} / ${barNmy} ${nrg} ${hasStasis}${hasNeutral}${sharedBy}`
        .replace(/F:\s+F:/, 'F:')
        .replace(/E:\s+E:/, 'E:')
        .replace(/\s{2,}/g, ' ')
        .trim(),
    };
  }

  return null;
}

function extractPlanetStatus(doc) {
  const planetData = {};
  const planetTables = doc.querySelector('#tacForm').querySelectorAll('.nopadding');

  let sharedBy = '';

  planetTables.forEach((element) => {
    let prevSibling = element.previousElementSibling;

    if (prevSibling && prevSibling.textContent.includes('Information shared by')) {
      const regex = /Information shared by\s+([A-Za-z0-9-_]+)/;
      const match = prevSibling.textContent.match(regex);
      sharedBy = match && match[1] ? ` (${match[1]})` : '';
    } else {
      sharedBy = '';
    }

    const planetStatus = parsePlanetTable(element, sharedBy);

    if (planetStatus && planetStatus.line) {
      if (!planetData[planetStatus.planetName]) {
        planetData[planetStatus.planetName] = planetStatus.line;
      } else {
        const existingStatus = planetData[planetStatus.planetName];
        const existingIsNA =
          existingStatus.includes('F: N/A') ||
          existingStatus.includes('E: N/A');
        const newIsNA =
          planetStatus.line.includes('F: N/A') ||
          planetStatus.line.includes('E: N/A');

        if (existingIsNA && !newIsNA) {
          planetData[planetStatus.planetName] = planetStatus.line;
        }
      }
    }
  });

  return Object.values(planetData);
}

function extractCoordinatesFromMap() {
  const coords = [];
  const mapZones = document.querySelectorAll('td.tacMapZone');

  mapZones.forEach((zone) => {
    const link = zone.querySelector('.tacZoneTitle a');

    if (link) {
      const urlParams = new URLSearchParams(link.getAttribute('href'));
      const reqx = parseInt(urlParams.get('reqx'), 10);
      const reqy = parseInt(urlParams.get('reqy'), 10);
      coords.push({ x: reqx, y: reqy });
    }
  });

  return coords;
}

function getSquareCoordinates(center, distance, availableCoords) {
  const coords = [];

  if (distance < 0) {
    throw new Error('La distance doit être un nombre positif.');
  }

  const mapLimit = 75;

  for (let x = center.x - distance; x <= center.x + distance; x++) {
    for (let y = center.y - distance; y <= center.y + distance; y++) {
      if (x >= -mapLimit && x <= mapLimit && y >= -mapLimit && y <= mapLimit) {
        const coordExists = availableCoords.some(
          (coord) => coord.x === x && coord.y === y
        );
        if (coordExists) {
          coords.push({ x, y });
        }
      }
    }
  }

  return coords;
}

function showPopup(data) {
  let existingPopup = document.getElementById('popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.classList.add('popup-style');

  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.style.display = 'flex';
  buttonsWrapper.style.justifyContent = 'space-between';
  buttonsWrapper.style.marginBottom = '10px';

  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.onclick = function () {
    const popupContent = document.getElementById('popup-content');
    navigator.clipboard.writeText(popupContent.textContent).then(
      () => {
        console.log('Text copied successfully!');
      },
      (err) => {
        console.error('Failed to copy text:', err);
      }
    );
  };

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.onclick = function () {
    document.body.removeChild(popup);
  };

  const popupContent = document.createElement('pre');
  popupContent.id = 'popup-content';

  let rawText = '';

  data.forEach((item) => {
    item.tacformHTML.forEach((line) => {
      let modifiedLine = line;

      const matchF = line.match(/F:\s*([\d.]+[MK]?)/);
      const matchE = line.match(/E:\s*([\d.]+[MK]?)/);

      if (matchF && matchE) {
        const valueF = parseValue(matchF[1]);
        const valueE = parseValue(matchE[1]);

        if (valueE > valueF) {
          modifiedLine += ' *need help*';
        }
      }

      rawText += modifiedLine + '\r\n';
    });

    rawText += '\r\n';
  });

  popupContent.textContent = rawText;

  popup.appendChild(buttonsWrapper);
  buttonsWrapper.appendChild(copyButton);
  buttonsWrapper.appendChild(closeButton);

  popup.appendChild(popupContent);

  document.body.appendChild(popup);

  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.width = '700px';
  popup.style.padding = '20px';
  popup.style.zIndex = '1000';
  popup.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.75)';
  popup.style.borderRadius = '10px';
  popup.style.maxHeight = '600px';
  popup.style.overflowY = 'auto';
}

function parseValue(value) {
  if (value.endsWith('M')) {
    return parseFloat(value) * 1e6;
  } else if (value.endsWith('K')) {
    return parseFloat(value) * 1e3;
  } else {
    return parseFloat(value);
  }
}

async function fetchAndExtractTacform(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la requête vers ${url}: ${response.statusText}`
      );
    }

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const parsing = extractPlanetStatus(doc);

    if (parsing) {
      return parsing;
    } else {
      console.warn(
        `L'élément avec id="tacform" n'a pas été trouvé sur la page ${url}`
      );
      return null;
    }
  } catch (error) {
    console.error('Erreur lors du fetch ou du parsing:', error);
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processCoordinates(coordinates) {
  const results = [];
  const total = coordinates.length - 1;
  let count = 0;

  for (const coord of coordinates) {
    const url = `Maps?tm=&reqx=${coord.x}&reqy=${coord.y}&d=0`;

    console.log(
      `Récupération de la page pour les coordonnées (${coord.x}, ${coord.y})...`
    );

    const tacformHTML = await fetchAndExtractTacform(url);

    if (tacformHTML) {
      results.push({
        coord,
        tacformHTML,
      });
    }

    document.getElementById(
      'scanStatus'
    ).textContent = `Progression: ${count}/${total}`;

    await delay(600);
    count++;
  }

  return results;
}

(async () => {
  if (!document.querySelector('td.tacMapZone')) return;

  const formContainer = document.createElement('div');
  formContainer.id = 'scan-form';
  formContainer.style.zIndex = '1000';

  formContainer.innerHTML = `
            <h4>Report</h4>
            
            <div class="rowinput">
            <input type="number" id="xCoord" placeholder="x" value="-2" /></div>
            
            <div class="rowinput">
            <input type="number" id="yCoord" placeholder="y" value="-20" /></div>
            
            <div class="rowinput">
            <input type="number" id="distance" placeholder="dist" value="0" /></div>
            <div class="rowinput">
            <button id="scanButton">Scan</button>
            </div>
            <br>
            <span id="scanStatus"></span>
        `;

  document.body.appendChild(formContainer);

  document.getElementById('scanButton').addEventListener('click', async () => {
    const xCoord = parseInt(document.getElementById('xCoord').value, 10);
    const yCoord = parseInt(document.getElementById('yCoord').value, 10);
    const distance = parseInt(document.getElementById('distance').value, 10);

    const center = { x: xCoord, y: yCoord };

    try {
      const availableCoords = extractCoordinatesFromMap();

      const coordinates = getSquareCoordinates(
        center,
        distance,
        availableCoords
      );

      const results = await processCoordinates(coordinates);

      showPopup(results);

      console.log('Résultats finaux :', results);
    } catch (error) {
      console.error('Erreur :', error.message);
    }
  });
})();
