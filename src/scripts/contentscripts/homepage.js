$(document).ready(function () {
  var $d = $(document)

  var $megaWrapper = $(`<div class='dashboard-hyp'></div>`)
  $megaWrapper.insertAfter('#htopmenu')

  const displayPlanetInfos = async function () {
    const gameId = await localforage.getItem('currentGameId')
    let planets = await localforage.getItem(gameId + '-currentPlanets')
    planets.data.forEach((el) => {
      if (el.tag.length > 0 && el.tag != undefined && el.tag != '') {
        window.TAG = el.tag
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
              `<a href="/servlet/Planet?planetid=${planetId}" target="_blank" class="leech-start green">➡️&nbsp;&nbsp;START LEECH</a>`
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
      joinalliance: action,
      tag: window.TAG,
    }
    if (action === 'Leave') {
      _post = null
      _post = {
        planetid: id,
        quitalliance: action,
        tagid0: tagId,
      }
    }
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

  const displayCoreThreats = async function () {
    const gameId = await localforage.getItem('currentGameId')
    let dataSwitches = await localforage.getItem(gameId + '-core')
    if (!dataSwitches) return
    _.orderBy(dataSwitches.data, ['warning'], ['desc'])
    var $wrapperSwitch = $('<div class="incore-threat moves banner"></div>')
    var $li = ''

    dataSwitches.data.forEach((row) => {
      let time = ' - '
      let ago = ' - '
      if (row.time) {
        time = moment(row.time).utc().format('YYYY-MM-DD HH:mm:ss')
        ago = moment(row.time).utc().fromNow(true)
      }
      let spliting = row.coords.split(',')
      let coords = {
        x: parseFloat(spliting[0].replace(/[^\d.-]/g, '')),
        y: parseFloat(spliting[1].replace(/[^\d.-]/g, '')),
      }

      let tag = row.tag == '-' ? '[]' : row.tag
      let warning = row.warning ? 'warning' : ''
      let tactmap = row.tactmap ? row.tactmap.nrg : ' - '
      let check = tactmap === ' - ' ? 'warning' : ''
      //console.log(row)
      $li += `<tr class="switch ${warning} ${check}"><td><a target="_blank" href="/servlet/Maps?tm=&reqx=${
        coords.x
      }&reqy=${coords.y}&d=0&clusterid=1">${
        row.planet
      }</a></td><td>${row.prod.charAt(0)}</td><td>${row.race.charAt(
        0
      )}</td><td>${row.gov}</td><td>${row.civ}</td><td>${
        row.coords
      }</td><td>${tactmap}</td><td>${
        row.warning || check === 'warning' ? '1' : '0'
      }</td><td>${time}</td><td>${ago}</td></tr>`
    })

    $wrapperSwitch.html(`
              <h3>Incore monitoring ${dataSwitches.index} / ${
      dataSwitches.threatsLenght
    } (${dataSwitches.data[dataSwitches.index].planet})</h3>
              <table class="switches" id="core-switch">
                <thead>
                  <tr>
                    <td>Planet</td>
                    <td>Prod</td>
                    <td>Race</td>
                    <td>Gov</td>
                    <td>Civ</td>
                    <td>Coords</td>
                    <td>Nrg</td>
                    <td>Warn</td>
                    <td>Time</td>
                    <td>Relative Time</td>
                  </tr>
                </thead>
                ${$li}
              </table>
            `)
    if (dataSwitches.data.length > 0) {
      if ($('.incore-threat').length === 0) {
        $megaWrapper.prepend($wrapperSwitch)
        var table = $('#core-switch').DataTable()
        table.order([7, 'desc']).draw()
      }
    }
  }

  const displayTagSwitches = async function () {
    const gameId = await localforage.getItem('currentGameId')
    let dataSwitches = await localforage.getItem(gameId + '-tags')
    if (!dataSwitches) return
    dataSwitches = dataSwitches.data.reverse()
    var $wrapperSwitch = $('<div class="moves banner"></div>')
    var $li = ''

    // clean old records
    var dateObj = new Date(Date.now() - 86400000 * 3)
    dataSwitches.forEach((item, i) => {
      if (item.time < dateObj.getTime()) {
        dataSwitches.splice(i, 1)
      }
    })
    localforage.setItem(gameId + '-tags', {
      lastUpdate: new Date().getTime(),
      lastUpdateReadable: new Date(),
      data: dataSwitches,
    })

    _.slice(dataSwitches, 0, 5000).forEach((row, index) => {
      let time = ' - '
      let ago = ' - '
      if (row.time) {
        time = moment(row.time).utc().format('YYYY-MM-DD HH:mm:ss')
        ago = moment(row.time).utc().fromNow(true)
      }
      let spliting = row.old.coords.split(',')

      let coords = {
        x: parseFloat(spliting[0].replace(/[^\d.-]/g, '')),
        y: parseFloat(spliting[1].replace(/[^\d.-]/g, '')),
      }

      let switchInCore = ''
      if (coords.x > -5 && coords.x < 5 && coords.y < 0) {
        switchInCore = 'switch-in-core'
      }

      let tag = row.new.tag == '-' ? '[]' : row.new.tag
      let oldTag = row.old.tag == '-' ? '[]' : row.old.tag
      $li += `<tr class="switch"><td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${
        coords.x
      }&reqy=${coords.y}&c=1&d=2" target="_blank">${
        row.new.planet
      }</a></td><td>${row.old.prod.charAt(0)}</td><td>${row.old.race.charAt(
        0
      )}</td><td>${row.new.gov}</td><td>${row.old.civ}</td><td>${
        row.new.coords
      }</td><td>${oldTag} > ${tag}</td><td>${time}</td><td>${ago}</td></tr>`
    })

    $wrapperSwitch.html(`
              <h3>Tag switch</h3>
              <table class="switches" id="tag-switch">
                <thead>
                  <tr>
                    <td>Planet</td>
                    <td>Prod</td>
                    <td>Race</td>
                    <td>Gov</td>
                    <td>Civ</td>
                    <td>Coords</td>
                    <td>Switch Tag</td>
                    <td>Time</td>
                    <td>Relative Time</td>
                  </tr>
                </thead>
                ${$li}
              </table>
            `)
    if (dataSwitches.length > 0) {
      $megaWrapper.prepend($wrapperSwitch)
      var table = $('#tag-switch').DataTable()
      table.order([7, 'desc']).draw()
    }
  }

  const displaySwitchGovs = async function () {
    const gameId = await localforage.getItem('currentGameId')
    let dataSwitches = await localforage.getItem(gameId + '-switches')
    if (!dataSwitches) return
    dataSwitches = dataSwitches.data.reverse()
    // clean old records
    var dateObj = new Date(Date.now() - 86400000 * 3)
    dataSwitches.forEach((item, i) => {
      if (item.time < dateObj.getTime()) {
        dataSwitches.splice(i, 1)
      }
    })
    localforage.setItem(gameId + '-switches', {
      lastUpdate: new Date().getTime(),
      lastUpdateReadable: new Date(),
      data: dataSwitches,
    })

    var $wrapperSwitch = $('<div class="moves banner"></div>')
    var $li = ''
    // dataSwitches = _.filter(dataSwitches, function(o) {
    //   return o.new.tag != 'PANDA'
    // })
    _.slice(dataSwitches, 0, 5000).forEach((row, index) => {
      let time = ' - '
      let ago = ' - '
      if (row.time) {
        time = moment(row.time).utc().format('YYYY-MM-DD HH:mm:ss')
        ago = moment(row.time).utc().fromNow(true)
      }
      let spliting = row.old.coords.split(',')

      let coords = {
        x: parseFloat(spliting[0].replace(/[^\d.-]/g, '')),
        y: parseFloat(spliting[1].replace(/[^\d.-]/g, '')),
      }

      let switchInCore = ''
      if (gameId == 2) {
        if (coords.x > -5 && coords.x < 5 && coords.y < 0) {
          switchInCore = 'switch-in-core'
        }
      }

      //console.log(row)
      if (row.old.gov == 'Hyp.' && row.new.gov == 'Demo.') {
        let tag = row.new.tag === 'undefined' ? '' : row.new.tag
        $li += `<tr class="switch-hyp ${switchInCore}"><td>${
          row.new.id
        }</td><td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${
          coords.x
        }&reqy=${coords.y}&c=1&d=2" target="_blank">${
          row.new.planet
        }</a></td><td>[<b>${tag}</b>]</td><td>${row.old.prod.charAt(
          0
        )}</td><td>${row.old.race.charAt(0)}</td><td>${row.old.civ}</td><td>${
          row.old.activity
        }</td><td>${row.old.coords}</td><td>${row.old.gov} > ${
          row.new.gov
        }</td><td>${time}</td><td>${ago}</td></tr>`
      } else if (row.new.gov == 'Dict.' && row.new.prod == 'Techno') {
        let tag = row.new.tag === 'undefined' ? '' : row.new.tag
        $li += `<tr class="switch-dict ${switchInCore}"><td>${
          row.new.id
        }</td><td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${
          coords.x
        }&reqy=${coords.y}&c=1&d=2" target="_blank">${
          row.new.planet
        }</a></td><td>[<b>${tag}</b>]</td><td>${row.old.prod.charAt(
          0
        )}</td><td>${row.old.race.charAt(0)}</td><td>${row.old.civ}</td><td>${
          row.old.activity
        }</td><td>${row.old.coords}</td><td>${row.old.gov} > ${
          row.new.gov
        }</td><td>${time}</td><td>${ago}</td></tr>`
      } else if (row.new.gov == 'Dict.' && row.new.prod !== 'Techno') {
        let tag = row.new.tag === 'undefined' ? '' : row.new.tag
        $li += `<tr class="switch-dict-core ${switchInCore}"><td>${
          row.new.id
        }</td><td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${
          coords.x
        }&reqy=${coords.y}&c=1&d=2" target="_blank">${
          row.new.planet
        }</a></td><td>[<b>${tag}</b>]</td><td>${row.old.prod.charAt(
          0
        )}</td><td>${row.old.race.charAt(0)}</td><td>${row.old.civ}</td><td>${
          row.old.activity
        }</td><td>${row.old.coords}</td><td>${row.old.gov} > ${
          row.new.gov
        }</td><td>${time}</td><td>${ago}</td></tr>`
      } else if (switchInCore != '') {
        let tag = row.new.tag === 'undefined' ? '' : row.new.tag
        $li += `<tr class="switch ${switchInCore}"><td>${
          row.new.id
        }</td><td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${
          coords.x
        }&reqy=${coords.y}&c=1&d=2" target="_blank">${
          row.new.planet
        }</a></td><td>[<b>${tag}</b>]</td><td>${row.old.prod.charAt(
          0
        )}</td><td>${row.old.race.charAt(0)}</td><td>${row.old.civ}</td><td>${
          row.old.activity
        }</td><td>${row.old.coords}</td><td>${row.old.gov} > ${
          row.new.gov
        }</td><td>${time}</td><td>${ago}</td></tr>`
      } else {
        let tag = row.new.tag === 'undefined' ? '' : row.new.tag
        $li += `<tr class="switch"><td>${
          row.new.id
        }</td><td><a href="https://hyperiums.com/servlet/Maps?pt=&reqx=${
          coords.x
        }&reqy=${coords.y}&c=1&d=2" target="_blank">${
          row.new.planet
        }</a></td><td>[<b>${tag}</b>]</td><td>${row.old.prod.charAt(
          0
        )}</td><td>${row.old.race.charAt(0)}</td><td>${row.old.civ}</td><td>${
          row.old.activity
        }</td><td>${row.old.coords}</td><td>${row.old.gov} > ${
          row.new.gov
        }</td><td>${time}</td><td>${ago}</td></tr>`
      }
    })

    $wrapperSwitch.html(`
              <h3>Gov switch</h3>
              <table class="switches" id="gov-switch">
                <thead>
                  <tr>
                  <td>ID</td>  
                  <td>Planet</td>
                    <td>Tag</td>
                    <td>Prod</td>
                    <td>Race</td>
                    <td>Civ</td>
                    <td>Activity</td>
                    <td>Coords</td>
                    <td>Switch</td>
                    <td>Timestamp</td>
                    <td>Relative Time</td>
                  </tr>
                </thead>
                ${$li}
              </table>
            `)
    if (dataSwitches.length > 0) {
      $megaWrapper.prepend($wrapperSwitch)
      var table = $('#gov-switch').DataTable()
      table.order([9, 'desc']).draw()
    }
  }

  const displayMoves = async function () {
    const gameId = await localforage.getItem('currentGameId')
    let moves = await localforage.getItem(gameId + '-moves')
    moves = moves.data

    var $wrapper = $('<div class="moves banner"></div>')
    var resumes = []
    _.forEach(moves, function (el, i) {
      var move = []

      _.forEach(el, function (_fleet, i) {
        var scouts = Hyp.spaceAvgP[3][_fleet.race] * _fleet.nbscou
        var bombers = Hyp.spaceAvgP[4][_fleet.race] * _fleet.nbbomb
        var destroyers = Hyp.spaceAvgP[1][_fleet.race] * _fleet.nbdest
        var cruisers = Hyp.spaceAvgP[1][_fleet.race] * _fleet.nbcrui

        var avgp = scouts + bombers + destroyers + cruisers

        move.push({
          camo: parseInt(_fleet.camouf) == 0 ? 'off' : 'on',
          from: _fleet.from,
          to: _fleet.to,
          eta: parseInt(_fleet.dist) + parseInt(_fleet.delay),
          avgp: avgp,
          type: parseInt(_fleet.defend) == 1 ? 'DEF' : 'ATT',
        })
        // avgp = numeral(avgp).format('0[.]0a')
      })
      var resume = {
        camo: move[0].camo,
        avgp: numeral(_.sumBy(move, 'avgp')).format('0[.]0a').toLowerCase(),
        from: move[0].from,
        to: move[0].to,
        type: move[0].type,
        eta: move[0].eta,
      }
      resumes.push(resume)
    })
    $table = ''
    if (resumes.length > 0) {
      resumes = _.orderBy(resumes, 'eta')
      _.forEach(resumes, function (resume, i) {
        $table += `<tr>
        <td>${resume.from} >>> ${resume.to}</td>
        <td><b>${resume.eta}h</b></td>
        <td>${resume.avgp}</td>
        <td><span class="camo-${resume.camo}">${resume.camo}</span></td>
        <td>${resume.type}</td>
      </tr>`
      })

      $wrapper.html(`
    <h3>Moves</h3>
      <table id="moves-switch" class="switches">
        <thead>
          <tr>
            <td>Move</td>
            <td>ETA</td>
            <td>AVGP</td>
            <td>Camo</td>
            <td>ATT/DEF</td>
          </tr>
        </thead>
        <tbody>
        ${$table}
        </tbody>
      </table>`)

      $megaWrapper.prepend($wrapper)
    }
  }

  const showPop = async function () {
    var $wrapper = $('<div class="moves banner"></div>')
    const gameId = await localforage.getItem('currentGameId')
    let historical = await localforage.getItem(gameId + '-historical')
    let $table = ''
    let totalPlanet = historical[0].data.length
    let totalPop = 0
    historical[0].data.forEach((row) => {
      var prod = row.productId === 0 ? 'Agro' : 'Minero'
      prod = row.productId === 2 ? 'Techno' : prod
      var race = row.raceId === 0 ? 'Human' : 'Azterk'
      race = row.raceId === 2 ? 'Xillor' : race
      let natural = parseFloat(row.popGrowth)
      let leech = row.leechGrowth ? parseFloat(row.leechGrowth) : 0
      let solde = natural + leech
      var overExploited =
        row.numExploits * 10 > row.pop ? 'switch-dict-core' : ''
      totalPop += row.pop
      $table += `<tr class="${overExploited}">
        <td><a target="_blank" href="/servlet/Planet?planetid=${row.id}">${
        row.name
      }</a></td>
        <td><b>${numeral(row.pop).format('0,0')}</b></td>
        <td>${natural}</td>
        <td>${leech}</td>
        <td>${solde}</td>
        <td>${prod}</td>
        <td>${race}</td>
        <td>${row.tax}</td>
        <td>${row.numExploits}</td>
      </tr>`
    })

    const popAvg = numeral(totalPop / totalPlanet).format('0,0')
    $wrapper.html(`
  <h3>Pop (avg : ${popAvg})</h3>
    <table id="pop-switch" class="switches">
      <thead>
        <tr>
        <td>Planet</td>
        <td>Population</td>
        <td>Natural</td>
        <td>Leech</td>
        <td>Pop Growth</td>
        <td>Prod</td>
        <td>Race</td>
        <td>WTR</td>
        <td>Exploits</td>
        </tr>
      </thead>
      <tbody>
      ${$table}
      </tbody>
    </table>`)

    $megaWrapper.prepend($wrapper)
    var table = $('#pop-switch').DataTable()
    table.order([1, 'desc']).draw()
  }

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
        await new Promise((r) => setTimeout(r, 500))
        await setDBData_foreignPlanets()
        await new Promise((r) => setTimeout(r, 500))
        await setAlliance()
        await new Promise((r) => setTimeout(r, 500))
        displayPlanetInfos()
      }
      getAll()
    })
  })
})
