$(document).ready(function () {
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

  // const fleetDetails = $('.fleetsDetails')
  // if (fleetDetails.length > 0) {
  //   fleetDetails.find('tr').each((i, el) => {
  //     if (i > 0) {
  //       let avgp = 0
  //       let race = ''
  //       let tl = 0
  //       let starbase = 0
  //       let cruisers = 0
  //       let destros = 0
  //       let bombers = 0
  //       let scouts = 0
  //       $(el)
  //         .find('td')
  //         .each((i, el) => {
  //           const elHtml = parseInt($(el).html())
  //           if (i === 1) tl = elHtml
  //           if (i === 2) race = $(el).html()
  //           if (i === 3) starbase = _.isNaN(elHtml) ? 0 : elHtml
  //           if (i === 4) cruisers = _.isNaN(elHtml) ? 0 : elHtml
  //           if (i === 5) destros = _.isNaN(elHtml) ? 0 : elHtml
  //           if (i === 6) bombers = _.isNaN(elHtml) ? 0 : elHtml
  //           if (i === 7) scouts = _.isNaN(elHtml) ? 0 : elHtml
  //         })
  //       ai = race == 'Azterk' ? 1 : 0
  //       ai = race == 'Xillor' ? 2 : ai
  //       avgp =
  //         starbase * Hyp.spaceAvgP[5][ai] +
  //         cruisers * Hyp.spaceAvgP[2][ai] +
  //         destros * Hyp.spaceAvgP[1][ai] +
  //         bombers * Hyp.spaceAvgP[4][ai] +
  //         scouts * Hyp.spaceAvgP[3][ai]
  //       $(el).append(`<td> ${numeral(avgp).format('0[.]0a')}</td>`)
  //     }
  //   })
  //   fleetDetails.find('tr').eq(0).append(`<td>Avgp</td>`)
  // }
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
        title.match('SC').index + 10
      )
      coords = coords.split(',')
      var x = coords[0].replace('(', '')
      var y = coords[1].replace(')', '')
      
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
      // camoStatus = await Hyp.hapi(args)
      // let camo = 0
      // for (const [key, value] of Object.entries(camoStatus)) {
      //   if(key.includes('camouf')) {
      //     camo = value
      //   }
      // }

      // console.log(camo)
      // var _camo = camo > 0 ? 'OFF' : 'ON'
      // var _styleCamo = camo > 0 ? 'red' : 'green'

      // https://hyperiums.com/servlet/Floatorders?setCamouflage=0&planetid=15282&units=armies
      // $this
      //   .find('.planet')
      //   .parent()
      //   .parent()
      //   .find('.militFlags tr')
      //   .append(
      //     `<td><button data-action="${_camo}" data-id="${planetID}" style="font-size:10px" class="custom-button btn-camo ${_styleCamo}">👻 ${_camo}</a></td>`
      //   )
        $this
        .find('.planet')
        .parent()
        .parent()
        .find('.militFlags tr')
        .append(
          `<td><button data-action="${_action}" data-id="${planetID}" style="color: ${_style}; text-transform:uppercase;font-size:10px" class="custom-button btn-switch">🔄 ${_switch}</a></td>`
        )
      $this
        .find('.planet')
        .parent()
        .parent()
        .find('.militFlags tr')
        .append(
          `<td><a class="custom-button" style="font-size:10px" href="https://hyperiums.com/servlet/Maps?pt=&reqx=${x}&reqy=${y}&c=${sc}&d=2" target="_blank">📍 D2</a></td>`
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

    // Camo
    $(document).on('click', '.btn-camo', function (e) {
      const $this = $(this)
      const action = $this.attr('data-action')
      const id = $this.attr('data-id')
      const _camo = action == 'ON' ? 1 : 0
      const _camoTxt = action == 'ON' ? 'OFF' : 'ON'
      var _styleCamo = action == 'ON' ? 'red' : 'green'

      // https://hyperiums.com/servlet/Floatorders?setCamouflage=0&planetid=15282&units=armies
      $.get(`/servlet/Floatorders?setCamouflage=${_camo}&planetid=${id}&units=armies`).done((response) => {
        console.log(response)
        $this.removeClass('green').removeClass('red')
        if (_camo == 'ON') {
          $this
            .attr('data-action',_camoTxt)
            .attr('style', 'font-size:10px')
            .addClass(_styleCamo)
            .text(`👻 ${_camoTxt}`)
        } else {
          $this
            .attr('data-action',_camoTxt)
            .attr('style', 'font-size:10px')
            .addClass(_styleCamo)
            .text(`👻 ${_camoTxt}`)
        }
      })
    })
  }
})
