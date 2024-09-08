async function militaryPage() {
  console.log('militaryPage.js loaded')
  const gameId = await localforage.getItem('currentGameId')
  const cachedData = localStorage.getItem(gameId + '-hapiDataCache')
  const moves = JSON.parse(cachedData).data

  if ($('td > input[name="merge"]:not(:disabled)')) {
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
      ' ',
    ])

    $('td > input[name="loadarmies"]:not(:disabled)').after([
      ' ',
      $(
        '<input type="submit" class="button" name="randomLoadAll" value="Load All">'
      ),
    ])
  }

  /* autocomplete */
  $(
    '[name="destplanetname"], [name="toplanet"], [name="destname"]'
  ).autocomplete({
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
  })

  /* UI D2 Btn */
  if ($('#OwnPlGroups, #Groups').length == 1) {
    $('.planetCard3').each(async function () {
      var $this = $(this)
      var planetName = $this.find('.planet').text()
      var planetID = $this.attr('id').replace('pc', '')
      var parent = $this.find('.planet').parent()
      var title = parent.text()
      var sc = parseInt(
        title.substring(
          title.match('SC').index + 2,
          title.match('SC').index + 4
        )
      )
      var coords = title.substring(
        title.match('SC').index + 3,
        title.match('SC').index + 13
      )
      coords = coords.split(',')
      var x = coords[0].replace('(', '')
      var y = coords[1].replace(')', '')

      console.log(coords)

      var $formAttack =
        '<form action="/servlet/Floatorders" method="post">' +
        '<input name="planetid" value="' +
        planetID +
        '" type="hidden" />' +
        '<input name="switchattack" value="attack" type="text" />' +
        '<input name="go" value="ok" type="hidden" />' +
        '<input name="submit" class="button" value="Switch DEF" type="submit" />' +
        '</form>'
      var $formDef =
        '<form action="/servlet/Floatorders" method="post">' +
        '<input name="planetid" value="' +
        planetID +
        '" type="hidden" />' +
        '<input name="switchattack" value="defend" type="text" />' +
        '<input name="go" value="ok" type="hidden" />' +
        '<input name="submit" class="button" value="Switch ATT" type="submit" />' +
        '</form>'

      var _action = $this.find('.flagBattle').length > 0 ? 'defend' : 'attack'
      var _style = $this.find('.flagBattle').length > 0 ? 'green' : 'red'
      var _switch = $this.find('.flagBattle').length > 0 ? 'DEF' : 'ATT'

      let args = {}
      args.planet = args.planet || '*'
      args.data = 'foreign_planets'
      args.request = 'getfleetsinfo'
      args.planet = planetName

      $this
        .find('.bars')
        .parent()
        .append(
          `<br/><td><div class="flex-line"><button data-action="${_action}" data-id="${planetID}" style="color: ${_style}; text-transform:uppercase;font-size:9px;display:block; width:auto;" class="custom-button btn-switch">🔄 ${_switch}</buttm> <button data-action="merge" data-id="${planetID}" style="display:block; width:auto; text-transform:uppercase; font-size:9px" class="custom-button btn-gas">🧰 merge gas</button> <button style="display:block; width:auto; text-transform:uppercase; font-size:9px" data-action="drop" data-id="${planetID}" class="custom-button btn-drop">🚢 drop</button></div></td>`
        )

      $this
        .find('.planet')
        .parent()
        .parent()
        .find('.militFlags tr')
        .append(`<td></td>`)

      $this
        .find('.planet')
        .parent()
        .parent()
        .find('.militFlags tr')
        .append(
          `<td><a class="custom-button" style="font-size:10px" href="https://hyperiums.com/servlet/Maps?pt=&reqx=${x}&reqy=${y.replace('S', '').trim()}&c=${sc}&d=2" target="_blank">📍 D2</a></td>`
        )
      $this
        .find('.planet')
        .parent()
        .parent()
        .find('.militFlags tr')
        .append([
          $(
            '<td><button class="addToGroup custom-button" style="font-size:10px" title="Use Define/Extend to confirm &amp; save">➕ Add</button></td>'
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

      const movesHTML = Hyp.generateFleetMovesHTML(moves, planetName)

      console.log('movesHTML', movesHTML)

      if (movesHTML) {
        const $movesTable = $('<div class="moves"></div>')
        $movesTable.html(movesHTML)
        $this.find('.bars').parent().find('.flex-line').after($movesTable);
      }
    })

    $(document).on('click', '.btn-switch', function (e) {
      const $this = $(this)
      const action = $this.attr('data-action')
      const id = $this.attr('data-id')
      const _switch = action == 'attack' ? 'DEF' : 'ATT'
      let _post = {}
      if (action === 'attack') {
        _post = {
          planetid: id,
          switchattack: 'attack',
        }
      } else {
        _post = {
          planetid: id,
          switchdefend: 'defend',
        }
      }

      $.post('/servlet/Floatorders', _post).done((response) => {
        if (action === 'attack') {
          $(this)
            .attr('data-action', 'defend')
            .attr('style', 'color:green')
            .text(`🔄 ${_switch}`)
        } else {
          $(this)
            .attr('data-action', 'attack')
            .attr('style', 'color:red')
            .text(`🔄 ${_switch}`)
        }
      })
    })

    $(document).on('click', '.btn-gas', async function (e) {
      const $this = $(this)
      const id = $this.attr('data-id')
      const result = await Hyp.mergeAll(id)
      $this.text(`merged`)
    })

    $(document).on('click', '.btn-sell', async function (e) {
      //first scrap page
      const $this = $(this)
      const id = $this.attr('data-id')
      const planetHtml = await Hyp.scrapeData(
        'https://hyperiums.com/servlet/Planetfloats?planetid=' + id
      )
      $pageHtml = $(planetHtml)
      const links = $pageHtml.find('#manageArmiesForm').find('.array').find('a')
      console.log(links)
    })

    // Camo
    $(document).on('click', '.btn-camo', function (e) {
      const $this = $(this)
      const action = $this.attr('data-action')
      const id = $this.attr('data-id')
      const _camo = action == 'ON' ? 1 : 0
      const _camoTxt = action == 'ON' ? 'OFF' : 'ON'
      var _styleCamo = action == 'ON' ? 'red' : 'green'

      $.get(
        `/servlet/Floatorders?setCamouflage=${_camo}&planetid=${id}&units=armies`
      ).done((response) => {
        console.log(response)
        $this.removeClass('green').removeClass('red')
        if (_camo == 'ON') {
          $this
            .attr('data-action', _camoTxt)
            .attr('style', 'font-size:10px')
            .addClass(_styleCamo)
            .text(`👻 ${_camoTxt}`)
        } else {
          $this
            .attr('data-action', _camoTxt)
            .attr('style', 'font-size:10px')
            .addClass(_styleCamo)
            .text(`👻 ${_camoTxt}`)
        }
      })
    })
  }

  // $('.line1,.line0').on('click', function (e) {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   if (!$(this).find('.checkbox').prop('checked')) {
  //     $(this).find('.checkbox').prop('checked', true)
  //   } else {
  //     $(this).find('.checkbox').prop('checked', false)
  //   }
  // })
}

window.setTimeout(militaryPage, 1000)
