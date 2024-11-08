async function PostControlled() {
  const currentTime = new Date().getTime()
  const lastExecutionTime = localStorage.getItem('lastExecutionTime')
  const EXPIRE = 3600000

  if (lastExecutionTime && currentTime - lastExecutionTime < EXPIRE) {
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

  // console.log(planetList)
}

PostControlled()


async function getControlledPlanets() {
    const log = await Hyp.getSession();
    const gameId = log.gameId;
    const cacheKey = `${gameId}-hapi-alliance-owned-planets`;
    const updateKey = `${gameId}-last-update-time`;
    const now = new Date().getTime();
    const EXPIRE = 15 * 60 * 1000
    // Vérifie si les données ont été mises à jour il y a moins de 5 minutes
    const lastUpdateTime = parseInt(localStorage.getItem(updateKey), 10);
    if (lastUpdateTime && now - lastUpdateTime < EXPIRE) {
        console.log('Utilisation des données en cache (moins de 5 minutes depuis la dernière mise à jour).');
        return JSON.parse(localStorage.getItem(cacheKey)).planets;
    }

    // Si les données doivent être mises à jour
    const response = await fetch('https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/getControlled');
    const data = await response.json();

    // Suppose que cache existe déjà et contient un objet avec une propriété `planets`
    const cache = localStorage.getItem(cacheKey);
    const cachedPlanets = cache ? JSON.parse(cache).planets : [];

    // Fusionne les deux tableaux et supprime les doublons
    const combinedArray = data.concat(cachedPlanets);
    const uniqueArray = combinedArray.filter((planet, index, self) =>
        index === self.findIndex((t) => (
            t.player === planet.player && t.planet === planet.planet
        ))
    );

    // Stocke le tableau unique et le temps de mise à jour dans localStorage
    localStorage.setItem(cacheKey, JSON.stringify({ planets: uniqueArray }));
    localStorage.setItem(updateKey, now.toString());

    return uniqueArray;
}

async function getAttackList() {
  const log = await Hyp.getSession();
  const gameId = log.gameId;
  const cacheKey = `${gameId}-hapi-attack-list`;
  const updateKey = `${gameId}-last-attack-update-time`;
  const now = new Date().getTime();
  const EXPIRE = 3600000;

  // Vérifie le cache et sa date de mise à jour
  const lastUpdateTime = parseInt(localStorage.getItem(updateKey), 10);
  if (lastUpdateTime && now - lastUpdateTime < EXPIRE) {
    console.log('Utilisation des données en cache (moins d\'une heure depuis la dernière mise à jour).');
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      return parsedCache.attacks || [];
    }
    return [];
  }

  try {
    const response = await fetch('https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/getAttackList');
    const data = await response.json();
    console.log('Réponse API :', data); // Log la réponse API

    // Vérifie si 'data' est bien un objet avec des listes de planètes
    const attackList = [];
    if (data && typeof data === 'object') {
      for (const player in data) {
        if (Array.isArray(data[player])) {
          data[player].forEach(planet => {
            attackList.push({ player, planet });
          });
        }
      }
    }

    console.log('Liste des attaques :', attackList); // Log les données des attaques

    // Vérifie l'existence du cache
    const cache = localStorage.getItem(cacheKey);
    const cachedAttacks = cache ? JSON.parse(cache).attacks || [] : [];

    // Fusionne les deux tableaux et supprime les doublons
    const combinedArray = attackList.concat(cachedAttacks);
    const uniqueArray = combinedArray.filter((attack, index, self) =>
      index === self.findIndex((t) => t.player === attack.player && t.planet === attack.planet)
    );

    // Stocke le tableau unique et le temps de mise à jour dans localStorage
    localStorage.setItem(cacheKey, JSON.stringify({ attacks: uniqueArray }));
    localStorage.setItem(updateKey, now.toString());

    return uniqueArray;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'API :', error);
    return [];
  }
}

getAttackList();




getControlledPlanets();
