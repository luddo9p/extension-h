$(document).ready(function () {
  var $d = $(document)
  

  var $megaWrapper = $(`<div class='dashboard-hyp'></div>`)
  $megaWrapper.insertAfter('#htopmenu')

  const displayPlanetInfos = async function () {
    const gameId = await localforage.getItem('currentGameId')
    let planets = await localforage.getItem(gameId + '-currentPlanets')

    const cachedData = localStorage.getItem(gameId + '-hapiDataCache')
    if (!cachedData) {
      // window.location.href = 'https://hyperiums.com/servlet/Fleets?pagetype=moving_fleets&goback=true';
      throw new Error('Aucune donnée en cache.');
    }
    const moves = JSON.parse(cachedData).data

    planets.data.forEach((el) => {
      if (el.tag.length > 0 && el.tag != undefined && el.tag != '') {
        window.TAG = 'SPICE'
        return
      }
    })
    let historical = await localforage.getItem(gameId + '-historical')
    planets = planets ? planets.data : []

    let armies = await localforage.getItem(gameId + '-armies')
    armies = armies ? armies.data : []

    core = []

    $('.planetCard3').each(function (i, element) {
      element = $(element)
      element.append("<div class='buttons'></div>")
      var detailsTr = element.find('table')
      var planetId = parseInt(element.attr('id').replace('pc', ''), 10)

      var tmpGrowthStr = element
        .find('.basedata img')
        .attr('onmouseover')
        .replace(',', '')
      var tmpGrowth = parseInt(
        tmpGrowthStr.substring(
          tmpGrowthStr.indexOf(':') + 2,
          tmpGrowthStr.indexOf('/ day') - 1
        )
      )
      var leechGrowth = parseInt(
        tmpGrowthStr.substring(
          tmpGrowthStr.indexOf('Leeching:') + 9,
          tmpGrowthStr.indexOf('/day')
        )
      )
      tmpGrowth = tmpGrowth > 0 ? '+' + tmpGrowth : '' + tmpGrowth
      leechGrowth = leechGrowth > 0 ? '+' + leechGrowth : '' + leechGrowth

      var _planet = _.find(planets, {
        id: planetId,
      })

      if (_planet) {
        _planet.popGrowth = tmpGrowth
        _planet.leechGrowth = isNaN(leechGrowth) ? '' : leechGrowth
        core.push(_planet)
        detailsTr
          .find('.civ')
          .append(
            $('<tr class="influ-wtr">').append(
              $('<td colspan="4">').append([
                'Organic: ',
                $('<span class="highlight">').text(tmpGrowth + ' / day'),
              ])
            )
          )
        if (!isNaN(leechGrowth)) {
          detailsTr
            .find('.civ')
            .append(
              $('<tr class="influ-wtr">').append(
                $('<td colspan="4">').append([
                  'Leech: ',
                  $('<span class="highlight">').text(leechGrowth + ' / day'),
                ])
              )
            )
        }

        if (_planet.numExploitsInPipe > 0) {
          detailsTr
            .find('.vt')
            .append(
              `<table border="0" cellpadding="0" cellspacing="0"><tr class="inpipe"  style="height:22px"><td colspan="4">In pipe: <span class="highlight">${_planet.numExploitsInPipe}</span></td></tr></table>`
            )
        }

        const army = armies.find((item) => item.planetId === parseInt(planetId))

        if (_planet.governmentId == 0) {
          if (detailsTr.find("img[src*='plunder_icon.gif']").length > 0) {
            element
              .find('.buttons')
              .append(
                `<button data-action="off" style="color:red" data-name="${_planet.name}" data-id="${planetId}" class="plunder red">☠️&nbsp;&nbsp;PLUNDER OFF</button>`
              )
          } else {
            element
              .find('.buttons')
              .append(
                `<button data-action="on" style="color:green" data-name="${_planet.name}" data-id="${planetId}"  class="plunder green">☠️&nbsp;&nbsp;PLUNDER ON</button>`
              )
          }
        }
        if (_planet.governmentId == 0) {
          // console.log(_planet.bh);
          if (_planet.governmentDaysLeft === 0) {
            element
              .find('.buttons')
              .append(
                `<button data-action='2' data-gov="Democratic" data-id="${planetId}"  class="change-gov green">🪐&nbsp;&nbsp;DEMO</button>`
              )
            element
              .find('.buttons')
              .append(
                `<button data-action='1' data-gov="Authoritarian" data-id="${planetId}"  class="change-gov blue">🪐&nbsp;&nbsp;AUTH</button>`
              )
          }
        }
        if (_planet.governmentId == 1) {
          // console.log(_planet.bh);
          if (_planet.governmentDaysLeft === 0) {
            element
              .find('.buttons')
              .append(
                `<button data-action='0' data-gov="Dictatorial" data-id="${planetId}"  class="change-gov red">🪐&nbsp;&nbsp;DICT</button>`
              )
            element
              .find('.buttons')
              .append(
                `<button data-action='2' data-gov="Democratic" data-id="${planetId}"  class="change-gov green">🪐&nbsp;&nbsp;DEMO</button>`
              )
          }
        }
        if (_planet.governmentId == 2) {
          if (_planet.governmentDaysLeft === 0) {
            element
              .find('.buttons')
              .append(
                `<button data-action='0' data-gov="Dictatorial" data-id="${planetId}"  class="change-gov red">🪐&nbsp;&nbsp;DICT</button>`
              )
            element
              .find('.buttons')
              .append(
                `<button data-action='1' data-gov="Authoritarian" data-id="${planetId}"  class="change-gov blue">🪐&nbsp;&nbsp;AUTH</button>`
              )
          }
        }
        if (_planet.governmentId == 0) {
          if (_planet.bhole) {
            element
              .find('.buttons')
              .append(
                `<button data-action='cancel' data-id="${planetId}"  class="prep-bh green">🪐&nbsp;&nbsp;CANCEL BH (${
                  _planet.bhole - 1
                })</button>`
              )

              .append(
                `<button data-id="${planetId}"  class="launch-bh green">💥&nbsp;&nbsp;LAUNCH BH (${
                  _planet.bhole - 1
                })</button>`
              )
          } else {
            element
              .find('.buttons')
              .append(
                `<button data-action='cancel' data-id="${planetId}"  class="prep-bh green">💥&nbsp;&nbsp;PREP BH</button>`
              )
          }
        }

        if (detailsTr.find("img[src*='migrate']").length > 0) {
          element
            .find('.buttons')
            .append(
              `<button data-action='cancel' data-id="${planetId}" class="leech red">❌&nbsp;&nbsp;STOP LEECH</button>`
            )
        } else {
          element
            .find('.buttons')
            .append(
              `<a href="/servlet/Planet?planetid=${planetId}" target="_blank" class="leech-start green">➡️&nbsp;&nbsp;LEECH</a>`
            )
        }
      }
      if (_planet && _planet.counterInfiltration === 0) {
        element
          .find('.buttons')
          .append(
            `<button data-action='set' data-id="${planetId}"  class="ci yellow">🛡️&nbsp;&nbsp;CI 50%</button>`
          )
      } else {
        element
          .find('.buttons')
          .append(
            `<button data-action='drop' data-id="${planetId}"  class="ci yellow">🛡️&nbsp;&nbsp;CI 0%</button>`
          )
      }

      let link = $(
        '.planetCard3 > div.visib_content > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > span > a'
      ).attr('href')

      const tagId = link
        ? parseInt(link.split('&')[1].replace('tagid=', ''))
        : false

      if (_planet && _planet.tag1 === undefined) {
        element
          .find('.buttons')
          .append(
            `<button data-action='Join' data-tag-id="${tagId}" data-id="${planetId}" class="tag">🐼&nbsp;&nbsp;Tag</button>`
          )
      } else {
        element
          .find('.buttons')
          .append(
            `<button data-action='Leave' data-tag-id="${tagId}" data-id="${planetId}" class="tag">🐼&nbsp;&nbsp;Untag</button>`
          )
      }
      element
        .find('.buttons')
        .append(
          `<button data-action='abandon' data-id="${planetId}"  class="ab yellow">🌌&nbsp;&nbsp;Abandon</button>`
        )


        const movesHTML = Hyp.generateFleetMovesHTML(moves, _planet.name);


        if (movesHTML) {
          const $movesTable = $('<div class="moves"></div>');
          $movesTable.html(movesHTML);
          element.find('.buttons').append($movesTable);
        }

    })


    core = [...new Set(core)]
    let today = new Date().toISOString().split('T')[0]
    if (historical === null) {
      historical = [
        {
          day: today,
          data: core,
        },
      ]
    } else {
      if (historical[0].day !== today) {
        historical.unshift({
          day: today,
          data: core,
        })
      }
    }
    localforage.setItem(gameId + '-historical', historical)
  }

  $d.on('click', '.army', function (e) {
    const action = $(this).attr('data-action')
    const id = $(this).attr('data-id')
    const _post = {
      buildunits: '',
      unittype: '',
      planetid: id,
      BackToGlobalFactoriesPage: '',
    }
    if (action == 'on') {
      _post.startgenarmies = 'Start army generation'
    } else {
      _post.stopgenarmies = 'none'
    }
    $.post('/servlet/Floatorders', _post).done((response) => {
      if (action === 'on') {
        $(this)
          .attr('data-action', 'off')
          .attr('style', 'color:red')
          .text('SET ARMY OFF')
      } else {
        $(this)
          .attr('data-action', 'on')
          .attr('style', 'color:green')
          .text('SET ARMY ON')
      }
    })
  })

  $d.on('click', '.launch-bh', function (e) {
    //launch-bh
    const id = $(this).attr('data-id')

    _post = {
      bhboom: 'Confirm planet annihilation',
      planetid: id,
      confirm: '',
    }

    $.post('/servlet/Floatorders', _post).done((response) => {
      $(this).remove()
    })
  })

  $d.on('click', '.plunder', function (e) {
    const action = $(this).attr('data-action')
    const id = $(this).attr('data-id')
    const name = $(this).attr('data-name')

    const _post = {
      planetid: id,
    }
    if (action == 'on') {
      _post.plunder = 'Plunder planet ' + name
      _post.confirm = ''
    } else {
      _post.cancelplunder = 'Cancel'
    }
    $.post('/servlet/Floatorders', _post).done((response) => {
      if (action === 'on') {
        $(this)
          .attr('data-action', 'off')
          .attr('style', 'color:red')
          .html('☠️&nbsp;&nbsp;PLUNDER OFF')
      } else {
        $(this)
          .attr('data-action', 'on')
          .attr('style', 'color:green')
          .html('☠️&nbsp;&nbsp;PLUNDER ON')
      }
    })
  })

  $d.on('click', '.ci', function (e) {
    const action = $(this).attr('data-action')
    const id = $(this).attr('data-id')
    const _post = {
      planetid: id,
      searchinfiltr: 'update',
    }
    if (action == 'set') {
      _post.accuracyid = 2
    } else {
      _post.accuracyid = 0
    }
    $.post('/servlet/Planetinf', _post).done((response) => {
      $(this).remove()
    })
  })
  $d.on('click', '.tag', function (e) {
    const $this = $(this)
    const action = $this.attr('data-action')
    const id = $this.attr('data-id')
    const tagId = $this.attr('data-tag-id')

    let _post = {
      planetid: id,
      joinalliance: 'Join',
      tag: 'spice',
    }
    console.log(_post)
    // if (action === 'Leave') {
    //   _post = null
    //   _post = {
    //     planetid: id,
    //     quitalliance: action,
    //     tagid0: tagId,
    //   }
    // }
    $.post('/servlet/Planet', _post).done((response) => {
      if (action === 'Leave') {
        $this.attr('data-action', 'Join').html('🐼&nbsp;&nbsp;Tag')
      } else {
        $this.attr('data-action', 'on').html('🐼&nbsp;&nbsp;Untag')
      }
    })
  })
  $d.on('click', '.ab', function (e) {
    const id = $(this).attr('data-id')

    $.get(`/servlet/Planet?abandon=&planetid=${id}`).done(() => {
      $(this).remove()
    })
  })
  $d.on('click', '.change-gov', function (e) {
    const action = $(this).attr('data-action')
    const id = $(this).attr('data-id')
    const gov = $(this).attr('data-gov')
    const _post = {
      planetid: id,
      newgovsystem: action,
      changegovsystem: 'Change to ' + gov,
      confirm: '',
    }

    $.post('/servlet/Planet', _post).done((response) => {
      $(this).remove()
    })
  })

  $d.on('click', '.leech', function (e) {
    const id = $(this).attr('data-id')

    const _post = {
      planetid: id,
      cancelmigration: 'Stop migration',
      confirm: '',
    }

    $.post('/servlet/Planet', _post).done((response) => {
      $(this).remove()
    })
  })

  $d.on('click', '.moves h3', function () {
    let parent = $(this).parent()
    if (parent.hasClass('showTable')) {
      parent.removeClass('showTable')
    } else {
      parent.addClass('showTable')
    }
  })

  $d.on('click', '.avoid-bh', function (e) {
    var $this = $(this)
    var _id = parseInt($this.attr('data-id'))
    var _newStore = []

    Hyp.avoidBH(_id).done(function () {
      $this.parent().find('.bh-infos-span').text('No bh prep')
      $this.attr('action', 'prep').text('Prep BH')
      $this.removeClass('avoid-bh').addClass('prep-bh')
      chrome.storage.sync.get('data', function (store) {
        _.forEach(store.data, function (el) {
          if (el.id === _id) {
            el.bh = false
          }
          _newStore.push(el)
        })
        // Hyp.storeData(_newStore)
      })
    })
  })

  $d.on('click', '.prep-bh', function (e) {
    var $this = $(this)
    var _id = parseInt($this.attr('data-id'), 10)
    var _newStore = []

    Hyp.prepBH(_id).done(function () {
      $this.attr('action', 'cancel').text('Cancel BH')
      $this.removeClass('prep-bh').addClass('avoid-bh')
      $this.parent().find('.bh-infos-span').text('48 hours')
      chrome.storage.sync.get('data', function (store) {
        _.forEach(store.data, function (el) {
          if (el.id === _id) {
            el.bh = '48 hours'
          }
          _newStore.push(el)
        })
        // Hyp.storeData(_newStore)
      })
    })

  })


  Hyp.getSession().then((log) => {
    localforage.setItem('currentGameId', log.gameId).then((go) => {
      console.log(
        '%c *** Boot Game Id ' + log.gameId + ' ***',
        'background: yellow; color: black; padding: 5px 10px;'
      )
      const getAll = async function () {
        const gameId = await localforage.getItem('currentGameId')
        const playerName = $('#htopmenu > li:nth-child(5) > a > div > b').text()
        localforage.setItem(gameId + '-currentPlayer', playerName)
        const currentPlanets = await setDBData_currentPlanets()
        console.log('currentPlanets', currentPlanets)
        await new Promise((r) => setTimeout(r, 100))
        await setDBData_foreignPlanets()
        await new Promise((r) => setTimeout(r, 100))
        await setAlliance()
        await new Promise((r) => setTimeout(r, 100))
        displayPlanetInfos()
        // displayMoves();
      }
      getAll()
    })
  })
})
