$('td > input[name="merge"]:not(:disabled)').after([
  ' ',
  $(
    '<input type="submit" class="button" name="merge" value="Merge All">'
  ).click(function (event) {
    $(this)
      .closest('form')
      .append([
        $('<input type="hidden" name="confirm">'),
        $('<input type="hidden" name="mgt_order_done">'),
      ])
  }),
])

$('td > input[name="loadarmies"]:not(:disabled)').after([
  ' ',
  $(
    '<input type="submit" class="button" name="randomLoadAll" value="Load All">'
  ),
])

Hyp.getControlledPlanets().done(function (planets) {
  $('.managePanel').show()
  $('.pane div').show()
  $('.buildButtons').eq(1).hide()
  $('.info').trigger('click')

  var cash = parseFloat($('#cashTab').text().replace(/,/g, '')) || 0,
    factoryUnitId = Hyp.units.indexOf('Factories')

  $('[name="build"]')
    .after($('<p class="totals">'))
    .click(function () {
      var form = $(this).closest('form')
      form.find('[name="buildunits"]').val(form.data('numUnits') || 0)
    })

  $('[name="buildunits"]')
    .attr({
      type: 'number',
      min: 0,
    })
    .css('width', '7em')
    .keydown(function (event) {
      if (event.which == 13) {
        event.preventDefault()
        $(this).siblings('[name="build"]').click()
      }
    })
    .after([
      ' ',
      $('<select name="xtype">').append([
        '<option value="numUnits">Units</option>',
        '<option value="spaceAvgP">Space AvgP</option>',
        '<option value="buildCosts">Build Costs</option>',
        '<option value="upkeepCosts">Upkeep Costs</option>',
        '<option value="numHours">Hours</option>',
      ]),
    ])
    .add('[name="unittype"], [name="xtype"]')
    .on('input change keyup', function () {
      var element = $(this),
        form = element.closest('.section').find('form')

      var planetId = parseInt(form.find('[name="planetid"]').val()) || 0,
        planet = planets[planetId],
        unitId = parseInt(form.find('[name="unittype"]').val()) || 0,
        numUnits = parseFloat(form.find('[name="buildunits"]').val()) || 0,
        xtype = form.find('[name="xtype"]').val()

      var ttbMultiplier = Hyp.getTimeToBuildMultiplier(planet),
        buildCostSpan

      planet.numFactories = parseFloat(
        element.closest('tbody').children('tr').eq(1).find('b').eq(0).text()
      )

      switch (xtype) {
        case 'numHours':
          if (unitId == factoryUnitId) {
            numUnits =
              planet.numFactories *
                Math.pow(
                  1 +
                    1 / Hyp.timeToBuild[unitId][planet.raceId] / ttbMultiplier,
                  numUnits
                ) -
              planet.numFactories
          } else {
            numUnits *=
              planet.numFactories /
              Hyp.timeToBuild[unitId][planet.raceId] /
              ttbMultiplier
          }
          break
        case 'spaceAvgP':
        case 'upkeepCosts':
          numUnits /= Hyp[xtype][unitId][planet.race]
          break
        case 'buildCosts':
          numUnits /= Hyp[xtype][unitId][planet.prod]
          break
      }
      // console.log( Hyp.timeToBuild[unitId][planet.race], ttbMultiplier );
      numUnits = Math.floor(numUnits) || 0
      form.data('numUnits', numUnits)

      var totals = Hyp.getBuildPipeTotals(
        [
          {
            count: numUnits,
            unitId: unitId,
          },
        ],
        planet
      )

      form
        .find('.totals')
        .empty()
        .append([
          '<strong>Units:</strong> ',
          numeral(numUnits).format('0,0'),
          ' - <strong>AvgP:</strong> ',
          numeral(totals.spaceAvgP).format('0[.]0a'),
          ' - <strong>Costs:</strong> ',
          (buildCostSpan = $('<span>').text(
            numeral(totals.buildCosts).format('0[.]0a')
          )),
          ' - <strong>Upkeep:</strong> ',
          numeral(totals.upkeepCosts).format('0[.]0a'),
          ' - <strong>TTB:</strong> ',
          moment.duration(Math.ceil(totals.timeToBuild) * 3600000).format(),
        ])
    })

  // Hyp.getFleetsUpkeep().done(function (upkeep) {
  //   $('#htopmenu2').append(
  //     $('<li>').append(
  //       $('<a href="Cash" class="megaTextItem">').append([
  //         'Deployed fleets: ',
  //         numeral(upkeep.numDeployed).format('0,0'),
  //         '/',
  //         numeral(5 * planets.numPlanets).format('0,0'),
  //       ])
  //     )
  //   )
  // })
})

