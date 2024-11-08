
async function handleTag(btn, status, type) {
  const privateTag =
    document.querySelector('.privateTag')?.textContent?.trim() || ''
  const tagId =
    document
      .querySelector('.privateTag a')
      ?.getAttribute('href')
      ?.match(/tagid=(\d+)/)?.[1] || ''
  console.log('Abandon planets button clicked')

  btn.disabled = true
  btn.style.opacity = '0.6'

  const planets = document.querySelectorAll(
    '.tabbertab:not(.tabbertabhide) .planetCard3'
  )
  let countAbandoned = 0
  const totalAbandon = planets.length

  showToast(`Tagging 0/${totalAbandon} planets...`)

  for (const planet of planets) {
    const planetName =
      planet.querySelector('.planet')?.textContent?.trim() || ''
    const planetId =
      planet
        .querySelector('a.planet')
        ?.getAttribute('href')
        ?.match(/planetid=(\d+)/)?.[1] || ''

    try {
      let postData = {}

      if (status === 'Join') {
        postData = {
          planetid: planetId,
          joinalliance: 'Join',
          tag: privateTag,
          tagstate: 0,
        }
      } else {

        postData = {
          planetid: parseInt(planetId,10),
          updatetag: 'Update',
          tagid: parseInt(tagId,10),
          tagstate: type === 'private' ? 0 : 1,
        }
      }

      const alreadyTagged =
        (type === 'private' && planet.querySelector('.privateTag')) ||
        (type === 'public' && planet.querySelector('.publicTag'))

      if (alreadyTagged) {
        countAbandoned += 1
        showToast(`Already tagged ${planetName}`)
        continue
      }

      await $.post('/servlet/Alliance', postData)

      countAbandoned += 1
      showToast(`Tagging ${countAbandoned}/${totalAbandon} planets...`)
    } catch (error) {
      console.error(`Error tagging planet ${planetName}:`, error)
    }

    await delay(600)
  }

  showToast('All planets tagged successfully!')
  setTimeout(() => {
    const toast = document.querySelector('.toast')
    if (toast) {
      toast.style.display = 'none'
    }
  }, 5000)

  btn.disabled = false
  btn.style.opacity = '1'
}

const initButtonsTag = () => {
  const container = document.querySelector('.tabbertab:not(.tabbertabhide)')
  if (!container) return

  const btnTag = document.querySelector('.join-all')
  if (btnTag) {
    btnTag.addEventListener('click', (e) => {
      e.preventDefault()
      handleTag(btnTag, 'Join', 'private')
    })
  }

  const btnTagPrivate = document.querySelector('.tag-all-private')
  if (btnTagPrivate) {
    btnTagPrivate.addEventListener('click', (e) => {
      e.preventDefault()
      handleTag(btnTagPrivate, 'Update', 'private')
    })
  }

  const btnTagPub = document.querySelector('.tag-all-public')
  if (btnTagPub) {
    btnTagPub.addEventListener('click', (e) => {
      e.preventDefault()
      handleTag(btnTagPub, 'Update', 'public')
    })
  }
}

window.setTimeout(initButtonsTag, 1500)
