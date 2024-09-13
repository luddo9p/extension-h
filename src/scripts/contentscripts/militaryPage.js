function parseNumber(value) {
  value = value.trim()

  if (value.endsWith('K')) {
    return parseFloat(value.replace('K', '')) * 1000
  }

  if (value.endsWith('M')) {
    return parseFloat(value.replace('M', '')) * 1000000
  }

  return parseFloat(value)
}

function sumValues(value) {
  const cleanedValue = value.split('/')[0].trim()
  const parts = cleanedValue.split('+').map((part) => parseNumber(part))
  const total = parts.reduce((acc, num) => acc + num, 0)

  if (total >= 1000000) {
    return (total / 1000000).toFixed(1) + 'M'
  } else if (total >= 1000) {
    return (total / 1000).toFixed(1) + 'K'
  } else {
    return total.toString()
  }
}

function extractArmyInfo(htmlString) {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    const armyElement = doc.querySelector('.vb')
    const energyElement = doc.querySelector('[class^="energy"]')
    const planetElement = doc.querySelector('.planet')
    let enemyInfo = null

    // Cherche l'élément "Enemy space AvgP:" et récupère la valeur correspondante
    const rows = doc.querySelectorAll('table.bars tr')
    rows.forEach((row) => {
      const firstCell = row.querySelector('td')
      if (firstCell && firstCell.textContent.includes('Enemy space AvgP:')) {
        const enemyCell = row.querySelector('td:nth-child(3)')
        if (enemyCell) {
          enemyInfo = enemyCell.textContent.trim()
        }
      }
    })

    let planetName = ''
    if (planetElement) {
      planetName = planetElement.textContent.trim()
    } else {
      console.error('No planet name found')
      return null
    }

    if (armyElement) {
      const armyInfo = armyElement.textContent.trim()
      let result = planetName + ': F: '

      if (armyInfo.includes('+')) {
        result += sumValues(armyInfo)
      } else {
        result += sumValues(armyInfo)
      }

      // Ajouter les informations de flotte ennemie
      if (enemyInfo) {
        result += ` / E: ${sumValues(enemyInfo)}`
      } else {
        result += ' / E: no enemy info'
      }

      // Ajouter les informations sur l'énergie
      if (energyElement) {
        const energyLevel = energyElement.textContent.trim()
        result += ` (${energyLevel.replace('Energy: ', '')} nrg)`
      } else {
        result += ' (no nrg info)'
      }

      // Vérifier la présence de la classe flagStasis
      if (doc.querySelector('.flagStasis')) {
        result += ' (stasis)'
      }

      return result
    } else {
      console.error('No army info found')
      return null
    }
  } catch (error) {
    console.error('Error parsing HTML: ', error)
    return null
  }
}

