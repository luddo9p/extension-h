// Fonction pour récupérer les planètes

const netlifyFunctionUrl = 'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/list'

// const netlifyFunctionUrl = 'http://localhost:8885/.netlify/functions/alliance'

const getPlanets = async () => {
  const response = await fetch(netlifyFunctionUrl)
  const data = await response.json()
  console.log('Données récupérées:', data)
  return data
}

// Fonction pour sauvegarder les planètes dans le localStorage
const savePlanets = async () => {
  const log = await Hyp.getSession()
  const planets = await getPlanets()
  const now = new Date().getTime()
  const cacheData = {
    lastUpdated: now,
    planets,
  }
  localStorage.setItem(log.gameId + '-hapi-alliance-owned-planets', JSON.stringify(cacheData))
  console.log('Données enregistrées:', planets)
}

// Fonction pour vérifier et mettre à jour les données si nécessaire
const updatePlanetsIfNeeded = async () => {
  const log = await Hyp.getSession()
  const cache = localStorage.getItem(log.gameId + '-hapi-alliance-owned-planets')
  const now = new Date().getTime()

  if (cache) {
    const { lastUpdated, planets } = JSON.parse(cache)
    // Vérifie si plus de 5 minutes se sont écoulées
    if (now - lastUpdated > 5 * 60 * 1000) {
      console.log('Mise à jour des données car elles sont obsolètes')
      await savePlanets()
    } else {
      console.log('Utilisation des données en cache:', planets)
    }
  } else {
    console.log('Pas de données en cache, récupération des nouvelles données')
    await savePlanets()
  }
}

// Exécution de la mise à jour des planètes si nécessaire
updatePlanetsIfNeeded()
