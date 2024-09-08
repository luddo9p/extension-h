function BattleReport() {
  $('.br_own')
    .closest('table')
    .each(function (_, table) {
      table = $(table)
      var spaceAvgP = {},
        groundAvgP = {},
        avgRaceId = Hyp.races.length + 1
      var lastTr = table
        .find('tr.line0, tr.line1')
        .each(function (_, tr) {
          tr = $(tr)
          var tds = tr.find('td')

          // Assurer qu'il y a au moins 7 colonnes (indices 0 à 6)
          if (tds.length < 7) {
            console.warn('Pas assez de colonnes dans ce tableau:', tds)
            return // Ignorer la ligne si elle ne contient pas assez de colonnes
          }

          var unitName = $.trim(tds.eq(0).text()),
            unitId = Hyp.units.indexOf(unitName)

          // Vérification si l'unité existe
          if (unitId === -1) {
            console.error('Unité non trouvée:', unitName)
            return // On ignore cette ligne si l'unité n'est pas trouvée
          }

          var numbers = {
            own: {
              initial: numeral().unformat(tds.eq(1).text().toLowerCase()) || 0,
              lost: numeral().unformat(tds.eq(2).text().toLowerCase()) || 0,
            },
            defending: {
              initial: numeral().unformat(tds.eq(3).text().toLowerCase()) || 0,
              lost: numeral().unformat(tds.eq(4).text().toLowerCase()) || 0,
            },
            attacking: {
              initial: numeral().unformat(tds.eq(5).text().toLowerCase()) || 0,
              lost: numeral().unformat(tds.eq(6).text().toLowerCase()) || 0,
            },
          }

          $.each(numbers, function (side, values) {
            // Initialiser les objets si non définis
            if (!spaceAvgP[side]) {
              spaceAvgP[side] = { initial: 0, lost: 0 }
            }
            if (!groundAvgP[side]) {
              groundAvgP[side] = { initial: 0, lost: 0 }
            }

            // Vérifier si Hyp.spaceAvgP[unitId] et Hyp.spaceAvgP[unitId][avgRaceId] existent
            if (
              Hyp.spaceAvgP[unitId] &&
              typeof Hyp.spaceAvgP[unitId][avgRaceId] !== 'undefined'
            ) {
              spaceAvgP[side].initial +=
                values.initial * Hyp.spaceAvgP[unitId][avgRaceId]
              spaceAvgP[side].lost +=
                values.lost * Hyp.spaceAvgP[unitId][avgRaceId]
            } else if (Hyp.groundAvgP && Hyp.groundAvgP[avgRaceId]) {
              groundAvgP[side].initial +=
                values.initial * Hyp.groundAvgP[avgRaceId]
              groundAvgP[side].lost += values.lost * Hyp.groundAvgP[avgRaceId]
            } else {
              console.warn(
                `Aucun coefficient trouvé pour unitId: ${unitId}, avgRaceId: ${avgRaceId}`
              )
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
            ),
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
            ),
          ]),
      ])
    })
}

window.setTimeout(BattleReport, 10)