$('.movingFleetGroupTitle ~ tr img[src$="fleetarmy_icon.gif"]').each(function (
  _,
  element
) {
  var numCarriedArmies = parseFloat(
      element.previousSibling.nodeValue.replace(/[^\d]+/g, '')
    ),
    raceName = element.parentNode.firstChild
      .getAttribute('src')
      .replace(/^.*?([a-z]+)\.gif$/i, '$1'),
    raceId = Hyp.races.indexOf(raceName),
    avgP = Hyp.groundAvgP[raceId] * numCarriedArmies

  var td = $(element)
    .closest('tr')
    .prevAll('.movingFleetGroupTitle')
    .first()
    .find('b:last')
    .parent()

  var prevAvgP = td.data('groundAvgP') || 0
  if (prevAvgP == 0) {
    td.append(' - GAvgP: <b></b>')
  }
  avgP += prevAvgP
  td.data('groundAvgP', avgP)

  td.find('b').last().text(numeral(avgP).format('0[.]0a'))
})

$('[name="destplanetname"], [name="toplanet"], [name="destname"]').autocomplete(
  {
    autoFocus: true,
    source: function (request, sendResponse) {
      Hyp.searchPlanets(request.term)
        .done(function (planets) {
          var names = []
          $.each(planets, function (_, planet) {
            names.push(planet.name)
          })
          sendResponse(names)
        })
        .fail(function () {
          sendResponse([])
        })
    },
  }
)

// if ($('.megaCurrentItem[href="/servlet/Fleets?pagetype=factories"]').length == 0) {

//     Hyp.getMovingFleets().done(function(fleets) {
//         var moveTick;

//         $.each(Hyp.ticks, function(_, tick) {
//             if (tick.name == 'Move/Control') {
//                 moveTick = tick;
//             }
//         });

//         var nextMoveTickDate = moveTick.getNextDate(new Date);

//         $('.factoryCard').each(function(_, element) {
//             element = $(element);
//             var planet = {
//                     name: element.find('.planet').text()
//                 },
//                 total = {
//                     spaceAvgP: 0,
//                     groundAvgP: 0
//                 },
//                 table, numFleets;

//             if (fleets.toNames[planet.name]) {
//                 numFleets = fleets.toNames[planet.name].length;

//                 table = $('<table class="stdArray" style="width: 95%;margin:20px auto 10px auto;border:0;color:#AAAAAA">').append([
//                     $('<thead>').append(
//                         $('<tr class="stdArray">').append([
//                             '<th class="hr">ETA</th>',
//                             '<th class="hc">ETA</th>',
//                             '<th class="hr">Space AvgP</th>',
//                             '<th class="hr">Ground AvgP</th>',
//                             '<th class="hc">Drop</th>',
//                             '<th class="hc">Change</th>',
//                             $('<th class="hr">').append(
//                                 $('<input type="checkbox">').change(function() {
//                                     var element = $(this);
//                                     element.closest('table').
//                                     find('tr:not(.stdArray) input').
//                                     prop('checked', element.is(':checked'));
//                                 })
//                             )
//                         ])
//                     )
//                 ]);

