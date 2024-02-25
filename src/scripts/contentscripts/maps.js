const setMap = async function () {
  const gameId = await localforage.getItem('currentGameId')
  let switches = await localforage.getItem(gameId + '-switches')
  let alliance = JSON.parse(
    localStorage.getItem(gameId + '-hapi-alliance-owned-planets')
  )
  let foreign = JSON.parse(
    localStorage.getItem(gameId + '-hapi-alliance-foreign-planets')
  )

  console.log(foreign)
  const list = []

  if ($('.ecomap').length > 0) {
    $('.ecomap')
      .find('img')
      .each((i, el) => {
        $(el).attr(
          'src',
          $(el).attr('src') + '?v=' + Math.floor(Math.random() * 1000000)
        )
      })
  }

  let allSwitchesHyp = []
  if (switches) {
    switches.data.forEach((row) => {
      if (row.old.gov === 'Hyp.' && row.new.gov === 'Demo.') {
        allSwitchesHyp.push({
          id: row.new.id,
        })
      }
    })
  }
  function goodColor(gov) {
    if (gov === 'Demo.') return 'green'
    if (gov === 'Dict.') return 'red'
    if (gov === 'Auth.') return 'brown'
    if (gov === 'Hyp.') return 'grey'
    if (gov === 'Azterk') return 'darkgreen'
    if (gov === 'Human') return 'darkgrey'
    if (gov === 'Xillor') return 'cadetblue'
    if (gov === 'Agro') return 'greenyellow'
    if (gov === 'Minero') return 'indianred'
    if (gov === 'Techno') return 'skyblue'
  }

  var planets = Hyp.getPlanetsFromTradingMap(document)

  console.log(document)

  var systems = [],
    minX,
    maxX,
    minY,
    maxY
  $.each(planets, function (i, planet) {
    if (!systems[planet.x]) {
      systems[planet.x] = []
    }
    if (!systems[planet.x][planet.y]) {
      systems[planet.x][planet.y] = []
    }
    systems[planet.x][planet.y].push(planet)
    minX = isNaN(minX) ? planet.x : Math.min(minX, planet.x)
    maxX = isNaN(maxX) ? planet.x : Math.max(maxX, planet.x)
    minY = isNaN(minY) ? planet.y : Math.min(minY, planet.y)
    maxY = isNaN(maxY) ? planet.y : Math.max(maxY, planet.y)
  })

  var table = $('<table class="tinytext" id="map-table">'),
    x,
    y,
    tr,
    td
  for (y = maxY; y >= minY; y--) {
    tr = $('<tr class="vt">')
    for (x = minX; x <= maxX; x++) {
      td = $(
        '<td class="tacMapZone hc" style="min-width:220px" bgcolor="black">'
      ).html(
        '<b>(' +
          x +
          ',' +
          y +
          ')</b> - <a href="/servlet/Maps?tm=&reqx=' +
          x +
          '&reqy=' +
          y +
          '&d=0">Show on tactical</a>'
      )
      // td = $('<td class="tacMapZone hc" style="min-width:250px">').html('<b>(' + x + ',' + y + ')</b>')
      if (systems[x] && systems[x][y] && systems[x][y].length) {
        td.append(
          (function (planets) {
            var table = $('<table class="array">')
            $.each(planets, function (i, planet) {
              var nameElements = [
                $('<span>').attr({
                  class: 'span-info',
                }),
              ]

              //var find = _.indexOf(store.alliance, planet.name)
              var foreignFind = foreign.find(
                (item) => item.planet === planet.name
              )

              console.log(foreignFind)

              var find = alliance.planets.find(
                (item) => item.planet === planet.name
              )

              var switchHyp = allSwitchesHyp.find(
                (item) => item.id === planet.id
              )

              let foreignInfo = ''
              if (foreignFind) {
                foreignInfo += '<span style="color:darkturquoise">'+foreignFind.player + '</span> - ' + foreignFind.status
                if (foreignFind.spaceAvgp) {
                  foreignInfo += ' - <span style="color:darkorange">' + foreignFind.spaceAvgp + '</span>'
                }
              }

              var ally = find ? 'ally-planet' : ''
              var isForeign = foreignFind ? 'foreign-planet' : ''

              if (ally != '') {
                nameElements[0].html($('<span>').html(planet.name + '&nbsp;'))
              } else if (switchHyp) {
                nameElements[0]
                  .attr('style', 'background-color:blue')
                  .html($('<span>').html(planet.name + ' ** Hyp **'))
              } else {
                nameElements[0].html(planet.name + '&nbsp;')
              }

              if (planet.isBlackholed) {
                nameElements.unshift(
                  '<img src="/themes/theme1/misc/BH.gif" title="Destroyed by blackhole" style="height:1em"> '
                )
              } else if (planet.isDoomed) {
                nameElements.unshift(
                  $(
                    '<img src="/themes/theme1/misc/death1.gif" style="height:1em">'
                  ).attr(
                    'title',
                    'Time before annihilation: ' +
                      planet.daysBeforeAnnihilation +
                      ' day(s)'
                  ),
                  ' '
                )
              }
              var tr
              if (ally != '') {
                tr = $('<tr class="' + ally + '">').attr(
                  'bgcolor',
                  'lightgreen'
                )
              } else if (isForeign != '') {
                let colorForeign =
                  foreignFind.status === 'Def' ? '#00007f' : 'brown'
                colorForeign = foreignFind.neutral
                  ? 'darkslategray'
                  : colorForeign

                tr = $('<tr style="filter: contrast(1.2);" class="' + isForeign + '">').attr(
                  'bgcolor',
                  colorForeign
                )
              } else {
                if (planet.govName == 'Hyp.') {
                  tr = $('<tr class="hyp">')
                } else if (planet.govName == 'Dict.') {
                  tr = $('<tr class="dict">')
                } else {
                  tr = $('<tr class="' + ally + '">')
                }
              }

              const owner =
                find && find.player ? '&nbsp;' + '' + find.player : ''
              let infos = owner

              const infosString = (infos != '') ? infos : foreignInfo

              var td = $('<td>').append([
                $(
                  '<span class="hl" color="olive" style="white-space:nowrap; min-width:80px; display:inline-block">'
                ).append(nameElements),
                $('<span  class="span-info">')
                  .addClass(planet.govName.replace(/\.$/, ''))
                  .css('color', goodColor(planet.govName))
                  .attr({
                    title: planet.govName,
                    color: goodColor(planet.govName),
                  })
                  .html('&nbsp;' + planet.govName.substr(0, 1) + '.&nbsp;'),
                $('<span class="hc span-info">').html(
                  planet.tag == '-'
                    ? '[]&nbsp;'
                    : "<span class='blue'>[" +
                        planet.tag.trim() +
                        ']</span>&nbsp;'
                ),
                $('<span class="hr info span-info">').html(
                  planet.civ + '&nbsp;'
                ),
                $('<font class="span-info">')
                  .addClass(planet.raceName)
                  .attr({
                    title: planet.raceName,
                    color: goodColor(planet.raceName),
                  })
                  .html(planet.raceName.substr(0, 1).toUpperCase() + ''),
                $('<font class="span-info">')
                  .addClass(planet.productName)
                  .attr({
                    title: planet.productName,
                    color: goodColor(planet.productName),
                  })
                  .html(
                    planet.productName.substr(0, 1).toUpperCase() + '&nbsp; - '
                  ),
                $('<span class="hr info span-info">').html(
                  '&nbsp;' +
                    numeral(planet.activity).format('k') +
                    '&nbsp;' + infosString
                ),
              ])
              if (planet.isBlackholed) {
                tr.addClass('alertLight blackholed')
              } else if (planet.isDoomed) {
                tr.addClass('doomed')
              }
              tr.append(td)
              table.append(tr)
            })

            return table
          })(systems[x][y])
        )
      }
      tr.append(td)
    }
    table.append(tr)
  }

  table
    .wrap('<div class="tabbertab" title="Map">')
    .parent()
    .prepend(
      $('<p>').append([
        $('<label>').append([
          $('<input type="checkbox" checked="checked">').change(function () {
            if ($(this).is(':checked')) {
              $('.blackholed').show()
            } else {
              $('.blackholed').hide()
            }
          }),
          ' Show blackholed planets',
        ]),
        ' ',
        $('<label>').append([
          $('<input type="checkbox" checked="checked">').change(function () {
            if ($(this).is(':checked')) {
              $('.doomed').show()
            } else {
              $('.doomed').hide()
            }
          }),
          ' Show doomed planets',
        ]),
      ])
    )

  $('table.stdArray')
    .wrap('<div class="tabbertab" title="Table">')
    .parent()
    .before('<br>')
    .wrap('<div class="tabber">')
    .parent()
    .append([table.parent(), "<button id='btnExport'>Generate xls</button>"])

  $('#btnExport').click(function (e) {
    e.preventDefault()

    // getting data from our table
    var data_type = 'data:application/vnd.ms-excel'
    var table_div = document.getElementById('map-table')
    var table_html = table_div.outerHTML.replace(/ /g, '%20')

    var a = document.createElement('a')
    a.href = data_type + ', ' + table_html
    a.download =
      'exported_table_' + Math.floor(Math.random() * 9999999 + 1000000) + '.xls'
    a.click()
  })

  $('body').append([
    '<link href="/themes/theme1/css/tabber.css" rel="stylesheet" type="text/css"/>',
    '<script type="text/javascript" src="/js/tabber.js"></script>',
  ])
  tabberAutomatic()
}
setMap()
