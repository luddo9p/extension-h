

const isOwnedPlanets = document.querySelector('.hc.banner') && document.querySelector('.hc.banner').textContent.includes('controlled')

console.log('isOwnedPlanets:', isOwnedPlanets)



// Fonction générique pour gérer le dépôt des armées
async function handleDrop(btn) {
  console.log('Drop armies button clicked')

  btn.disabled = true
  btn.style.opacity = '0.6'

  const gameId = await localforage.getItem('currentGameId')
  const foreignPlanets = await Hyp.getFleetsInfo({
    data: isOwnedPlanets ? 'own_planets': 'foreign_planets',
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
  btnDrop.textContent = 'Drop Gas'
  btnDrop.style = 'padding: 5px 10px; margin:0 2px; margin-bottom: 30px;'
  container.insertBefore(btnDrop, container.firstChild)

  // Création du bouton pour charger les armées
  const btnLoad = document.createElement('button')
  btnLoad.textContent = 'Load Gas'
  btnLoad.style = 'padding: 5px 10px; margin:0 2px; margin-bottom: 30px;'
  container.insertBefore(btnLoad, container.firstChild)

  console.log('Buttons loaded')

  // Gestion des clics sur les boutons
  btnDrop.addEventListener('click', () => {
    handleDrop(btnDrop)
  })

  btnLoad.addEventListener('click', () => {
    handleLoad(btnLoad)
  })

  console.log(
    'Buttons event listeners added',
    document.querySelector('.btn-drop')
  )

  document.querySelectorAll('.btn-drop').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      btn.disabled = true
      btn.style.opacity = '0.6'

      // Using closest() for better reliability
      const planetCard = e.target.closest('.planetCard3')
      if (!planetCard) {
        console.error('Planet card not found.')
        btn.disabled = false
        btn.style.opacity = '1'
        return
      }

      const planetLink = planetCard.querySelector('a.planet')
      const planetName = planetLink.textContent.trim()


      showToast('Dropping gas on planet...')

      try {
        const foreignPlanets = await Hyp.getFleetsInfo({
          data: isOwnedPlanets ? 'own_planets': 'foreign_planets',
        })
        const planetData = foreignPlanets.find((p) => p.name.toString() === planetName)

        console.log('Planet data:', planetData)

        if (planetData) {
          // Your logic to drop gas
          // ...
          planetData.fleets.forEach(async (fleet) => {
            if (fleet.numCarriedArmies && fleet.numCarriedArmies > 0) {
              const params = {
                fleetid: fleet.id,
                nbarmies: fleet.numCarriedArmies,
                droparmies: 'Drop armies',
                planetid: planetLink.href.match(/planetid=(\d+)/)[1],
              }

              console.log('Dropping gas on planet:', planetName, params)
              const response = await Hyp.dropArmies(params)
              console.log('Gas dropped:', response)
            }
          });

          showToast('Gas dropped successfully!', true)
        } else {
          showToast('No fleets found on this planet.')
        }
      } catch (error) {
        console.error('Error dropping gas:', error)
        showToast('Error dropping gas on planet.')
      } finally {
        btn.disabled = false
        btn.style.opacity = '1'
      }
    })
  })

  document.querySelectorAll('.btn-load').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      btn.disabled = true
      btn.style.opacity = '0.6'

      // Using closest() for better reliability
      const planetCard = e.target.closest('.planetCard3')
      if (!planetCard) {
        console.error('Planet card not found.')
        btn.disabled = false
        btn.style.opacity = '1'
        return
      }

      const planetLink = planetCard.querySelector('a.planet')
      const planetName = planetLink.textContent.trim()


      showToast('Dropping gas on planet...')

      try {
        const foreignPlanets = await Hyp.getFleetsInfo({
          data: isOwnedPlanets ? 'own_planets': 'foreign_planets',
        })
        const planetData = foreignPlanets.find((p) => p.name.toString() === planetName)

        console.log('Planet data:', planetData, planetLink.href.match(/planetid=(\d+)/)[1])

        if (planetData) {
          // Your logic to drop gas
          // ...
          planetData.fleets.forEach(async (fleet) => {
            if (fleet.numGroundArmies && fleet.numGroundArmies > 0) {
              const params = {
                nbarmies: fleet.numGroundArmies,
                randomLoadAll: 'Load All',
                planetid: planetLink.href.match(/planetid=(\d+)/)[1],
                isownplanet: 0,
              }

              console.log('Dropping gas on planet:', planetName, params)
              const response = await Hyp.dropArmies(params)
              console.log('Gas loaded:', response)
            }
          });

          showToast('Gas loaded successfully!', true)
        } else {
          showToast('No fleets found on this planet.')
        }
      } catch (error) {
        console.error('Error loaded gas:', error)
        showToast('Error loaded gas on planet.')
      } finally {
        btn.disabled = false
        btn.style.opacity = '1'
      }
    })
  })
}

// Initialisation des boutons
window.setTimeout(initButtons, 500)
