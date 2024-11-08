async function handleCi(btn, action) {
  console.log('Abandon planets button clicked')

  btn.disabled = true
  btn.style.opacity = '0.6'

  const planets = document.querySelectorAll(
    '.tabbertab:not(.tabbertabhide) .planetCard3'
  )

  let countPlanets = 0
  const totalPlanets = planets.length

  showToast(`Handling 0/${totalPlanets} planets...`)

  for (const planet of planets) {
    const planetName = planet.querySelector('.planet').textContent.trim()
    const planetId = planet
      .querySelector('a.planet')
      .href.match(/planetid=(\d+)/)[1]

    try {
      const _post = {
        planetid: planetId,
        searchinfiltr: 'update',
      }
      if (action == 'set') {
        _post.accuracyid = 2
      } else {
        _post.accuracyid = 0
      }
      await $.post('/servlet/Planetinf', _post)
      countPlanets += 1
      showToast(`Handling ${countPlanets}/${totalPlanets} planets...`)
    } catch (error) {
      console.error(`Error Handling planet ${planetName}:`, error)
    }

    // Délai de 500ms entre chaque requête
    await delay(850)
  }

  showToast('All planets handled successfully!')
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
const initButtonsCi = () => {
  const container = document.querySelector('.tabbertab:not(.tabbertabhide)')
  if (!container) return

  const btnDropCi = document.querySelector('.ci-remove')
  if (btnDropCi) {
    btnDropCi.addEventListener('click', () => {
      handleCi(btnDropCi, 'remove')
    })
  }
  const btnSetCi = document.querySelector('.ci-add')
  if (btnSetCi) {
    btnSetCi.addEventListener('click', () => {
      handleCi(btnSetCi, 'set')
    })
  }
}

// Initialisation des boutons
window.setTimeout(initButtonsCi, 1500)