//                 $.each(fleets.toNames[planet.name], function(i, fleet) {

//                     Hyp.updateFleetAvgP(fleet);
//                     total.spaceAvgP += fleet.spaceAvgP;
//                     total.groundAvgP += fleet.groundAvgP;
//                     table.append(
//                         $('<tr>').addClass('line' + ((i + 1) % 2)).append([
//                             $('<td class="hr">').text(fleet.eta + 'h'),
//                             $('<td class="hc">').text(
//                                 moment(nextMoveTickDate).add(fleet.eta - 1, 'h').utc().format('YYYY-MM-DD HH:mm')
//                             ),
//                             $('<td class="hr">').text(numeral(fleet.spaceAvgP).format('0[.]0a')),
//                             $('<td class="hr">').text(numeral(fleet.groundAvgP).format('0[.]0a')),
//                             $('<td class="hc">').text(fleet.autodrop ? 'auto drop' : 'on order'),
//                             $('<td class="hc">').append(
//                                 $('<a>Change</a>').attr('href',
//                                     Hyp.getServletUrl('Fleets?changefleet=&floatid=' + fleet.id)
//                                 )
//                             ),
//                             $('<td class="hr">').append(
//                                 $('<input type="checkbox">').attr('name', 'reroute' + i).val(fleet.id)
//                             )
//                         ]).mouseover(function() {
//                             $(this).addClass('lineCenteredOn');
//                         }).mouseout(function() {
//                             $(this).removeClass('lineCenteredOn');
//                         })
//                     );
//                 });

//                 if (numFleets > 1) {
//                     table.append(
//                         $('<tr class="stdArray">').append([
//                             '<td class="hr" colspan="2">Total</td>',
//                             $('<td class="hr">').text(numeral(total.spaceAvgP).format('0[.]0a')),
//                             $('<td class="hr">').text(numeral(total.groundAvgP).format('0[.]0a')),
//                             $('<td colspan="3">')
//                         ])
//                     );
//                 }

//                 table.append(
//                     '<tr><td class="hr" colspan="7">' +
//                     '<input type="submit" class="button" name="reroute" value="Reroute"> ' +
//                     '<input type="submit" class="button" name="delayfleets" value="Delay"> ' +
//                     'selected fleets</td></tr>'
//                 );

//                 element.find('.visib_content').append(
//                     $('<form action="Fleets" method="post">').append(
//                         table,
//                         $('<input type="hidden" name="nbfleets">').val(numFleets)
//                     )
//                 );
//             }

//         });
//     });
// }

var fleetInfoData
if (
  $('.megaCurrentItem[href="/servlet/Fleets?pagetype=local_fleets"]').length ==
  1
) {
  fleetInfoData = 'own_planets'
} else if (
  $('.megaCurrentItem[href="/servlet/Fleets?pagetype=foreign_fleets"]')
    .length == 1
) {
  fleetInfoData = 'foreign_planets'
}