async function militaryPage() {
  const gameId = await localforage.getItem('currentGameId')
  const cachedData = localStorage.getItem(gameId + '-hapiDataCache')
  const moves = JSON.parse(cachedData).data

  const mergeInputs = document.querySelectorAll(
    'td > input[name="merge"]:not(:disabled)'
  )
  const loadArmiesInputs = document.querySelectorAll(
    'td > input[name="loadarmies"]:not(:disabled)'
  )

  if (mergeInputs.length) {
    mergeInputs.forEach((input) => {
      const mergeButton = document.createElement('input')
      mergeButton.type = 'submit'
      mergeButton.className = 'button'
      mergeButton.name = 'merge'
      mergeButton.value = 'Merge All'

      mergeButton.addEventListener('click', function (event) {
        const form = this.closest('form')
        const hiddenConfirm = document.createElement('input')
        hiddenConfirm.type = 'hidden'
        hiddenConfirm.name = 'confirm'

        const hiddenMgtOrder = document.createElement('input')
        hiddenMgtOrder.type = 'hidden'
        hiddenMgtOrder.name = 'mgt_order_done'

        form.append(hiddenConfirm, hiddenMgtOrder)
      })

      input.insertAdjacentElement('afterend', mergeButton)
    })

    loadArmiesInputs.forEach((input) => {
      const loadAllButton = document.createElement('input')
      loadAllButton.type = 'submit'
      loadAllButton.className = 'button'
      loadAllButton.name = 'randomLoadAll'
      loadAllButton.value = 'Load All'

      input.insertAdjacentElement('afterend', loadAllButton)
    })
  }

  // UI D2 Button Logic
  if (document.querySelectorAll('#OwnPlGroups, #Groups').length === 1) {
    const planetCards = document.querySelectorAll('.planetCard3')

    planetCards.forEach(async (card) => {
      const planetName = card.querySelector('.planet').textContent
      const planetID = card.getAttribute('id').replace('pc', '')
      const parent = card.querySelector('.planet').parentElement
      const title = parent.textContent
      const scIndex = title.indexOf('SC')
      const sc = parseInt(title.substring(scIndex + 2, scIndex + 4), 10)
      const coords = title.substring(scIndex + 3, scIndex + 13).split(',')
      const x = coords[0].replace('(', '').trim()
      const y = coords[1].replace(')', '').trim()

      const info = extractArmyInfo(card.innerHTML)

      if (!info) {
        console.log('No info found for', planetName)
      }

      const formAttack = `
        <form action="/servlet/Floatorders" method="post">
          <input name="planetid" value="${planetID}" type="hidden" />
          <input name="switchattack" value="attack" type="text" />
          <input name="go" value="ok" type="hidden" />
          <input name="submit" class="button" value="Switch DEF" type="submit" />
        </form>`
      const formDef = `
        <form action="/servlet/Floatorders" method="post">
          <input name="planetid" value="${planetID}" type="hidden" />
          <input name="switchattack" value="defend" type="text" />
          <input name="go" value="ok" type="hidden" />
          <input name="submit" class="button" value="Switch ATT" type="submit" />
        </form>`

      const isDefend = card.querySelector('.flagBattle') !== null
      const action = isDefend ? 'defend' : 'attack'
      const style = isDefend ? 'green' : 'red'
      const switchText = isDefend ? 'DEF' : 'ATT'

      card.querySelector('.bars').parentElement.insertAdjacentHTML(
        'beforeend',
        `<br/><td><div class="flex-line">
          <button data-action="${action}" data-id="${planetID}" style="color: ${style}; text-transform:uppercase;font-size:9px;display:block; width:auto;" class="custom-button btn-switch">🔄 ${switchText}</button>
          <button data-action="merge" data-id="${planetID}" style="display:block; width:auto; text-transform:uppercase; font-size:9px" class="custom-button btn-gas">🧰 merge gas</button>
          <button style="display:block; width:auto; text-transform:uppercase; font-size:9px" data-action="drop" data-id="${planetID}" class="custom-button btn-drop">🚢 drop</button>
        </div></td>`
      )

      const militFlags = card.querySelector('.militFlags tr')
      militFlags.insertAdjacentHTML(
        'beforeend',
        `<td></td><td>
        <a class="custom-button" style="font-size:10px" href="https://hyperiums.com/servlet/Maps?pt=&reqx=${x}&reqy=${y
          .replace('S', '')
          .trim()}&c=${sc}&d=2" target="_blank">📍 D2</a></td>`
      )

      const addToGroupButton = document.createElement('button')
      addToGroupButton.className = 'addToGroup custom-button'
      addToGroupButton.textContent = '➕ Add'
      addToGroupButton.style.fontSize = '10px'
      addToGroupButton.title = 'Use Define/Extend to confirm & save'
      addToGroupButton.addEventListener('click', () => {
        document
          .querySelectorAll('#OwnPlGroups, #Groups')
          .forEach((group) => (group.style.display = 'block'))
        const listInput = document.querySelector('input[name="listplanets"]')
        const currentList = listInput.value.trim()
        listInput.value = currentList.length
          ? `${currentList},${planetName}`
          : planetName
        addToGroupButton.style.display = 'none'
      })

      militFlags.append(addToGroupButton)

      const movesHTML = Hyp.generateFleetMovesHTML(moves, planetName)
      if (movesHTML) {
        const movesTable = document.createElement('div')
        movesTable.className = 'moves'
        movesTable.innerHTML = movesHTML

        card
          .querySelector('.bars')
          .parentElement.querySelector('.flex-line')
          .after(movesTable)
      }
      if (info) {
        const infoTable = document.createElement('div')
        infoTable.className = 'infoCC'
        infoTable.innerHTML =
          '<span>' +
          info +
          '</span><span style="font-size:10px"> (📋 click to copy)</span>'

        card
          .querySelector('.bars')
          .parentElement.querySelector('.flex-line')
          .after(infoTable)
      }
    })

    // Event listeners for buttons
    document.addEventListener('click', async (e) => {
      const target = e.target

      if (target.classList.contains('btn-switch')) {
        const action = target.getAttribute('data-action')
        const id = target.getAttribute('data-id')
        const switchText = action === 'attack' ? 'DEF' : 'ATT'
        const postData = {
          planetid: id,
          [action === 'attack' ? 'switchattack' : 'switchdefend']: action,
        }

        try {
          await fetch('/servlet/Floatorders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(postData),
          })

          target.setAttribute(
            'data-action',
            action === 'attack' ? 'defend' : 'attack'
          )
          target.style.color = action === 'attack' ? 'green' : 'red'
          target.textContent = `🔄 ${switchText}`
        } catch (error) {
          console.error('Switch action failed:', error)
        }
      } else if (target.classList.contains('btn-gas')) {
        const id = target.getAttribute('data-id')
        await Hyp.mergeAll(id)
        target.textContent = 'merged'
      }
    })
  }
}

window.setTimeout(militaryPage, 100)
