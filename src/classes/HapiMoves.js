async function HapiMoves() {
  const log = await Hyp.getSession()
  const gameId = log.gameId
  const cacheKey = `${gameId}-hapiDataCache`
  const updateKey = `${gameId}-lastUpdateTime`
  const now = new Date().getTime()
  const EXPIRE = 3600000

  // Vérifie si la dernière requête a été faite il y a moins d'une heure
  const lastUpdateTime = parseInt(localStorage.getItem(updateKey), 10)
  if (lastUpdateTime && now - lastUpdateTime < EXPIRE) {
    // 3600000 ms = 1 heure
    console.log(
      "Fetch exécuté il y a moins d'une heure. Utilisation des données en cache."
    )
    return // Utilise les données en cache, ne procède pas à une nouvelle fetch
  }

  let playerN = document.querySelector('a[rel="playerSubmenu"] b').textContent
  const donneeCachee = localStorage.getItem(cacheKey)

  if (donneeCachee) {
    const cache = JSON.parse(donneeCachee)
    const movesString = []
    const moves = []

    cache.data.forEach((move) => {
      let m = {}
      m = move
      m.travelTime = parseFloat(move.dist) + parseInt(move.delay)
      moves.push(m)
    })

    moves.sort((a, b) => a.travelTime - b.travelTime)

    moves.forEach((move) => {
      const avgp =
        move.nbdest * Hyp.spaceAvgP[1][move.race] +
        move.nbcrui * Hyp.spaceAvgP[2][move.race] +
        move.nbbomb * Hyp.spaceAvgP[4][move.race] +
        move.nbscou * Hyp.spaceAvgP[3][move.race]

      const utcDate = new Date(
        $('.servertime').eq(0).text().replace('Server Time: ', '') + ' +00:00'
      )
      const etaDate = new Date(
        utcDate.getTime() + move.dist * 3600000 + move.delay * 3600000
      ) // Calcul de l'ETA
      const etaString = `${etaDate.getUTCHours()}:02 ST`

      const moveString = `${move.to} - ${numeral(avgp).format('0[.]0a')} ga:${
        move.nbarm
      } - ETA: ${
        parseInt(move.dist, 10) + parseInt(move.delay, 10)
      }H - @${etaString}`
      movesString.push(moveString)
    })

    const netlifyFunctionUrl =
      'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/moves'

    // Effectue la requête fetch et met à jour le cache et le timestamp
    fetch(netlifyFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: playerN, moves: movesString }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Mise à jour facultative du cache ici, si nécessaire
        localStorage.setItem(updateKey, now.toString()) // Met à jour le timestamp de la dernière requête
        console.log(
          'Les données ont été mises à jour et le timestamp du cache a été réinitialisé.'
        )
      })
      .catch((error) => {
        console.error('Erreur lors de la fetch : ', error)
      })
  } else {
    // Gestion de l'absence de données en cache, si nécessaire
    console.log('Aucune donnée en cache disponible.')
  }
}

window.setTimeout(HapiMoves, 1000)

async function getMoves() {
  const log = await Hyp.getSession()
  const gameId = log.gameId
  const cacheKey = `${gameId}-hapi-alliance-moves`
  const updateKey = `${gameId}-last-update-time`
  const now = new Date().getTime()

  // Vérifie si les données ont été mises à jour il y a moins de 15 minutes
  const lastUpdateTime = parseInt(localStorage.getItem(updateKey), 10)
  if (lastUpdateTime && now - lastUpdateTime < 900000) {
    // 900000 ms = 15 minutes
    console.log('Données mises à jour il y a moins de 15 minutes.')
    return JSON.parse(localStorage.getItem(cacheKey)) // Utilise les données en cache
  }

  let apiUrl = 'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/getMoves' // URL de l'API

  const response = await fetch(apiUrl)
  const data = await response.json()

  // Met à jour le cache avec les nouvelles données et l'heure de la mise à jour
  localStorage.setItem(cacheKey, JSON.stringify(data))
  localStorage.setItem(updateKey, now.toString()) // Enregistre le moment de la dernière mise à jour

  return data // Retourne les nouvelles données
}

async function displayMoves() {
  const movesData = await getMoves()
  console.log(movesData) // Affiche les données des mouvements
}

// displayMoves()