if (fleetInfoData) {
  Hyp.getFleetsInfo({
    data: fleetInfoData,
  }).done(function (planets) {
    $('.planetCard3').each(function (_, element) {
      element = $(element)

      var planetName = element.text(),
        raceStats = []

      if (planets.toNames[planetName]) {
        $.each(planets.toNames[planetName].fleets, function (_, fleet) {
          if (fleet.isForeign) {
            return
          }

          if (!raceStats[fleet.raceId]) {
            raceStats[fleet.raceId] = {
              numCarriedArmies: 0,
              numGroundArmies: 0,
              numArmyCapacity: 0,
            }
          }

          raceStats[fleet.raceId].numCarriedArmies +=
            fleet.numCarriedArmies || 0
          raceStats[fleet.raceId].numGroundArmies += fleet.numGroundArmies || 0
          raceStats[fleet.raceId].numArmyCapacity +=
            (fleet.numDestroyers || 0) * Hyp.armyCapacity[1] +
            (fleet.numCruisers || 0) * Hyp.armyCapacity[2] +
            (fleet.numScouts || 0) * Hyp.armyCapacity[3] +
            (fleet.numBombers || 0) * Hyp.armyCapacity[4] +
            (fleet.numStarbases || 0) * Hyp.armyCapacity[5]
        })

        element
          .closest('table')
          .closest('td')
          .find('.bars')
          .wrapAll('<td class="vt">')
          .parent()
          .wrap('<tr>')
          .parent()
          .append(
            $('<td class="vt">').append(
              $('<table style="float:right">').append([
                $('<thead>').append(
                  $('<tr class="stdArray">').append(function () {
                    var cells = ['<td>Armies</td>']
                    $.each(Hyp.races, function (_, raceName) {
                      cells.push($('<th>').text(raceName))
                    })
                    return cells
                  })
                ),
                $('<tbody>').append(function () {
                  var rows = [],
                    i = 0
                  $.each(
                    {
                      numArmyCapacity: 'Capacity',
                      numCarriedArmies: 'Carried',
                      numGroundArmies: 'Ground',
                    },
                    function (statKey, statName) {
                      rows.push(
                        $('<tr>')
                          .addClass('line' + (++i % 2))
                          .append(function () {
                            var cells = [$('<th class="hl">').text(statName)]
                            $.each(Hyp.races, function (raceId, _) {
                              if (
                                raceStats[raceId] &&
                                raceStats[raceId][statKey]
                              ) {
                                cells.push(
                                  $('<td class="hr">').text(
                                    numeral(raceStats[raceId][statKey]).format(
                                      '0[.]0a'
                                    )
                                  )
                                )
                              } else {
                                cells.push('<td class="hr">-</td>')
                              }
                            })
                            return cells
                          })
                      )
                    }
                  )
                  return rows
                }),
              ])
            )
          )
          .wrap('<table style="width:100%">')
      }
    })
  })
}

var camoTimestamp = Cookies.get('timestampCamo')

var displayCamo = function (camoData) {
  $.each(camoData, function (_, row) {
    var $input = $('input[value="' + row.fleet_id + '"]')
    var camoTxt = "<br/><div class='camo'>Camouflage mode : "
    if (row.camo == 'on') {
      camoTxt += "<span class='camo camo-on'>On</span></div>"
    } else {
      camoTxt += "<span class='camo camo-off'>Off</span></div>"
    }
    $input.parent().prev().append(camoTxt)
  })
}

// if ($('.megaCurrentItem[href="/servlet/Fleets?pagetype=moving_fleets"]').length == 1) {

//     Hyp.getMovingFleetsFromHtml(document).done(function(fleets) {
//         var camoData = [];

//         function formatPosition(position) {
//             return '(' + position.x + ',' + position.y + ')';
//         }

//         function toggleAll() {
//             var $this = $(this);
//             $this
//                 .closest('tr')
//                 .nextUntil('.movingFleetGroupTitle')
//                 .find('input[type=checkbox]')
//                 .prop({
//                     checked: $this.prop('checked')
//                 });
//         }

//         var $sortByEta = $('.banner [name=sortOrGroup').eq(0);
//         var groupByEta = $sortByEta.length === 0 || $sortByEta.prop('disabled');
//         var previousEta = null;

//         chrome.storage.sync.get('camo', function(store) {

//             if (camoTimestamp == undefined || (((new Date).getTime() - camoTimestamp) > 320000)) {

//                 $.each(fleets, function(_, fleet) {

//                     Hyp.getChangeFleet(fleet.id).done(function(camo) {
//                         var $input = $('input[value="' + fleet.id + '"]');
//                         var camoTxt = "<br/><div class='camo'>Camouflage mode : ";
//                         if (camo == "on") {
//                             camoTxt += "<span class='camo camo-on'>On</span></div>";
//                         } else {
//                             camoTxt += "<span class='camo camo-off'>Off</span></div>";
//                         }
//                         camoData.push({
//                             fleet_id: fleet.id,
//                             camo: camo
//                         });

