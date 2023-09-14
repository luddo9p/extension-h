const moves = async function() {
  const gameId = await localforage.getItem('currentGameId')
  let getMoves = await localforage.getItem(gameId + '-moves')
  if(!getMoves) return
  getMoves = getMoves.data
  var flatMoves = Object.keys(getMoves).reduce(function(r, k) {
    return r.concat(k, getMoves[k])
  }, [])

  let movesData = []
  flatMoves.forEach(item => {
    if (typeof item === 'object') {
      movesData.push(item)
    }
  })

  $('.planetCard3').each((i, card) => {
    const fleetId = parseInt(card.id.replace('mvgflt', ''), 10)
    const getFleetData = movesData.find(
      item => parseInt(item.fleetid) === fleetId
    )
    if (getFleetData && parseInt(getFleetData.nbarm) > 0) {
      if ($(card).text().includes('(drop on order)')) {
        $(card)
          .find('table')
          .eq(0)
          .append(
            `<tr><td style="text-align:right"><div class="drop button" data-move='${JSON.stringify(
              getFleetData
            )}' data-action="autodrop">auto-drop</div></td></tr>`
          )
      } else {
        $(card)
          .find('table')
          .eq(0)
          .append(
            `<tr><td style="text-align:right"><div class="drop button" data-move='${JSON.stringify(
              getFleetData
            )}' data-action="order">drop on order</div></td></tr>`
          )
      }
    }
  })

  $('.drop').on('click', function(e) {
    e.preventDefault()

    const action = $(this).attr('data-action')
    const moveData = JSON.parse($(this).attr('data-move'))
    const drop = action === 'autodrop' ? 1 : 0

    $.post('/servlet/Fleets', {
      destname: moveData.to,
      mission: moveData.defend,
      dropmode: drop,
      delay: moveData.delay,
      updatefleet: 'Update',
      floatid: moveData.fleetid,
      pagetype: 'moving_fleets'
    }).done(() => {
        window.location.reload()
    })
  })
}

moves()
