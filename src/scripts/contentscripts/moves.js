const cache = {
  data: null,
  timestamp: 0,
}

let isCache = false
const utcDate = new Date(
  $('.servertime').eq(0).text().replace('Server Time: ', '') + ' +00:00'
)

function convertETAToDate(dateTimeStr) {
  // Directement en UTC sans ajustement pour le décalage horaire local
  return new Date(dateTimeStr + 'Z') // Ajoutez 'Z' pour indiquer explicitement UTC
}

// Adaptation nécessaire si vous devez convertir un ETA existant ou calculer un nouvel ETA
function calculateCurrentETA($row) {
  return new Date($row)
}

function calculateNewDelay(desiredETATime, currentETA) {
  // Calculez la différence en heures entre l'ETA souhaité et l'ETA actuel, et ajustez selon le besoin
  const diff = desiredETATime - currentETA
  return Math.round(diff / 3600000) // Convertit la différence en heures
}

function cleanOutput(str) {
  return String(str)
    .replace(/(<([^>]+)>)/gi, '')
    .trim()
}

function highlightHoursInHtml(htmlContent) {
  // Expression régulière pour trouver le motif "HH:MM ST" dans le HTML
  const regex = /(\d{2}:\d{2}) ST/
  // Remplacement par une balise span avec classe "highlight"
  return htmlContent.replace(regex, '<span class="highlighting">$1</span> ST')
}

function extractHours(text) {
  // Utiliser une expression régulière pour trouver un ou plusieurs chiffres
  const regex = /\d+/
  const matches = text.match(regex)

  // Si un nombre est trouvé, le convertir en entier et le retourner
  if (matches) {
    return parseInt(matches[0], 10)
  } else {
    // Si aucun nombre n'est trouvé, retourner 0 ou null selon le cas d'usage
    return null
  }
}

const groupFleetsByDestinationAndEta = (fleets) => {
  const groupedFleets = fleets.reduce((acc, fleet) => {
    console.log('fleet', fleet)
    const key = `${fleet.destination}-${fleet.etaTime}`;

    if (!acc[key]) {
      acc[key] = {
        destination: fleet.destination,
        etaTime: fleet.etaTime,
        totalFleet: 0,
        totalGa: 0,
        totalAvgp: 0,
        dist: fleet.dist,
        delay: fleet.delay,
        etaDate: fleet.etaDate,
      };
    }

    // Calcul du total de la flotte (addition des nbbomb, nbdest, nbcrui, nbscou, nbarm, nbsb)
    const fleetTotal =
      Number(fleet.nbbomb) +
      Number(fleet.nbdest) +
      Number(fleet.nbcrui) +
      Number(fleet.nbscou) +
      Number(fleet.nbarm) +
      Number(fleet.nbsb);

    // Calcul du avgp basé sur la formule fournie
    const avgp =
      fleet.nbdest * Hyp.spaceAvgP[1][fleet.race] +
      fleet.nbcrui * Hyp.spaceAvgP[2][fleet.race] +
      fleet.nbbomb * Hyp.spaceAvgP[4][fleet.race] +
      fleet.nbscou * Hyp.spaceAvgP[3][fleet.race];

    acc[key].totalAvgp += avgp;
    acc[key].totalFleet += fleetTotal; // Ajout du total de la flotte
    acc[key].totalGa += Number(fleet.autodrop); // Ajout du total de Ga

    return acc;
  }, {});

  // Formatage des résultats
  return Object.values(groupedFleets).map((group) => {
    console.log('group', group)

    const etaTimeFormatted =`${group.etaDate.getUTCHours()}:02 ST`
    const currentPlayer = $('#htopmenu > li:nth-child(5) > a > div > b').text()
    return `${group.destination} - Fleet: ${numeral(group.totalAvgp).format(
      '0[.]0a'
    )} - Ga: ${group.totalGa} - ETA: ${group.etaTime} - ${etaTimeFormatted} ST (${currentPlayer})`;
  });
};

// Fonction pour convertir l'ETA en date basée sur le serveur
function convertETAToDate(dateTimeStr) {
  // Directement en UTC sans ajustement pour le décalage horaire local
  return new Date(dateTimeStr + 'Z'); // Ajoutez 'Z' pour indiquer explicitement UTC
}

// Fonction pour calculer l'ETA actuel
function calculateCurrentETA($row) {
  return new Date($row);
}

