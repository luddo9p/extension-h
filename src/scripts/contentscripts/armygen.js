const armyGen = async function () {
  const gameId = await localforage.getItem('currentGameId')
  let planets = await localforage.getItem(gameId + '-currentPlanets')

  let xillors = []
  let azterks = []
  let humans  = []

  $('form table')
    .find('tr')
    .each((i, item) => {
      var $item = $(item)
      if (i === 0) {
        $item.find('td').eq(1).after($('<td width="120">Race</td>'))
      } else {
        var planet = $item.find('td').eq(0).find('a').text()

        console.log(planet)

        const findPlanet = planets.data.find((p) => p.name === planet)

        if (findPlanet && findPlanet.raceId === 2) {
          xillors.push(Math.round($item.find('td').eq(3).text()))
        }
        if (findPlanet && findPlanet.raceId === 1) {
          azterks.push(Math.round($item.find('td').eq(3).text()))
        }
        if (findPlanet && findPlanet.raceId === 0) {
          humans.push(Math.round($item.find('td').eq(3).text()))
        }
        $item
          .find('td')
          .eq(1)
          .after(`<td class="highlight">${Hyp.races[findPlanet.raceId]}</td>`)

        $item
          .find('.checkbox')
          .addClass('race-' + findPlanet.raceId)
          .prop('checked', false)
      }
    })

  $('form').before(`<div class="stats">
      <span class="highlight">Xillors: ${xillors.reduce(
        (a, b) => a + b,
        0
      )}/day</span> - 
      <span class="highlight">Azterks: ${azterks.reduce(
        (a, b) => a + b,
        0
      )}/day</span> -
      <span class="highlight">Humans: ${humans.reduce(
        (a, b) => a + b,
        0
      )}/day</span>  
    </div><br>`)
  $('form').before(`<div class="buttons">
      <button class="switch-race" data-check="1" data-race='2'>🔘 Xillors</button>
      <button class="switch-race" data-check="1" data-race='1'>🔘 Azterk</button>
      <button class="switch-race" data-check="1" data-race='0'>🔘 Humans</button>
    </div><br>`)

  $(document).on('click', '.switch-race', (e) => {
    const $target = $(e.target)
    const raceId = parseInt($target.attr('data-race'))
    const checked = parseInt($target.attr('data-check'))
    if (checked) {
      $('.race-' + raceId).prop('checked', true)
      $target.attr('data-check', 0)
    } else {
      $('.race-' + raceId).prop('checked', false)
      $target.attr('data-check', 1)
    }
  })
}
if ($('.formTitle').text() === 'Global armies generation manager') armyGen()
