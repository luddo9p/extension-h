$('form #stdArray td:nth-child(4)').append(
  $('<input maxlength="4" size="4">')
    .keydown(function (event) {
      if (event.which == 13) {
        event.preventDefault()
      }
    })
    .on('input', function () {
      $(this)
        .closest('table')
        .find(':not(#stdArray) input[type="text"]')
        .val($(this).val())
    })
)

Hyp.getPlanetInfo().done(function (planets) {
  $.each(planets, function (_, planet) {
    console.log(planet.governmentId === 1)
    let color = planet.governmentId === 0 ? '#7c4242' : ''
    $('[href="Planetprod?planetid=' + planet.id + '"]')
      .closest('tr')
      .children('td')
      .eq(2)
      .append(
        '<br>Population size: ',
        numeral(planet.pop).format('0,0'),
        '&nbsp;M'
      )
    console.log($('[href="Planetprod?planetid=' + planet.id + '"]').parent())
    $('[href="Planetprod?planetid=' + planet.id + '"]')
      .parent()
      .parent()
      .attr('style', 'background-color:' + color + ' !important;')
  })
})
