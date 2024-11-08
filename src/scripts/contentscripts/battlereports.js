$('.br_own')
  .closest('table')
  .each(function(_, table) {
    table = $(table)
    var spaceAvgP = {},
      groundAvgP = {},
      avgRaceId = Hyp.races.length + 1
    var lastTr = table
      .find('tr.line0, tr.line1')
      .each(function(_, tr) {
        tr = $(tr)
        var tds = tr.find('td'),
          unitName = $.trim(tds.eq(0).text()),
          unitId = Hyp.units.indexOf(unitName),
          numbers = {
            own: {
              initial:
                numeral().unformat(
                  tds
                    .eq(1)
                    .text()
                    .toLowerCase()
                ) || 0,
              lost:
                numeral().unformat(
                  tds
                    .eq(2)
                    .text()
                    .toLowerCase()
                ) || 0
            },
            defending: {
              initial:
                numeral().unformat(
                  tds
                    .eq(3)
                    .text()
                    .toLowerCase()
                ) || 0,
              lost:
                numeral().unformat(
                  tds
                    .eq(4)
                    .text()
                    .toLowerCase()
                ) || 0
            },
            attacking: {
              initial:
                numeral().unformat(
                  tds
                    .eq(5)
                    .text()
                    .toLowerCase()
                ) || 0,
              lost:
                numeral().unformat(
                  tds
                    .eq(6)
                    .text()
                    .toLowerCase()
                ) || 0
            }
          }
        $.each(numbers, function(side, numbers) {
          if (!spaceAvgP[side]) {
            spaceAvgP[side] = { initial: 0, lost: 0 }
          }
          if (!groundAvgP[side]) {
            groundAvgP[side] = { initial: 0, lost: 0 }
          }
          if (Hyp.spaceAvgP[unitId][avgRaceId] == 0) {
            groundAvgP[side].initial +=
              numbers.initial * Hyp.groundAvgP[avgRaceId]
            groundAvgP[side].lost += numbers.lost * Hyp.groundAvgP[avgRaceId]
          } else {
            spaceAvgP[side].initial +=
              numbers.initial * Hyp.spaceAvgP[unitId][avgRaceId]
            spaceAvgP[side].lost +=
              numbers.lost * Hyp.spaceAvgP[unitId][avgRaceId]
          }
        })
      })
      .last()

    var i = lastTr.hasClass('line1') ? 1 : 0
    lastTr.after([
      $('<tr>')
        .addClass('stdArray line' + (++i % 2))
        .append([
          '<td class="tinytext">Space AvgP ~</td>',
          $('<td class="hr tinytext br_colStart">').text(
            numeral(spaceAvgP.own.initial).format('0[.]0a')
          ),
          $('<td class="hr tinytext">').text(
            numeral(spaceAvgP.own.lost).format('0[.]0a')
          ),
          $('<td class="hr tinytext br_colStart">').text(
            numeral(spaceAvgP.defending.initial).format('0[.]0a')
          ),
          $('<td class="hr tinytext">').text(
            numeral(spaceAvgP.defending.lost).format('0[.]0a')
          ),
          $('<td class="hr tinytext br_colStart">').text(
            numeral(spaceAvgP.attacking.initial).format('0[.]0a')
          ),
          $('<td class="hr tinytext br_lastCol">').text(
            numeral(spaceAvgP.attacking.lost).format('0[.]0a')
          )
        ]),
      $('<tr>')
        .addClass('stdArray line' + (++i % 2))
        .append([
          '<td class="tinytext">Ground AvgP ~</td>',
          $('<td class="hr tinytext br_colStart">').text(
            numeral(groundAvgP.own.initial).format('0[.]0a')
          ),
          $('<td class="hr tinytext">').text(
            numeral(groundAvgP.own.lost).format('0[.]0a')
          ),
          $('<td class="hr tinytext br_colStart">').text(
            numeral(groundAvgP.defending.initial).format('0[.]0a')
          ),
          $('<td class="hr tinytext">').text(
            numeral(groundAvgP.defending.lost).format('0[.]0a')
          ),
          $('<td class="hr tinytext br_colStart">').text(
            numeral(groundAvgP.attacking.initial).format('0[.]0a')
          ),
          $('<td class="hr tinytext br_lastCol">').text(
            numeral(groundAvgP.attacking.lost).format('0[.]0a')
          )
        ])
    ])
  })