//                         $input.parent().prev().append(
//                             camoTxt
//                         );
//                     });

//                     if (_ == (fleets.length - 1)) {
//                         displayCamo(camoData);
//                     }
//                 });

//             } else {
//                 displayCamo(camoData);
//             }

//         });

//         $.each(fleets, function(_, fleet) {

//             //console.log(fleet);

//             var distance = {
//                     x: fleet.to.x - fleet.from.x,
//                     y: fleet.to.y - fleet.from.y
//                 },
//                 eta = Math.max(Math.abs(distance.x), Math.abs(distance.y)) + 2,
//                 progress = 1 - (fleet.eta - fleet.delay) / eta;

//             position = {
//                 x: Math.round(fleet.from.x + progress * distance.x),
//                 y: Math.round(fleet.from.y + progress * distance.y)
//             };
//            // console.log(distance.x && distance.y);
//            // if (distance.x != '' && distance.y != '') {

//                 var $input = $('input[value="' + fleet.id + '"]');

//                 $input.parent().prev().append(
//                     '<br>From ', formatPosition(fleet.from),
//                     ' to ', formatPosition(fleet.to),
//                     ' @ ', formatPosition(position),
//                     ' (', numeral(progress).format('0[.]0%'), ')'
//                 );
//             //}

//             previousEta = fleet.eta;

//         });

//     });
// }

if (currentPlanetName) {
  var currentPlanetName = $('.planetNameHuge').text()
  var menuItem = $('#htopmenu2').find('.megaTextItem')[1]
  var planetId = menuItem.href.replace(
    Hyp.url('/servlet/Planetfloats?planetid='),
    ''
  )

  var parent = $('.planetNameHuge').parent()
  var title = parent.text()

  var sc = parseInt(
    title.substring(title.match('SC').index + 2, title.match('SC').index + 4)
  )

  var $form =
    '<div><form action="/servlet/Maps" method="post">' +
    '<input name="distance" value="1" type="hidden" />' +
    '<input name="planet" value="' +
    planetId +
    '" type="hidden" />' +
    '<input name="clusterid" value="' +
    sc.trim() +
    '" type="hidden" />' +
    '<input name="reqx" value="" type="hidden" />' +
    '<input name="reqy" value="" type="hidden" />' +
    '<input name="go" value="ok" type="hidden" />' +
    '<input name="searchplanets" value="" type="hidden" />' +
    '<input name="maptype" value="planets_trade" type="hidden" />' +
    '<input name="submit" class="button" value="D2" type="submit" />' +
    '</form></div>'
  var coords = title.substring(
    title.match('SC').index + 3,
    title.match('SC').index + 10
  )
  coords = coords.split(',')
  var x = coords[0].replace('(', '')
  var y = coords[1].replace(')', '')

/* Adding a link to the D2 map to the table. */
  $('.dataarea')
    .eq(0)
    .parent()
    .parent()
    .append(
      `<td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${x}&reqy=${y}&c=1&d=2" target="_blank">D2</a></td>`
    )

  if ($('[name="unittype"]').length == 1) {
    fleetInfoData = 'own_planets'
  } else {
    fleetInfoData = 'foreign_planets'
  }
  Hyp.getFleetsInfo({
    data: fleetInfoData,
  }).done(function (planets) {
    var total = {
      0: {
        defend: {
          space: 0,
          ground: 0,
        },
        attack: {
          space: 0,
          ground: 0,
        },
      },
      1: {
        defend: {
          space: 0,
          ground: 0,
        },
        attack: {
          space: 0,
          ground: 0,
        },
      },
      2: {
        defend: {
          space: 0,
          ground: 0,
        },
        attack: {
          space: 0,
          ground: 0,
        },
      },
      3: {
        defend: {
          space: 0,
          ground: 0,
        },
        attack: {
          space: 0,
          ground: 0,
        },
      },
      4: {
        defend: {
          space: 0,
          ground: 0,
        },
        attack: {
          space: 0,
          ground: 0,
        },
      },
    }
    $.each(planets.toNames[currentPlanetName].fleets, function (_, fleet) {
      var stats = total[fleet.delay][fleet.defend ? 'defend' : 'attack']
      Hyp.updateFleetAvgP(fleet)
      stats.space += fleet.spaceAvgP
      stats.ground += fleet.groundAvgP
    })

    var table = $('<table><col></table>')
    $.each(total, function (na, _) {
      table.append('<col style="width:70px"/>')
    })

    var tr = $('<tr><th>N/A</th></tr>')
    $.each(total, function (na, _) {
      tr.append($('<td class="hr">').text(na))
    })
    table.append($('<thead>').append(tr))

    var i = 0
    $.each(
      {
        space: 'Space',
        ground: 'Ground',
      },
      function (type, typeLabel) {
        $.each(
          {
            defend: 'Defending',
            attack: 'Attacking',
          },
          function (mode, modeLabel) {
            var tr = $('<tr>')
              .addClass('line' + (++i % 2))
              .append($('<th>').text(modeLabel + ' ' + typeLabel + ' AvgP'))
            $.each(total, function (_, stats) {
              tr.append(
                $('<td class="hr">').text(
                  stats[mode][type]
                    ? numeral(stats[mode][type]).format('0[.]0a')
                    : '-'
                )
              )
            })
            table.append(tr)
          }
        )
      }
    )

    $('.civ').parent().closest('table').after(table)
  })
}

