var tmpGrowthStr = ''
var tmpGrowthText = ''
var tmpGrowth = 0

var avgPop = function(tabidx, tab) {
  'use strict'

  var populationSum = 0,
    populationMax = 0,
    populationMin = 9999999,
    populationGrowth = 0,
    tmpGrowthStr = 0,
    planets = 0,
    tmpPlanetPop = 0,
    race = {
      human: {
        sum: 0,
        max: 0,
        min: 9999999,
        avg: 0,
        growth: 0,
        planets: 0
      },
      azterk: {
        sum: 0,
        max: 0,
        min: 9999999,
        avg: 0,
        growth: 0,
        planets: 0
      },
      xillor: {
        sum: 0,
        max: 0,
        min: 9999999,
        avg: 0,
        growth: 0,
        planets: 0
      }
    },
    growSum = 0

  $(tab)
    .find('img[src$="/themes/theme4/misc/pop_icon_Human.gif"]')
    .parent('div')
    .parent('div')
    .find('span:eq(0) span:eq(1)')
    .each(function(idx, elt) {
      tmpPlanetPop = parseInt($(elt).text())
      populationSum += tmpPlanetPop
      planets++
      race.human.planets++
      race.human.sum += tmpPlanetPop
      if (tmpPlanetPop > race.human.max) {
        race.human.max = tmpPlanetPop
      }
      if (tmpPlanetPop < race.human.min) {
        race.human.min = tmpPlanetPop
      }
      if (tmpPlanetPop > populationMax) {
        populationMax = tmpPlanetPop
      }
      if (tmpPlanetPop < populationMin) {
        populationMin = tmpPlanetPop
      }
    })
  $(tab)
    .find('img[src$="/themes/theme4/misc/pop_icon_Azterk.gif"]')
    .parent('div')
    .parent('div')
    .find('span:eq(0) span:eq(1)')
    .each(function(idx, elt) {
      tmpPlanetPop = parseInt($(elt).text())
      populationSum += tmpPlanetPop
      planets++
      race.azterk.planets++
      race.azterk.sum += tmpPlanetPop
      if (tmpPlanetPop > race.azterk.max) {
        race.azterk.max = tmpPlanetPop
      }
      if (tmpPlanetPop < race.azterk.min) {
        race.azterk.min = tmpPlanetPop
      }
      if (tmpPlanetPop > populationMax) {
        populationMax = tmpPlanetPop
      }
      if (tmpPlanetPop < populationMin) {
        populationMin = tmpPlanetPop
      }
    })
  $(tab)
    .find('img[src$="/themes/theme4/misc/pop_icon_Xillor.gif"]')
    .parent('div')
    .parent('div')
    .find('span:eq(0) span:eq(1)')
    .each(function(idx, elt) {
      tmpPlanetPop = parseInt($(elt).text())
      populationSum += tmpPlanetPop
      planets++
      race.xillor.planets++
      race.xillor.sum += tmpPlanetPop
      if (tmpPlanetPop > race.xillor.max) {
        race.xillor.max = tmpPlanetPop
      }
      if (tmpPlanetPop < race.xillor.min) {
        race.xillor.min = tmpPlanetPop
      }
      if (tmpPlanetPop > populationMax) {
        populationMax = tmpPlanetPop
      }
      if (tmpPlanetPop < populationMin) {
        populationMin = tmpPlanetPop
      }
    })

  $(tab)
    .find('img[src$="/themes/theme4/misc/pop_icon_Human.gif"]')
    .each(function(idx, elt) {
      tmpGrowthStr = $(elt).attr('onmouseover')
      tmpGrowth = parseInt(
        tmpGrowthStr.substring(
          tmpGrowthStr.indexOf(':') + 2,
          tmpGrowthStr.indexOf('/ day') - 1
        )
      )
      populationGrowth += tmpGrowth
      race.human.growth += tmpGrowth
      tmpGrowthText = tmpGrowthStr.substring(
        tmpGrowthStr.indexOf("'") + 1,
        tmpGrowthStr.lastIndexOf("'") - 3
      )
      $(elt)
        .parent('div')
        .parent()
        .find('div:last-child')
        .append('<BR>' + tmpGrowthText)
    })

  $(tab)
    .find('img[src$="/themes/theme4/misc/pop_icon_Azterk.gif"]')
    .each(function(idx, elt) {
      tmpGrowthStr = $(elt).attr('onmouseover')
      tmpGrowth = parseInt(
        tmpGrowthStr.substring(
          tmpGrowthStr.indexOf(':') + 2,
          tmpGrowthStr.indexOf('/ day') - 1
        )
      )
      populationGrowth += tmpGrowth
      race.azterk.growth += tmpGrowth
      tmpGrowthText = tmpGrowthStr.substring(
        tmpGrowthStr.indexOf("'") + 1,
        tmpGrowthStr.lastIndexOf("'") - 3
      )
      $(elt)
        .parent('div')
        .parent()
        .find('div:last-child')
        .append('<BR>' + tmpGrowthText)
    })
  $(tab)
    .find('img[src$="/themes/theme4/misc/pop_icon_Xillor.gif"]')
    .each(function(idx, elt) {
      tmpGrowthStr = $(elt).attr('onmouseover')
      tmpGrowth = parseInt(
        tmpGrowthStr.substring(
          tmpGrowthStr.indexOf(':') + 2,
          tmpGrowthStr.indexOf('/ day') - 1
        )
      )
      populationGrowth += tmpGrowth
      race.xillor.growth += tmpGrowth
      tmpGrowthText = tmpGrowthStr.substring(
        tmpGrowthStr.indexOf("'") + 1,
        tmpGrowthStr.lastIndexOf("'") - 3
      )
      $(elt)
        .parent('div')
        .parent()
        .find('div:last-child')
        .append('<BR>' + tmpGrowthText)
    })

  if (race.human.sum > 0) {
    race.human.avg = Math.round(race.human.sum / race.human.planets)
  }

  if (race.azterk.sum > 0) {
    race.azterk.avg = Math.round(race.azterk.sum / race.azterk.planets)
  }

  if (race.xillor.sum > 0) {
    race.xillor.avg = Math.round(race.xillor.sum / race.xillor.planets)
  }

  if (race.human.sum === 0) {
    race.human.sum = ' .'
  }
  if (race.azterk.sum === 0) {
    race.azterk.sum = ' .'
  }
  if (race.xillor.sum === 0) {
    race.xillor.sum = ' .'
  }
  if (race.human.max === 0) {
    race.human.max = ' .'
  }
  if (race.azterk.max === 0) {
    race.azterk.max = ' .'
  }
  if (race.xillor.max === 0) {
    race.xillor.max = ' .'
  }
  if (race.human.avg === 0) {
    race.human.avg = ' .'
  }
  if (race.azterk.avg === 0) {
    race.azterk.avg = ' .'
  }
  if (race.xillor.avg === 0) {
    race.xillor.avg = ' .'
  }
  if (race.human.min === 9999999) {
    race.human.min = ' .'
  }
  if (race.azterk.min === 9999999) {
    race.azterk.min = ' .'
  }
  if (race.xillor.min === 9999999) {
    race.xillor.min = ' .'
  }
  if (race.human.growth === 0) {
    race.human.growth = ' .'
  }
  if (race.azterk.growth === 0) {
    race.azterk.growth = ' .'
  }
  if (race.xillor.growth === 0) {
    race.xillor.growth = ' .'
  }

  $(tab).append(
    '<div class="banner" ' +
      'style="text-align: left; width: 790px;     padding: 10px 20px;" ' +
      '>' +
      '<table border="0" width="100%">' +
      '<tr><th></th>' +
      '<th class="th_right">Total</th>' +
      '<th class="th_right">Human</th>' +
      '<th class="th_right">Azterk</th>' +
      '<th class="th_right">Xillor</th>' +
      '</tr>' +
      '<tr><td>Planet #</td>' +
      '<td class="td_right"><strong>' +
      planets +
      '</strong></td>' +
      '<td class="td_right">' +
      race.human.planets +
      '</td>' +
      '<td class="td_right">' +
      race.azterk.planets +
      '</td>' +
      '<td class="td_right">' +
      race.xillor.planets +
      '</td></tr>' +
      '<tr><td>Population Sum</td>' +
      '<td class="td_right"><strong>' +
      populationSum +
      '</strong></td>' +
      '<td class="td_right">' +
      race.human.sum +
      '</td>' +
      '<td class="td_right">' +
      race.azterk.sum +
      '</td>' +
      '<td class="td_right">' +
      race.xillor.sum +
      '</td></tr>' +
      '<tr><td>Population Max</td>' +
      '<td class="td_right"><strong>' +
      populationMax +
      '</strong></td>' +
      '<td class="td_right">' +
      race.human.max +
      '</td>' +
      '<td class="td_right">' +
      race.azterk.max +
      '</td>' +
      '<td class="td_right">' +
      race.xillor.max +
      '</td></tr>' +
      '<tr><td>Population Avg</td>' +
      '<td class="td_right"><strong>' +
      Math.round(populationSum / planets) +
      '</strong></td>' +
      '<td class="td_right">' +
      race.human.avg +
      '</td>' +
      '<td class="td_right">' +
      race.azterk.avg +
      '</td>' +
      '<td class="td_right">' +
      race.xillor.avg +
      '</td></tr>' +
      '<tr><td>Population Min</td>' +
      '<td class="td_right"><strong>' +
      populationMin +
      '</strong></td>' +
      '<td class="td_right">' +
      race.human.min +
      '</td>' +
      '<td class="td_right">' +
      race.azterk.min +
      '</td>' +
      '<td class="td_right">' +
      race.xillor.min +
      '</td></tr>' +
      '<tr><td>Population Growth</td>' +
      '<td class="td_right"><strong class="td_right">' +
      populationGrowth +
      '</strong></td>' +
      '<td class="td_right">' +
      race.human.growth +
      '</td>' +
      '<td class="td_right">' +
      race.azterk.growth +
      '</td>' +
      '<td class="td_right">' +
      race.xillor.growth +
      '</td></tr>' +
      '<tr><td>Population Growth avg</td>' +
      '<td class="td_right"><strong class="td_right">' +
      (parseInt(populationGrowth) / planets).toFixed(2) +
      '</strong></td>' +
      '<td class="td_right">' +
      (parseInt(race.human.growth) / planets).toFixed(2) +
      '</td>' +
      '<td class="td_right">' +
      (parseInt(race.azterk.growth) / planets).toFixed(2) +
      '</td>' +
      '<td class="td_right">' +
      (parseInt(race.xillor.growth) / planets).toFixed(2) +
      '</td></tr>' +
      '</table></div><br />'
  )
}

if ($('.tabbertab').length) {
  $('.tabbertab').each(function(i, el) {
    avgPop(i, el)
  })
} else {
  avgPop(0, $('body'))
}
