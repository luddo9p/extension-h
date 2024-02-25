async function PostControlled() {
  const currentTime = new Date().getTime()
  const lastExecutionTime = localStorage.getItem('lastExecutionTime')
  const fiveMinutes = 300000/5 // 5 minutes en millisecondes

  if (lastExecutionTime && currentTime - lastExecutionTime < fiveMinutes) {
    console.log('Attente avant la prochaine exécution.')
    return // Arrête l'exécution si moins de 5 minutes se sont écoulées
  }

  // Enregistre le moment de l'exécution actuelle pour les vérifications futures
  localStorage.setItem('lastExecutionTime', currentTime.toString())

  const log = await Hyp.getSession()
  const donneeCachee = localStorage.getItem(
    log.gameId + '-hapiDataCacheControlled'
  )

  let playerN = document.querySelector('a[rel="playerSubmenu"] b').textContent

  const controlledPlanets = await Hyp.getControlledPlanets()

  const planetList = []

  controlledPlanets.forEach((planet) => {
    const planetString = `${planet.name} - ${Hyp.races[planet.race][0]}${
      Hyp.products[planet.prod][0]
    } ${Hyp.governments[planet.gov].substring(0, 4)}.`
    planetList.push(planetString)
  })

  const netlifyFunctionUrl =
    'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/controlled'

  fetch(netlifyFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      player: playerN,
      controlled: planetList,
    }),
  }).then((response) => response.json())

  console.log(planetList)
}

PostControlled()


async function getControlledPlanets() {
  const response = await fetch('https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/getControlled')
  const data = await response.json()
  console.log('Données récupérées:', data)
  return data
}
