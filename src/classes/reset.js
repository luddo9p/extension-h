$('#clearDataButton').on('click', async function () {
  try {
    localStorage.clear()
    await localforage.clear()

    if (typeof chrome !== 'undefined' && chrome.cookies) {
      const allCookies = await getAllCookies('https://hyperiums.com')
      allCookies.forEach((cookie) => {
        chrome.cookies.remove(
          { url: 'https://hyperiums.com', name: cookie.name },
          function (details) {
            details
              ? console.log(`Cookie ${cookie.name} supprimé.`)
              : console.error(
                  `Erreur lors de la suppression du cookie ${cookie.name}.`
                )
          }
        )
      })
    } else {
      console.warn('API chrome.cookies non disponible.')
      alert('API chrome.cookies non disponible.')
    }

    alert('Toutes les données ont été effacées.')
  } catch (error) {
    console.error('Erreur lors de la suppression des données :', error)
    alert('Une erreur est survenue.')
  }
})

function getAllCookies(domainUrl) {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.cookies) {
      chrome.cookies.getAll({ url: domainUrl }, function (cookies) {
        chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve(cookies)
      })
    } else {
      reject(new Error('API chrome.cookies non disponible.'))
    }
  })
}

async function resetCaches(e) {
  try {
    if (e) e.preventDefault()

    localStorage.setItem('lastResetTime', Date.now().toString())

    const itemsToRemove = [
      '1-last-update-time',
      '1-hapi-alliance-owned-planets',
      'lastExecutionTimeForeign',
      'connexion',
      'prochaineExecution1',
      '1-hapiDataCache',
      'lastExecutionTime',
      'hapi-alliance-owned-planets',
      'prochaineExecution2',
      'hapiDataCacheMoves',
      'hapiDataCache',
    ]

    itemsToRemove.forEach((item) => localStorage.removeItem(item))

    localStorage.clear()
    await localforage.clear()

    if (typeof chrome !== 'undefined' && chrome.cookies) {
      const allCookies = await getAllCookies('https://hyperiums.com')
      allCookies.forEach((cookie) => {
        chrome.cookies.remove(
          { url: 'https://hyperiums.com', name: cookie.name },
          function (details) {
            details
              ? console.log(`Cookie ${cookie.name} supprimé.`)
              : console.error(
                  `Erreur lors de la suppression du cookie ${cookie.name}.`
                )
          }
        )
      })
    }

    $('#resetCaches').text('Caches reset')
    setTimeout(() => {
      $('#resetCaches').text('Reset Caches')
      // window.location.reload();
    }, 100)
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des caches :', error)
    alert('Une erreur est survenue.')
  }
}

if (window.location.href.includes('Home')) {
  $('.solidblockmenu')
    .next()
    .append(
      '<button class="btn btn-primary" id="resetCaches">Reset Caches</button>'
    )
  $('.solidblockmenu').next().addClass('reset-caches')
  $('#resetCaches').on('click', resetCaches)
}

const searchString =
  '<font color="#FF4444" face="verdana,arial" size="2">Backup buddy sessions are limited to <b>60</b> minutes.</font>'
const pageContent = document.documentElement.innerHTML
const containsString = pageContent.includes(searchString)

const lastResetTime = parseInt(localStorage.getItem('lastResetTime'), 10)
const oneMinute = 60000

if (
  containsString &&
  (!lastResetTime || Date.now() - lastResetTime >= oneMinute)
) {
  resetCaches()
}
