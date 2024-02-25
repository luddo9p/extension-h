async function PostForeign() {
  const currentTime = new Date().getTime()
  const lastExecutionTimeForeign = localStorage.getItem(
    'lastExecutionTimeForeign'
  )
  const fiveMinutes = 300000 / 5 // 5 minutes en millisecondes

  if (
    lastExecutionTimeForeign &&
    currentTime - lastExecutionTimeForeign < fiveMinutes
  ) {
    console.log('Attente avant la prochaine exécution.')
    return // Arrête l'exécution si moins de 5 minutes se sont écoulées
  }

  // Enregistre le moment de l'exécution actuelle pour les vérifications futures
  localStorage.setItem('lastExecutionTimeForeign', currentTime.toString())

  const log = await Hyp.getSession()
  const donneeCachee = localStorage.getItem(
    log.gameId + '-hapiDataCacheForeign'
  )

  let playerN = document.querySelector('a[rel="playerSubmenu"] b').textContent

  const foreignPlanets = await Hyp.getForeignPlanets()

  const planetList = []

  foreignPlanets.forEach((planet) => {
    let planetString = ''
    if (planet.neutral) {
      planetString = `${planet.name} - ${planet.neutral ? 'Neutral' : ''} - ${
        planet.attacking ? 'Att' : 'Def'
      } - ${planet.spaceAvgp}`
    } else if (!planet.neutral && !planet.attacking) {
      planetString = `${planet.name} - ${
        planet.stasis ? 'Stasis' : 'No stasis'
      } - Def - ${planet.spaceAvgp}`
    } else {
      planetString = `${planet.name} - ${
        planet.stasis ? 'Stasis' : 'No stasis'
      } - ${planet.attacking ? 'Att' : 'Def'} - ${planet.spaceAvgp}`
    }
    planetList.push(planetString)
  })

  // const netlifyFunctionUrl =
  //   'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/foreign'

  const netlifyFunctionUrl = 'http://localhost:8885/.netlify/functions/foreign'

  fetch(netlifyFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      player: playerN,
      foreign: planetList,
    }),
  }).then((response) => response.json())
}

PostForeign()

async function getForeignPlanets() {
  const log = await Hyp.getSession()
  const gameId = log.gameId
  const cacheKey = `${gameId}-hapi-alliance-foreign-planets`
  const updateKey = `${gameId}-last-update-time`
  const now = new Date().getTime()

  // Vérifie si les données ont été mises à jour il y a moins de 5 minutes
  const lastUpdateTime = parseInt(localStorage.getItem(updateKey), 10)
  if (lastUpdateTime && now - lastUpdateTime < 300000) {
    console.log('Données mises à jour il y a moins de 5 minutes.')
    return JSON.parse(localStorage.getItem(cacheKey))
  }
  let apiUrl = ''
  apiUrl =
    'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/getForeign'
  // apiUrl = 'http://localhost:8885/.netlify/functions/getForeign'
  const response = await fetch(apiUrl)
  const data = await response.json()
  localStorage.setItem(cacheKey, JSON.stringify(data))
  localStorage.setItem(updateKey, now.toString())
}

getForeignPlanets()
