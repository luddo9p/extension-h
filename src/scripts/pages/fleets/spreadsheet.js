$(document).ready(function () {
  Hyp.getFleetsInfo().done(function (planets) {
    function format(number) {
      return numeral(number).format('0,0')
    }

    var tbody = $('tbody')
    $.each(planets, function (_, planet) {
      $.each(planet.fleets, function (_, fleet) {
        tbody.append(
          $('<tr>').append([
            $('<th>').text(planet.name),
            $('<th>').text(fleet.owner),
            $('<th>').text(fleet.name),
            $('<th>').text(Hyp.races[fleet.raceId]),
            $('<td class="number">').text(format(fleet.numStarbases)),
            $('<td class="number">').text(format(fleet.numCruisers)),
            $('<td class="number">').text(format(fleet.numDestroyers)),
            $('<td class="number">').text(format(fleet.numBombers)),
            $('<td class="number">').text(format(fleet.numScouts)),
            $('<td class="number">').text(format(fleet.numCarriedArmies)),
            $('<td class="number">').text(format(fleet.numGroundArmies)),
          ])
        )
      })
    })

    var table = tbody.parent().dataTable({
      bPaginate: false,
      bSortCellsTop: true,
      fnFooterCallback: function (tr, data, start, end, order) {
        var i,
          total = {},
          row
        for (i = 4; i < 11; i++) {
          total[i] = 0
        }

        for (i = start; i < end; i++) {
          var row = data[order[i]]
          $.each(total, function (i, _) {
            total[i] += numeral().unformat(row[i])
          })
        }

        var tds = $(tr).children('td')
        $.each(total, function (i, value) {
          tds.eq(i - 4).text(format(value))
        })
      },
    })

    var inputs = table.find('.filter-row input').on('input', function () {
      var input = $(this)
      var value = input.val()
      if (input.attr('type') == 'number') {
        value = format(value)
      }
      table.fnFilter(value, inputs.index(input))
    })
  })
})
