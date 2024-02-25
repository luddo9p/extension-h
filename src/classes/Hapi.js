

let playerName = document.querySelector('a[rel="playerSubmenu"] b').textContent

$button = $("<br/><button class='btn btn-primary'>").text(
  playerName + ' : Update the spreadsheet'
)
$('.pageTitle').append($button)

async function Hapi() {
  $button.text('Updating the spreadsheet...')
  const cashHtml = await Hyp.scrapeData(
    'https://hyperiums.com/servlet/Cash?pagetype=statement'
  )

  const log = await Hyp.getSession()
  await localforage.setItem('hapi', log.authKey)
  const planets = await localforage.getItem(log.gameId + '-currentPlanets')

  let incomes = []
  $(cashHtml)
    .find('.cashArray')
    .each((index, table) => {
      const indexTr =
        $(table).find('.hr').eq(0).text().replace(/\D/g, '') === '750000'
          ? 1
          : 0

      const income = $(table).find('.highlight').text().replace(/\D/g, '')
      const planetName = $(table).parent().parent().find('.planet b').text()

      if (planetName.length > 0) {
        incomes.push({
          planet: planetName,
          income: parseInt(income, 10),
          incomeFormat: numeral(parseInt(income, 10)).format('0,0'),
        })
      }
    })

    const upkeep = Math.abs($(cashHtml).find('.cashArray').eq(0).find('tr').eq(2).find('.hr').text().replace(/\D/g, ''))
    const deployment = Math.abs($(cashHtml).find('.cashArray').eq(0).find('tr').eq(3).find('.hr').text().replace(/\D/g, ''))

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

  const headers = [
    'name',
    'civ',
    'prod',
    'activity',
    'income',
    'exploits',
    'pop',
    'gov',
  ]
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

  const netlifyFunctionUrl =
    'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/planets'

  // const netlifyFunctionUrl =
  //   'http://localhost:8885/.netlify/functions/planets'

  fetch(netlifyFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      player: playerName,
      planets: formattedData,
      upkeep: upkeep,
      deployment: deployment
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Réponse de la fonction Netlify:', data)
      $button.text('The spreadsheet of ' + playerName + ' is updated !')
    })
    .catch((error) => {
      console.error('Erreur lors de l’envoi de la requête:', error)
    })
}

$button.on('click', () => {
 // Hapi()
})

$mapBtn = $("<br/><button class='btn btn-primary'>").text('Generate the list')

$('.pageTitle').append($mapBtn)

const onMapClick = async (e) => {
  const log = await Hyp.getSession()
  const list = []
  const response = await axios.get(
    'https://hyperiums.com/servlet/Maps?pt=&reqx=0&reqy=0&c=1&d=10'
  )

  const myPlanets = await localforage.getItem(log.gameId + '-currentPlanets')
  const getTag = myPlanets.data[0].tag1

  const parser = new DOMParser()
  const doc = parser.parseFromString(response.data, 'text/html')

  const planets = Hyp.getPlanetsFromTradingMap(doc)

  const alliancePlanetList = await localforage.getItem(log.gameId + '-alliance')

  alliancePlanetList.data.forEach((planet) => {
    const find = planets.find((item) => item.name === planet.planet)
    if (find) {
      list.push({
        player: planet.player,
        planet:
          find.name +
          ' [' +
          find.tag +
          '] ' +
          find.raceName[0] +
          find.productName[0] +
          ' ' +
          find.govName,
      })
    } else {
      list.push({
        player: planet.player,
        planet: planet.planet,
      })
    }
  })

  const netlifyFunctionUrl =
  'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/list'

  fetch(netlifyFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tag: getTag,
      alliancePlanetList: list,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Erreur lors de l’envoi de la requête:', error)
    })
}

$mapBtn.on('click', () => {
  onMapClick()
})

function enregistrerConnexion() {
  const maintenant = new Date();
  localStorage.setItem('connexion', maintenant.getTime());

  // Planifier les prochaines exécutions
  const prochaineExecution1 = maintenant.getTime() + 8 * 60 * 60 * 1000; // 8 heures plus tard
  const prochaineExecution2 = prochaineExecution1 + 8 * 60 * 60 * 1000; // Encore 8 heures plus tard

  localStorage.setItem('prochaineExecution1', prochaineExecution1);
  localStorage.setItem('prochaineExecution2', prochaineExecution2);
}

function verifierEtDeclencher() {
  const maintenant = new Date().getTime();
  const prochaineExecution1 = parseInt(localStorage.getItem('prochaineExecution1') || '0');
  const prochaineExecution2 = parseInt(localStorage.getItem('prochaineExecution2') || '0');

  // if (maintenant >= prochaineExecution1 && prochaineExecution1 !== 0) {
  //     Hapi();
  //     localStorage.setItem('prochaineExecution1', '0'); // Réinitialiser pour éviter des exécutions multiples
  // }

  // if (maintenant >= prochaineExecution2 && prochaineExecution2 !== 0) {
  //     Hapi();
  //     localStorage.setItem('prochaineExecution2', '0'); // Réinitialiser pour éviter des exécutions multiples
  // }
}

function init() {
  const connexion = localStorage.getItem('connexion');
  const maintenant = new Date().getTime();

  console.log('Dernière connexion:', connexion);
  console.log('Maintenant:', maintenant);

  // Si c'est la première connexion de la journée ou pas encore enregistré
  if (!connexion || maintenant >= parseInt(connexion) + 24 * 60 * 10000) {
      enregistrerConnexion();
      Hapi(); // Déclencher immédiatement à la connexion
  }

  onMapClick()

  // verifierEtDeclencher(); // Vérifier si on doit déclencher à nouveau
}

init();