if ($('#OwnPlGroups, #Groups').length == 1) {
  $('.planetCard3').each(function () {
    var planetName = $(this).find('.planet').text()
    var planetID = $(this).attr('id').replace('pc', '')
    var parent = $(this).find('.planet').parent()
    var title = parent.text()
    var sc = parseInt(
      title.substring(title.match('SC').index + 2, title.match('SC').index + 4)
    )
    var coords = title.substring(
      title.match('SC').index + 3,
      title.match('SC').index + 10
    )
    coords = coords.split(',')
    var x = coords[0].replace('(', '')
    var y = coords[1].replace(')', '')

    var $form =
      '<form action="/servlet/Maps" method="post">' +
      '<input name="distance" value="2" type="hidden" />' +
      '<input name="planet" value="' +
      planetID +
      '" type="hidden" />' +
      '<input name="clusterid" value="' +
      sc +
      '" type="hidden" size=2 />' +
      '<input name="reqx" value="' +
      x +
      '" type="hidden" />' +
      '<input name="reqy" value="' +
      y +
      '" type="hidden" />' +
      '<input name="go" value="ok" type="hidden" />' +
      '<input name="searchplanets" value="" type="hidden" />' +
      '<input name="maptype" value="planets_trade" type="hidden" />' +
      '<input name="submit" class="button" value="D2" type="submit" />' +
      '</form>'

    $(this)
      .find('.planet')
      .parent()
      .parent()
      .find('.militFlags tr')
      .append(
        `<td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${x}&reqy=${y}&c=1&d=2" target="_blank">D2</a></td>`
      )
    $(this)
      .find('.planet')
      .parent()
      .parent()
      .find('.militFlags tr')
      .append([
        $(
          '<td><button class="addToGroup" title="Use Define/Extend to confirm &amp; save">Add</button></td>'
        ).click(function () {
          $('#OwnPlGroups, #Groups').show()
          var $listInput = $('input[name="listplanets"]')
          var list = $.trim($listInput.val())
          if (list.length) {
            list += ','
          }

          $listInput.val(list + planetName)
          $(this).hide()
        }),
      ])
  })
}
