const globalgov = async function () {
  const gameId = await localforage.getItem('currentGameId')
  let planets = await localforage.getItem(gameId + '-currentPlanets')

  let xillors = []
  let azterks = []
  let humans = []

  $('form').before(`<div class="buttons">
        <button class="switch-gov" data-check="1" data-gov='2'>🔘 Demo</button>
        <button class="switch-gov" data-check="1" data-gov='1'>🔘 Auth</button>
        <button class="switch-gov" data-check="1" data-gov='0'>🔘 Dict</button>
      </div><br>`)

  $(document).on('click', '.switch-gov', (e) => {
    const $target = $(e.target)
    const govId = parseInt($target.attr('data-gov'))
    $('select').each((i, el) => {
      $(el).val(govId).change()
    })
    //   const checked = parseInt($target.attr('data-check'))
    //   if (checked) {
    //     $('.gov-' + govId).prop('checked', true)
    //     $target.attr('data-check', 0)
    //   } else {
    //     $('.gov-' + govId).prop('checked', false)
    //     $target.attr('data-check', 1)
    //   }
  })
  Hyp.getPlanetInfo().done(function (planets) {
    $.each(planets, function (_, planet) {
      console.log(planet)
      let color = planet.governmentId === 0 ? '#7c4242' : ''
      $('[href="Planet?planetid=' + planet.id + '"]')
        .closest('tr')
        .children('td')
        .eq(0)
        .append(
          '<br><br/>Exploits: ',
          numeral(planet.numExploits).format('0,0') + '<br/>'
        )
    })
  })
}
globalgov()