// Fonction pour calculer un nouveau délai basé sur l'ETA souhaité
function calculateNewDelay(desiredETATime, currentETA) {
  // Calcule la différence en heures entre l'ETA souhaité et l'ETA actuel
  const diff = desiredETATime - currentETA;
  return Math.round(diff / 3600000); // Convertit la différence en heures
}

// Fonction pour nettoyer la sortie du texte HTML
function cleanOutput(str) {
  return String(str)
    .replace(/(<([^>]+)>)/gi, '')
    .trim();
}

// Fonction pour mettre en surbrillance les heures dans un contenu HTML
function highlightHoursInHtml(htmlContent) {
  // Expression régulière pour trouver le motif "HH:MM ST" dans le HTML
  const regex = /(\d{2}:\d{2}) ST/;
  // Remplacement par une balise span avec classe "highlight"
  return htmlContent.replace(regex, '<span class="highlighting">$1</span> ST');
}

// Fonction pour extraire les heures à partir d'un texte
function extractHours(text) {
  // Utiliser une expression régulière pour trouver un ou plusieurs chiffres
  const regex = /\d+/;
  const matches = text.match(regex);

  // Si un nombre est trouvé, le convertir en entier et le retourner
  if (matches) {
    return parseInt(matches[0], 10);
  } else {
    return null; // Retourner null si aucun nombre n'est trouvé
  }
}

async function getHapiData() {
  const log = await Hyp.getSession()
  const cachedData = localStorage.getItem(log.gameId + '-hapiDataCache')

  if (cachedData) {
    const cache = JSON.parse(cachedData)
    const now = utcDate

    // Convertir le moment actuel en minutes depuis minuit UTC
    const minutesSinceMidnightUTC = now.getUTCHours() * 60 + now.getUTCMinutes()

    // Trouver le dernier tick à xx:02 en minutes depuis minuit UTC
    const lastTickMinutes =
      minutesSinceMidnightUTC - (minutesSinceMidnightUTC % 60) + 2
    const nextTickMinutes = lastTickMinutes + 60 // Prochain tick à xx:02

    // Vérifier si l'heure actuelle est entre xx:02 et xx:06
    const isWithinCacheRefreshWindow =
      minutesSinceMidnightUTC >= lastTickMinutes &&
      minutesSinceMidnightUTC <= lastTickMinutes + 4

    // Calculer l'âge du cache en minutes
    const cacheAgeMinutes = (now - cache.timestamp) / 60000

    // Vérifier si le cache doit être rafraîchi
    const shouldRefreshCache =
      cacheAgeMinutes > 1 || (isWithinCacheRefreshWindow && cacheAgeMinutes > 1)

    if (!shouldRefreshCache) {
      isCache = true
      console.log('Retour des données depuis le localStorage')
      return cache.data
    } else {
      isCache = false
      console.log(
        'Le cache est expiré ou ne respecte pas la fenêtre de rafraîchissement spécifiée.'
      )
    }
  }

  // Si le cache est expiré ou inexistant, on fait la requête
  const movesData = await Hyp.getMoves()

  // Sérialisation et mise en cache des données avec le timestamp actuel
  const newCache = {
    data: movesData,
    timestamp: Date.now(),
  }
  localStorage.setItem(log.gameId + '-hapiDataCache', JSON.stringify(newCache))
  return movesData
}

