async function scrapeData(url) {
  try {
    // Faire une requête HTTP pour obtenir le contenu de la page
    const response = await axios.get(url)
    const data = response.data
    const $html = $(data)

    return $html
  } catch (error) {
    console.error('Erreur lors du scraping :', error)
    return null
  }
}

async function Hapi() {
  const cashHtml = await scrapeData(
    'https://hyperiums.com/servlet/Cash?pagetype=statement'
  )

  const log = await Hyp.getSession()
  await localforage.setItem('hapi', log.authKey)
  const hapiData = await localforage.getItem('hapi')
  const planets = await localforage.getItem(log.gameId + '-currentPlanets')

  let incomes = []
  $(cashHtml)
    .find('.cashArray')
    .each((index, table) => {
      const indexTr =
        $(table).find('.hr').eq(0).text().replace(/\D/g, '') === '750000'
          ? 1
          : 0

      const income = $(table).find('.hr').eq(indexTr).text().replace(/\D/g, '')

      const planetName = $(table).parent().parent().find('.planet b').text()

      incomes.push({
        planet: planetName,
        income: parseInt(income, 10),
        incomeFormat: numeral(parseInt(income, 10)).format('0,0'),
      })
    })

  const rawPlanets = []
  planets.data.forEach((planet) => {
    // Trouver les revenus correspondants pour la planète
    const getThePlanet = incomes.find((item) => item.planet === planet.name)

    if (getThePlanet) {
      // Ajouter les propriétés de revenu à l'objet 'planet'
      planet.income = getThePlanet.income
      planet.incomeFormat = getThePlanet.incomeFormat
    }

    rawPlanets.push(planet)
  })

  function formatGov(govId) {
    switch (govId) {
      case 0:
        return 'Dict'
        break
      case 1:
        return 'Auth'
        break
      case 2:
        return 'Demo'
        break
      case 3:
        return 'Prot'
        break
    }
  }

  function formatProd(prodId) {
    var prod = prodId === 0 ? 'Agro' : 'Minero'
    prod = prodId === 2 ? 'Techno' : prod
    return prod
  }
  const getPlayer = await localforage.getItem(log.gameId + '-currentPlayer')

  const headers = ['name', 'civ', 'prod', 'activity', 'income', 'exploits', 'pop', 'gov']
  const formattedData = [headers].concat(
    rawPlanets.map((planet) => [
      planet.name,
      planet.civ,
      formatProd(planet.productId),
      planet.activity,
      planet.income,
      planet.numExploits,
      planet.pop,
      formatGov(planet.governmentId),
    ])
  )

  const netlifyFunctionUrl = 'http://localhost:8885/.netlify/functions/planets'

  fetch(netlifyFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player: getPlayer, planets: formattedData }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Réponse de la fonction Netlify:', data)
    })
    .catch((error) => {
      console.error('Erreur lors de l’envoi de la requête:', error)
    })
}

Hapi()
