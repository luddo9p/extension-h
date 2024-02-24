const cell = $('form #stdArray td:nth-child(4)')
cell.empty()

Hyp.getPlanetInfo().done(function (planets) {
  $.each(planets, function (_, planet) {
    let color = planet.governmentId === 0 ? '#7c4242' : ''
    let classDict = planet.governmentId === 0 ? 'dict' : ''
    $('[href="Planetprod?planetid=' + planet.id + '"]')
      .closest('tr')
      .children('td')
      .eq(2)
      .append(
        '<br>Population size: ',
        numeral(planet.pop).format('0,0'),
        '&nbsp;M'
      )

    $('[href="Planetprod?planetid=' + planet.id + '"]')
      .parent()
      .parent()
      .addClass(classDict)
      .attr('style', 'background-color:' + color + ' !important;')
  })

  cell.append(
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
  cell.append(' -')
  cell.append(
    $('<input maxlength="4" size="4" style="background:#5e3c3c !important;">')
      .keydown(function (event) {
        if (event.which == 13) {
          event.preventDefault()
        }
      })
      .on('input', function () {
        console.log($(this)
        .closest('table')
        .find('.dict'))
        const $val = $(this).val()
        $(this)
          .closest('table')
          .find('.dict').find('input[type="text"]')
          .val($val)
      })
  )
})
