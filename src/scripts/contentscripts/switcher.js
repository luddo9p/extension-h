// Fonction générique pour gérer l'abandon des planètes avec un délai
async function handleAbandon(btn, action) {

  btn.disabled = true
  btn.style.opacity = '0.6'

  const gameId = await localforage.getItem('currentGameId')
  const foreignPlanets = await Hyp.getFleetsInfo({
    data: isOwnedPlanets ? 'own_planets' : 'foreign_planets',
  })

  const planets = document.querySelectorAll(
    '.tabbertab:not(.tabbertabhide) .planetCard3'
  )

  let countAbandoned = 0
  const totalAbandon = planets.length

  showToast(`Switching 0/${totalAbandon} planets...`)

  for (const planet of planets) {
    const planetName = planet.querySelector('.planet').textContent.trim()
    const match = foreignPlanets.find((fp) => fp.name === planetName)
    const planetId = planet
      .querySelector('a.planet')
      .href.match(/planetid=(\d+)/)[1]

    try {
      await $.post(`/servlet/Floatorders`, {
        switchattack: action,
        planetid: planetId,
      })
      countAbandoned += 1
      showToast(`Abandoning ${countAbandoned}/${totalAbandon} planets...`)
    } catch (error) {
      console.error(`Error switching planet ${planetName}:`, error)
    }

    // Délai de 500ms entre chaque requête
    await delay(650)
  }

  showToast('All planets switched successfully!')
  setTimeout(() => {
    const toast = document.querySelector('.toast')
    if (toast) {
      toast.style.display = 'none'
    }
  }, 5000)

  btn.disabled = false
  btn.style.opacity = '1'
}

// Fonction principale pour initier le dépôt et le chargement des armées
const initButtonsSwitch = () => {
  const container = document.querySelector('.tabberlive')
  if (!container) return

  // Création du bouton pour charger les armées
  const btnSwitchDef = document.createElement('button')
  btnSwitchDef.textContent = 'All Def'
  btnSwitchDef.style = 'padding: 5px 10px; margin:0 2px; margin-bottom: 30px;'
  container.insertBefore(btnSwitchDef, container.firstChild)

  // Création du bouton pour déposer les armées
  const btnSwitchAtt = document.createElement('button')
  btnSwitchAtt.textContent = 'All Att'
  btnSwitchAtt.style = 'padding: 5px 10px; margin:0 2px; margin-bottom: 30px;'
  container.insertBefore(btnSwitchAtt, container.firstChild)



  if (btnSwitchAtt) {
    btnSwitchAtt.addEventListener('click', () => {
      handleAbandon(btnSwitchAtt, 'attack')
    })
  }
  if (btnSwitchDef) {
    btnSwitchDef.addEventListener('click', () => {
      handleAbandon(btnSwitchDef, 'defend')
    })
  }
}

// Initialisation des boutons
window.setTimeout(initButtonsSwitch, 1500)
