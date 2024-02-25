async function HapiMoves() {
  const log = await Hyp.getSession()

  const donneeCachee = localStorage.getItem(log.gameId + '-hapiDataCache')
  let playerN = document.querySelector('a[rel="playerSubmenu"] b').textContent

  if (donneeCachee) {
    const cache = JSON.parse(donneeCachee)
    console.log('Donnée récupérée du cache:', cache.data)

    const movesString = []

    cache.data.forEach((move) => {
      const avgp =
        move.nbdest * Hyp.spaceAvgP[1][move.race] +
        move.nbcrui * Hyp.spaceAvgP[2][move.race] +
        move.nbbomb * Hyp.spaceAvgP[4][move.race] +
        move.nbscou * Hyp.spaceAvgP[3][move.race]

      const utcDate = new Date(
        $('.servertime').eq(0).text().replace('Server Time: ', '') + ' +00:00'
      )
      const etaDate = new Date(
        utcDate.getTime() + move.dist * 3600000 + move.delay * 3600000
      ) // Calcul de l'ETA
      const etaString = `${etaDate.getUTCHours()}:02 ST`

      const moveString = `${move.to} - ${numeral(avgp).format('0[.]0a')} ga:${
        move.nbarm
      } @${etaString}`
      movesString.push(moveString)
    })

    const netlifyFunctionUrl =
      'https://marvelous-shortbread-e2d12d.netlify.app/.netlify/functions/moves'


    fetch(netlifyFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player: playerN,
        moves: movesString,
        // controlled: cache.controlled,
      }),
    }).then((response) => response.json())
  }
}
HapiMoves()