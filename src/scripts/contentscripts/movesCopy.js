function copyStatuses() {
  const movesDivs = document.querySelectorAll('.moves')
  let infoCCDivs = document.querySelectorAll('.tabbertab .infoCC')

  console.log(movesDivs)

  if (movesDivs.length === 0 && infoCCDivs.length === 0) {
    return
  }

  const toast = document.createElement('div')
  toast.id = 'toast'
  toast.className = 'toast'
  document.body.appendChild(toast)

  function addCopyEvent(div) {
    div.addEventListener('click', () => {
      let textToCopy = div.textContent || ''
      textToCopy = textToCopy
        .replace(/\s+/g, ' ')
        .replace('(📋 click to copy)', '')
        .trim()

      if (!textToCopy) {
        console.error('No text to copy')
        return
      }

      navigator.clipboard.writeText(textToCopy).then(
        () => {
          showToast('Content copied successfully!')
        },
        (err) => {
          console.error('Échec de la copie : ', err)
          showToast('Échec de la copie.')
        }
      )
    })
  }

  movesDivs.forEach(addCopyEvent)
  infoCCDivs.forEach(addCopyEvent)

  // Ajout du bouton pour copier toutes les informations des .infoCC dans l'onglet actif
  const copyAllBtn = document.createElement('button')
  copyAllBtn.textContent = 'Copy'
  copyAllBtn.style = 'padding: 5px 10px; margin: 0px 2px 30px;'
  const container = document.querySelector('.tabberlive')
  container.insertBefore(copyAllBtn, container.firstChild)

  copyAllBtn.addEventListener('click', () => {
    infoCCDivs = document.querySelectorAll(
      '.tabbertab:not(.tabbertabhide) .infoCC'
    )
    let combinedText = Array.from(infoCCDivs)
      .map((div) =>
        div.textContent
          .trim()
          .replace(/\s+/g, ' ')
          .replace('(📋 click to copy)', '')
      )
      .join('\r\n')

    if (!combinedText) {
      console.error('No text to copy')
      return
    }

    navigator.clipboard.writeText(combinedText).then(
      () => {
        showToast('All statuses copied successfully!')
      },
      (err) => {
        console.error('Échec de la copie : ', err)
        showToast('Échec de la copie.')
      }
    )
  })

  function showToast(message) {

    const style = document.createElement('style')
    style.textContent = `
            #toast {
                position: fixed;
                top: 50px;
                right: 20px;
                background-color: yellow;
                color: black;
                padding: 20px;
                border-radius: 5px;
                opacity: 0;
                transition: opacity 0.5s;
                z-index: 1000;
                font-size: 14px;
            }
    
            #toast.show {
                opacity: 1;
            }
        `
    document.head.appendChild(style)
    toast.textContent = message
    toast.style.display = 'block'

    setTimeout(() => {
      toast.style.display = 'none'
    }, 4000) // La notification disparaît après 4 secondes
  }
}

setTimeout(copyStatuses, 200)

function addClassToDelay() {
  const delayBtn = $('input[value="Delay"]')
  const parent = delayBtn.parent().parent().parent().parent()
  parent.addClass('delay-reroute')
}

setTimeout(addClassToDelay, 200)

const copyMovesTxt = (recap) => {
  let combinedText = recap.textContent.trim()

  if (!combinedText) {
    console.error('No text to copy')
    return
  }

  navigator.clipboard.writeText(combinedText).then(
    () => {
      showToast('All moves copied successfully!')
    },
    (err) => {
      console.error('Échec de la copie : ', err)
      showToast('Échec de la copie.')
    }
  )
}

function copyMoves() {
  //.recap

  const recap = document.querySelector('.recap-text')
  console.log(recap)

  if ($('.recap-btn').length === 0) {
    $('.movingFleetCard')
      .eq(0)
      .parent()
      .prepend(`<br/><br/><button class="recap-btn">Copy moves</button>`)
  }

  if (!recap) {
    return
  }

  recap.addEventListener('click', () => {
    copyMovesTxt(recap)
  })
  $('.recap-btn').on('click', function (e) {
    e.preventDefault()
    copyMovesTxt(recap)
  })
}

setTimeout(copyMoves, 200)