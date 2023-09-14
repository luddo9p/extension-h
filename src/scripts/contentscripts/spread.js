if (
  $('.formTitle').length > 0 &&
  $('.formTitle').text() === 'Fleets spreading'
) {
  async function spread() {
    const gameId = await localforage.getItem('currentGameId')
    const store = await localforage.getItem(gameId + '-alliance')
    const currentPlayer = await localforage.getItem(gameId + '-currentPlayer')

    $('.alternArray tr').each(function (i, tr) {
      var planetName = $(tr).find('td').eq(1).text()
      find = store.data.find((item) => item.planet === planetName.trim())
      if (find) {
        if (find.player === currentPlayer) {
          $(tr).addClass('me')
        } else {
          $(tr).addClass('friend')
        }
      }
    })
  }
  spread()
}
