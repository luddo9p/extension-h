// Fonction utilitaire pour encoder les données en URL-encoded format
function encodeParams(params) {
  return Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    )
    .join('&')
}

// Fonction pour créer et afficher un toast en haut à droite
function showToast(message, removeAtEnd = false) {
  let toast = document.querySelector('.toast') // Vérifie si le toast existe déjà
  if (!toast) {
    toast = document.createElement('div')
    toast.className = 'toast'
    toast.style.opacity = '1'
    toast.style.zIndex = '7777'
    document.body.appendChild(toast)
  }
  toast.textContent = message
  toast.style.display = 'block'

  if(removeAtEnd) {
    setTimeout(() => {
      toast.style.display = 'none'
    }, 5000)
  }
}

// Fonction générique pour gérer le dépôt des armées
async function handleDrop(btn) {
  console.log('Drop armies button clicked')

  btn.disabled = true
  btn.style.opacity = '0.6'

  const gameId = await localforage.getItem('currentGameId')
  const foreignPlanets = await Hyp.getFleetsInfo({
    data: 'foreign_planets',
  })

  const planets = document.querySelectorAll(
    '.tabbertab:not(.tabbertabhide) .planetCard3'
  )

  const promises = []
  let countDropped = 0
  let totalDrops = 0

  showToast(`Dropping armies on 0/${totalDrops} planets...`)

  planets.forEach((planet, index) => {
    const planetName = planet.querySelector('.planet').textContent.trim()
    const match = foreignPlanets.find((fp) => fp.name === planetName)
    const planetId = planet
      .querySelector('a.planet')
      .href.match(/planetid=(\d+)/)[1]

    if (match) {
      match.fleets.forEach((fleet) => {
        if (fleet.numCarriedArmies && fleet.numCarriedArmies > 0) {
          totalDrops += 1
          const dropPromise = new Promise((resolve) => {
            setTimeout(async () => {
              const params = {
                fleetid: fleet.id,
                nbarmies: fleet.numCarriedArmies,
                droparmies: 'Drop armies',
                planetid: planetId,
              }

              try {
                const response = await Hyp.dropArmies(params)
                countDropped += 1
                showToast(
                  `Dropping armies on ${countDropped}/${totalDrops} planets...`
                )
              } catch (error) {
                console.error(
                  `Failed to drop armies on planet ${planetName}:`,
                  error
                )
                showToast(`Error dropping armies on planet ${planetName}.`)
              }
              resolve()
            }, index * 1500)
          })

          promises.push(dropPromise)
        }
      })
    }
  })

  Promise.all(promises)
    .then(() => {
      console.log('All drop armies operations completed.')
      showToast('All planets dropped armies successfully!')
      // Optionnel: cacher le toast après un certain temps
      setTimeout(() => {
        toast.style.display = 'none'
      }, 5000) // Cache le toast après 5 secondes
    })
    .catch((error) => {
      console.error('Error during drop armies operations:', error)
      showToast('Error during drop armies operations.')
    })
    .finally(() => {
      btn.disabled = false
      btn.style.opacity = '1'
    })
}

// Fonction générique pour gérer le chargement des armées
async function handleLoad(btn) {
  console.log('Load armies button clicked')

  btn.disabled = true
  btn.style.opacity = '0.6'

  const gameId = await localforage.getItem('currentGameId')
  const foreignPlanets = await Hyp.getFleetsInfo({
    data: 'foreign_planets',
  })

  const planets = document.querySelectorAll(
    '.tabbertab:not(.tabbertabhide) .planetCard3'
  )

  const promises = []
  let countLoaded = 0
  let totalLoads = 0

  showToast(`Loading armies from 0/${totalLoads} planets...`)

  planets.forEach((planet, index) => {
    const planetName = planet.querySelector('.planet').textContent.trim()
    const match = foreignPlanets.find((fp) => fp.name === planetName)
    const planetId = planet
      .querySelector('a.planet')
      .href.match(/planetid=(\d+)/)[1]

    if (match) {
      match.fleets.forEach((fleet) => {
        console.log(fleet)
        if (fleet.numGroundArmies && fleet.numGroundArmies > 0) {
          totalLoads += 1
          const loadPromise = new Promise((resolve) => {
            setTimeout(async () => {
              const params = {
                nbarmies: fleet.numGroundArmies,
                randomLoadAll: 'Load All',
                planetid: planetId,
                isownplanet: 0,
              }

              console.log('Loading armies from planet:', planetName, params)
              const response = await Hyp.loadArmies(params)

              try {
                const response = await Hyp.loadArmies(params)
                countLoaded += 1
                showToast(
                  `Loading armies from ${countLoaded}/${totalLoads} planets...`
                )
                console.log(
                  `Loaded armies from planet ${planetName}:`,
                  response
                )
              } catch (error) {
                console.error(
                  `Failed to load armies from planet ${planetName}:`,
                  error
                )
                showToast(`Error loading armies from planet ${planetName}.`)
              }
              resolve()
            }, index * 1500)
          })

          promises.push(loadPromise)
        }
      })
    }
  })

  Promise.all(promises)
    .then(() => {
      console.log('All load armies operations completed.')
      showToast('All planets loaded armies successfully!', true)
      window.location.reload()
    })
    .catch((error) => {
      console.error('Error during load armies operations:', error)
      showToast('Error during load armies operations.')
    })
    .finally(() => {
      btn.disabled = false
      btn.style.opacity = '1'
    })
}

// Fonction principale pour initier le dépôt et le chargement des armées
const initButtons = () => {
  const container = document.querySelector('.tabberlive')
  if (!container) return

  // Création du bouton pour déposer les armées
  const btnDrop = document.createElement('button')
  btnDrop.textContent = 'Drop Armies'
  btnDrop.style = 'padding: 5px 10px; margin:0 5px; margin-bottom: 30px;'
  container.insertBefore(btnDrop, container.firstChild)

  // Création du bouton pour charger les armées
  const btnLoad = document.createElement('button')
  btnLoad.textContent = 'Load Armies'
  btnLoad.style = 'padding: 5px 10px; margin:0 5px; margin-bottom: 30px;'
  container.insertBefore(btnLoad, container.firstChild)

  console.log('Buttons loaded')

  // Gestion des clics sur les boutons
  btnDrop.addEventListener('click', () => {
    handleDrop(btnDrop)
  })

  btnLoad.addEventListener('click', () => {
    handleLoad(btnLoad)
  })
}

// Lancer le script avec un délai initial
window.setTimeout(initButtons, 100)