const changeMoves = () => {
  const $cards = $('.movingFleetCard')

  $cards.each(async (i, card) => {
    const $card = $(card)
    // Trouver le texte à l'intérieur de l'élément <font>
    const moveTxt = $card.find('font').text()
    const log = await Hyp.getSession()
    if (!$card.find('.button').attr('href')) return
    const fleetId = $card
      .find('.button')
      .attr('href')
      .replace('Fleets?changefleet=&floatid=', '')

    if (!$card.find('.std').find('b')) return

    const movingTxtTo = $card.find('.std').find('b')[1]
      ? cleanOutput($card.find('.std').find('b')[1].innerHTML)
      : ''
    const movingType = $card.find('.std').find('b')[2]
      ? cleanOutput($card.find('.std').find('b')[2].innerHTML)
      : ''
    const delay = extractHours($card.find('.info').text()) || 0

    const htmlContent = $card.find('td').eq(0).html() // Récupération du contenu HTML

    // Application de la fonction pour mettre en évidence l'heure
    const updatedHtml = highlightHoursInHtml(htmlContent)

    // Mise à jour du contenu HTML de l'élément avec la version modifiée
    $card.find('td').eq(0).html(updatedHtml)

    // Récupération et désérialisation du cache depuis le localStorage
    const cachedData = localStorage.getItem(log.gameId + '-hapiDataCache')
    let fleetData
    if (cachedData) {
      const cache = JSON.parse(cachedData)
      // Vous devez déterminer comment trouver le bon `fleetData` dans `cache.data`
      // Par exemple, si `cache.data` est un tableau, trouvez l'élément approprié
      fleetData = cache.data.find((move) => move.fleetid === fleetId)
    }

    // Assurez-vous que `fleetData` est défini avant de continuer
    if (!fleetData) {
      console.log("Données de flotte non trouvées pour l'ID:", fleetId)
      return // Sortie précoce si les données ne sont pas trouvées
    }

    const dropMode = moveTxt.includes('auto drop') ? 1 : 0
    const mission = movingType === 'defense' ? 1 : 0

    // Condition pour vérifier si le texte contient "auto drop" ou "drop on order" et les remplacer
    if (moveTxt.includes('auto drop') || moveTxt.includes('drop on order')) {
      // Utiliser .html() pour obtenir le contenu HTML actuel, puis remplacer le texte spécifique par un élément <a>
      const updatedHtml = $card
        .find('font')
        .html()
        .replace(
          /(auto drop|drop on order)/g,
          `<a href="#" data-fleet="${fleetId}" data-drop="${dropMode}" data-camo="${fleetData.camouf}" data-delay="${delay}" data-mission="${mission}" data-destname="${movingTxtTo}" class="link-drop">$1</a>`
        )
      // Mettre à jour le HTML de l'élément <font> avec le nouveau contenu

      $card.find('font').eq(0).html(updatedHtml)
    }
    const camoLink = `<br/> <a href="/servlet/Fleets?changefleet=&floatid=${fleetId}" data-fleet="${fleetId}" data-drop="${dropMode}" data-camo="${
      fleetData.camouf
    }" data-delay="${delay}" data-mission="${mission}" data-destname="${movingTxtTo}" class="link-camo camo-${
      fleetData.camouf
    }">👻 camo ${fleetData.camouf == 1 ? 'is on' : 'is off'}</a>`
    if ($card.find('font').eq(0).find('.link-camo').length === 0) {
      $card.find('font').eq(0).append(camoLink)
    }
  })

  window.setTimeout(() => {
    $('.link-drop').on('click', async (e) => {
      e.preventDefault() // Empêche l'action par défaut

      const target = $(e.currentTarget) // Utiliser e.currentTarget pour référencer l'élément cliqué
      const fleetId = target.attr('data-fleet')
      const dropMode = target.attr('data-drop') == '1' ? '0' : '1'
      const mission = target.attr('data-mission')
      const to = target.attr('data-destname')
      const delay = target.attr('data-delay')
      const camo = target.attr('data-camo')

      const change = await $.post('/servlet/Fleets', {
        destname: to,
        mission: mission,
        dropmode: dropMode,
        camouflage: camo,
        delay: delay,
        updatefleet: 'Update',
        floatid: fleetId,
        pagetype: 'moving_fleets',
      })
      const log = await Hyp.getSession()
      let text = target.text()
      text = text === 'auto drop' ? 'drop on order' : 'auto drop'
      target.text(text)
      // Récupération et mise à jour du cache
      const cacheKey = log.gameId + '-hapiDataCache'
      const cachedData = localStorage.getItem(cacheKey)
      if (cachedData) {
        const cache = JSON.parse(cachedData)

        // Trouver et mettre à jour l'objet spécifique dans le tableau en cache
        const index = cache.data.findIndex((move) => move.fleetid === fleetId)
        if (index !== -1) {
          cache.data[index].autodrop = dropMode // Modifier la valeur de camo
        }

        // Remettre le tableau modifié dans localStorage
        localStorage.setItem(cacheKey, JSON.stringify(cache))
      }
    })

    $('.link-camo').on('click', async (e) => {
      e.preventDefault() // Empêche l'action par défaut

      const target = $(e.currentTarget) // Utiliser e.currentTarget pour référencer l'élément cliqué
      const fleetId = target.attr('data-fleet')
      const dropMode = target.attr('data-drop')
      const mission = target.attr('data-mission')
      const to = target.attr('data-destname')
      const delay = target.attr('data-delay')
      const camo = target.attr('data-camo') == '1' ? '0' : '1'

      const change = await $.post('/servlet/Fleets', {
        destname: to,
        mission: mission,
        dropmode: dropMode,
        camouflage: camo,
        delay: delay,
        updatefleet: 'Update',
        floatid: fleetId,
        pagetype: 'moving_fleets',
      })

      let text = target.text()
      text = text === '👻 camo is off' ? '👻 camo is on' : '👻 camo is off'
      target.removeClass('camo-1 camo-0').addClass(`camo-${camo}`)
      target.text(text)

      // Récupération et mise à jour du cache
      const log = await Hyp.getSession()
      // Récupération et mise à jour du cache
      const cacheKey = log.gameId + '-hapiDataCache'

      const cachedData = localStorage.getItem(log.gameId + '-hapiDataCache')
      if (cachedData) {
        const cache = JSON.parse(cachedData)

        // Trouver et mettre à jour l'objet spécifique dans le tableau en cache
        const index = cache.data.findIndex((move) => move.fleetid === fleetId)
        if (index !== -1) {
          cache.data[index].camouf = camo // Modifier la valeur de camo
        }

        // Remettre le tableau modifié dans localStorage
        localStorage.setItem(cacheKey, JSON.stringify(cache))
      }
    })

    console.log('changeMoves', $('.link-camo'))
  }, 1000)
}

function groupFleetMovementsByDestination(fleetMovements) {
  // Calcul de l'ETA et ajout à chaque mouvement
  fleetMovements.forEach((movement) => {
    // Supposons que `movement.dist` est la distance en heures et `movement.delay` le retard également en heures
    // L'ETA total est donc la somme de la distance et du retard
    movement.etaTime = movement.dist + movement.delay
  })

  // Regroupement et tri par ETA au sein de chaque groupe
  const grouped = fleetMovements.reduce((acc, movement) => {
    if (!acc[movement.to]) {
      acc[movement.to] = []
    }
    acc[movement.to].push(movement)
    return acc
  }, {})

  // Tri par ETA au sein de chaque groupe
  for (const destination in grouped) {
    grouped[destination].sort((a, b) => a.etaTime - b.etaTime)
  }

  return grouped
}

async function displayGroupedFleetMovements(groupedMovements) {
  $('.movingFleetCard').eq(0).parent().find('.recap').remove()

  let tableHtml = `<table class="recap" border="1">
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Fleet</th>
              <th>ETA</th>
              <th>Delay</th>
            </tr>`

  const now = utcDate
  const colors = [
    '#FFB347', // Pastel orange
    '#AFCBFF', // Pastel blue
    '#FF9AA2', // Pastel coral
    '#D2B48C', // Pastel burlywood
    '#FDFD96', // Pastel yellow (khaki)
    '#A1C6EA', // Pastel cornflower blue
    '#FFE066', // Pastel gold
    '#B2F2BB', // Pastel green
    '#A7ECEE', // Pastel turquoise
    '#E6AF91', // Pastel peru
    '#C4FCEA', // Pastel yellow-green
  ]

  let colorIndex = 0
  let previousDestination = null // Suivre la destination précédente pour la comparaison

  // Préparation des mouvements
  let allMovements = []
  Object.keys(groupedMovements).forEach((destination) => {
    groupedMovements[destination].forEach((movement) => {
      const etaDate = new Date(
        now.getTime() + movement.dist * 3600000 + movement.delay * 3600000
      ) // Calcul de l'ETA
      const etaTime = parseInt(movement.dist, 10) + parseInt(movement.delay, 10)
      allMovements.push({
        ...movement,
        etaDate,
        etaTime: parseInt(etaTime),
        destination,
      })
    })
  })


  let results = groupFleetsByDestinationAndEta(allMovements)
  results = results.join('\n')

  console.log('results', results)

  let destinationTotals = {}

  Object.keys(groupedMovements).forEach((destination) => {
    if (Array.isArray(groupedMovements[destination])) {
      let totalAvgp = 0 // Initialisation du total pour cette destination

      groupedMovements[destination].forEach((movement) => {
        // Supposons que `movement.avgp` existe et contient la valeur que vous souhaitez additionner
        const avgp =
          movement.nbdest * Hyp.spaceAvgP[1][movement.race] +
          movement.nbcrui * Hyp.spaceAvgP[2][movement.race] +
          movement.nbbomb * Hyp.spaceAvgP[4][movement.race] +
          movement.nbscou * Hyp.spaceAvgP[3][movement.race]
        totalAvgp += avgp // Additionner la valeur de avgp à totalAvgp
      })

      destinationTotals[destination] = totalAvgp // Stocker le total pour cette destination
    } else {
      console.error(
        `Attendu un tableau pour la destination ${destination}, reçu:`,
        groupedMovements[destination]
      )
    }
  })

  let totalHtml = `<table class="recap" border="1">
  <tr>
    <th>Movements</th>
  </tr>
  <tr><td style="background:#F9F9F9"><pre class="recap-text">${results}</pre></td></tr></table>`

  // Tri des mouvements par ETA
  // allMovements.sort((a, b) => a.etaDate - b.etaDate);

  // Affichage des mouvements avec gestion correcte des couleurs par groupe de destination
  allMovements.forEach((movement) => {
    if (previousDestination !== movement.destination) {
      colorIndex++
      previousDestination = movement.destination // Mise à jour de la destination précédente
    }
    const etaString = `${movement.etaDate.getUTCHours()}:02 ST`
    const currentColor = colors[(colorIndex - 1) % colors.length]

    if (movement.fleetid === '89425') {
      console.log('movement', movement, movement.etaDate)
    }

    let isDelay = false
    // Génération des options du select pour le délai
    let delayOptions = ''
    for (let i = 0; i <= 48; i++) {
      delayOptions += `<option data-fleetid="${
        movement.fleetid
      }" value="${i}" ${
        i === parseInt(movement.delay) ? ' selected' : ''
      }>${i}</option>`
    }

    let unitsString = ''
    unitsString += movement.nbcrui > 0 ? `C:${movement.nbcrui}/` : ''
    unitsString += movement.nbdest > 0 ? `D:${movement.nbdest}/` : ''
    unitsString += movement.nbbomb > 0 ? `B:${movement.nbbomb}/` : ''
    unitsString += movement.nbscou > 0 ? `S:${movement.nbscou}/` : ''
    unitsString += movement.nbarm > 0 ? `GA:${movement.nbarm}` : ''
    unitsString = unitsString.endsWith('/')
      ? unitsString.slice(0, -1)
      : unitsString // Supprimer le dernier slash si nécessaire

    const avgp =
      movement.nbdest * Hyp.spaceAvgP[1][movement.race] +
      movement.nbcrui * Hyp.spaceAvgP[2][movement.race] +
      movement.nbbomb * Hyp.spaceAvgP[4][movement.race] +
      movement.nbscou * Hyp.spaceAvgP[3][movement.race]

    tableHtml += `
              <tr class="row-move" data-fleetId="${
                movement.fleetid
              }" style="background-color: ${currentColor};">
                <td>${movement.from}</td>
                <td>${movement.destination}</td>
                <td>~ ${numeral(avgp).format('0[.]0a')} - GA:${
      movement.nbarm
    }</td>
                <td>ETA: ${movement.etaTime} hours (${etaString})</td>
                <td class="delay-${
                  movement.delay > 0
                }"><select class="select-delay">${delayOptions}</select></td>
              </tr>`
  })

  tableHtml += `</table>`
  $('.movingFleetCard').eq(0).parent().prepend(tableHtml)
  $('.movingFleetCard').eq(0).parent().prepend(totalHtml)

  const isCacheText = isCache ? ' (from cache)' : '(fresh data)'

  if ($('.fleet-movement').length === 0) {
    $('.movingFleetCard')
      .eq(0)
      .parent()
      .prepend(
        `<br/><br/><button class="fleet-movement">Show fleet movements ${isCacheText}</button>`
      )
  }
  if ($('.refresh').length === 0) {
    $('.movingFleetCard')
      .eq(0)
      .parent()
      .prepend(`<br/><br/><button class="refresh">Refresh cache</button>`)
  }

  // reset cache
  $('.refresh').on('click', async (e) => {
    e.preventDefault()
    $('.refresh').text('Refreshing cache...')
    const log = await Hyp.getSession()
    localStorage.removeItem(log.gameId + '-hapiDataCache')
    localStorage.removeItem(log.gameId + '-lastUpdateTime')
    window.setTimeout(() => {
      window.location.reload()
    }, 500)
  })

  $('.fleet-movement').on('click', (e) => {
    e.preventDefault()
    $('.recap').toggle()
    $('.desired').toggle()
  })

  $('.select-delay').on('change', async (e) => {
    e.preventDefault()
    const log = await Hyp.getSession()
    const cachedData = localStorage.getItem(log.gameId + '-hapiDataCache')

    const fleetId = $(e.currentTarget).find(':selected').attr('data-fleetid')

    const cache = JSON.parse(cachedData)
    const fleet = cache.data.find((move) => move.fleetid === fleetId)

    const newDelay = $(e.currentTarget).val()

    const change = await $.post('/servlet/Fleets', {
      destname: fleet.to,
      mission: fleet.defend,
      dropmode: fleet.autodrop,
      camouflage: fleet.camouf,
      delay: newDelay,
      updatefleet: 'Update',
      floatid: fleet.fleetid,
      pagetype: 'moving_fleets',
    })
      .done(function (data, textStatus, jqXHR) {
        // Gestion du succès
        console.log('Réponse reçue avec succès. Code HTTP :', jqXHR.status)
        console.log(data.length)
        if (data.length > 5250) {
          $(e.currentTarget)
            .parent()
            .parent()
            .addClass('updated')
            .removeClass('warning')
          // Récupération et mise à jour du cache
          if (cachedData) {
            // Trouver et mettre à jour l'objet spécifique dans le tableau en cache
            const index = cache.data.findIndex(
              (move) => move.fleetid === fleetId
            )
            if (index !== -1) {
              cache.data[index].delay = newDelay // Modifier la valeur de delay
            }
            // Remettre le tableau modifié dans localStorage
            localStorage.setItem(cacheKey, JSON.stringify(cache))

            console.log('cache updated', cache)
            window.setTimeout(() => {
              getHapiData().then((data) => {
                const groupedMovements = groupFleetMovementsByDestination(data)
                // Afficher les mouvements groupés
                displayGroupedFleetMovements(groupedMovements)
                $('.recap').toggle()
              })
            }, 500)
          }
        } else {
          $(e.currentTarget).parent().parent().addClass('warning')
        }
      })
      .always(function () {
        // Exécuté après la réussite ou l'échec
        console.log('Requête terminée.')
      })
  })
}
window.setTimeout(() => {
  getHapiData().then((data) => {
    // Grouper les mouvements par destination
    $('.movingFleetCard')
      .eq(0)
      .parent()
      .append('<div class="tablerecap"></div>')
    const groupedMovements = groupFleetMovementsByDestination(data)
    // Afficher les mouvements groupés
    displayGroupedFleetMovements(groupedMovements)
    changeMoves()

    $('.movingFleetCard').eq(0).parent().prepend(`
<div style="margin:20px;display:none" class="desired">
    <label for="desiredETA">Desired ETA</label>
    <input type="datetime-local" id="desiredETA" />
    <button id="updateDelays">Update delays (interval of 5 sec)</button>
</div>
`)

    $('#updateDelays').click(async (e) => {
      e.preventDefault()
      const log = await Hyp.getSession()
      const desiredETAString = $('#desiredETA').val()
      const desiredETATime = convertETAToDate(desiredETAString)

      $('.row-move').each(function (i) {
        setTimeout(() => {
          const $row = $(this)
          const fleetId = $row.attr('data-fleetId')
          const cachedData = localStorage.getItem(log.gameId + '-hapiDataCache')
          const cache = JSON.parse(cachedData)
          const fleetData = cache.data.find((move) => move.fleetid === fleetId)
          if (!fleetData) {
            console.error("Données de flotte non trouvées pour l'ID:", fleetId)
            return
          }

          // Prochain tick en UTC
          const nowUTC = utcDate // Pas besoin de double conversion
          const minutesUTC = nowUTC.getUTCMinutes()
          const nextTickUTC = new Date(nowUTC)

          if (minutesUTC >= 2) {
            nextTickUTC.setUTCHours(nowUTC.getUTCHours() + 1)
          }
          nextTickUTC.setUTCMinutes(2, 0, 0) // Ajuste toujours à xx:02

          const travelTimeUTC = new Date(
            nextTickUTC.getTime() + fleetData.dist * 3600000
          )
          const delayInMs = desiredETATime.getTime() - travelTimeUTC.getTime() // Assurez-vous d'utiliser .getTime()
          const newDelay = Math.max(0, Math.ceil(delayInMs / 3600000)) + 1 // En heures, arrondi supérieur

          $row.find('.select-delay').val(newDelay).trigger('change')

          console.log(
            `Mise à jour de ${fleetId} avec un nouveau délai : ${newDelay}`
          )
        }, i * 5000) // Intervalle de 2 secondes
      })
    })
  })

  $('.movingFleetCard').on('click', function (e) {
    if (!$(this).find('.checkbox').prop('checked')) {
      $(this).find('.checkbox').prop('checked', true)
    } else {
      $(this).find('.checkbox').prop('checked', false)
    }
  })
}, 100)
