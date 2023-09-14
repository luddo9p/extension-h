;(function() {
  const planetId = getParameterByName('planetid')
    ? getParameterByName('planetid')
    : ''

  console.log(planetId)

  let parser = url =>
    url
      .slice(url.indexOf('?') + 1)
      .split('&')
      .reduce((a, c) => {
        let [key, value] = c.split('=')
        a[key] = value
        return a
      }, {})

  var tradesLines = Array.from(
    document.querySelectorAll(
      'body > center > div:nth-child(7) > div > div.pane > table > tbody > tr > td > table.array > tbody > tr'
    )
  )

  tradesLines.forEach(tradesLine => {
    if (tradesLine.querySelector('a')) {
      const _a =
        $(tradesLine).find('a:first')[0].innerText == '@'
          ? $(tradesLine).find('a:last')[0]
          : $(tradesLine).find('a:first')[0]
      if ($(tradesLine).find('a:first')[0].innerText !== '@') {
        $(tradesLine)
          .find('td:first b')
          .append(
            `&nbsp; <a target="_blank" href="/servlet/Planetprod?planetid=${
              parser(_a.href).otherplanetid
            }" >>> ${_a.innerText}</a>`
          )
      }

      const dropBtn = $(
        `<button class="drop" data-planetid="${
          parser(_a.href).planetid
        }" data-tradeid="${parser(_a.href).tradeid}">drop</button>`
      )
      $(tradesLine).append(dropBtn)
    }
  })

  window.setTimeout(() => {
    $('.drop').on('click', function() {
      $.post('Planetprod', {
        droprel: 'Drop trading relation',
        planetid: $(this).attr('data-planetid'),
        tradeid: $(this).attr('data-tradeid'),
        confirmdrop: ''
      }).done(result => {
        window.location.reload()
      })
    })

    $('.drop').on('click', function() {
      $.post('Planetprod', {
        droprel: 'Drop trading relation',
        planetid: $(this).attr('data-planetid'),
        tradeid: $(this).attr('data-tradeid'),
        confirmdrop: ''
      }).done(result => {
        window.location.href = `/servlet/Planetprod?planetid=${planetId}`
      })
    })
  }, 1000)

  const freeBtn = $(
    '<div class="right"><button class="free">free exploits</buton></div>'
  )
  const selctionWrapper = $('body > center > div:nth-child(7) > div')
  selctionWrapper.append(freeBtn)

  $('.free').on('click', function() {
    /*
  <form action=Planetprod method=post><input type=submit class=button name=freeunusedcapacity value="Free unused capacity"><input type=hidden name=planetid value=1310></form>
  */
    $.post('Planetprod', {
      freeunusedcapacity: 'Free unused capacity',
      planetid: parseInt(document.location.search.replace('?planetid=', ''))
    }).done(result => {
      window.location.href = `/servlet/Planetprod?planetid=${planetId}`
    })
  })

  var input = $('select[name="otherplanetid"]').find('option')
  //console.log(input);
  var trades = []
  input.each(function(i, el) {
    var item = {}
    var label = $(el).text()
    splitted = label.split(' - ')

    if (i > 0) {
      item.name = splitted[0]
      var parse = splitted[2].split('<')
      item.id = $(el).val()
      item.activity = parseInt(splitted[1].replace('Activity ', ''))
      item.distance = parseInt(splitted[2].replace('Distance ', ''))
      item.tradeValue = item.activity - (900 + item.distance * 300)
      item.available = parse[1].replace('>', '')
      trades.push(item)
    }
  })
  trades = _.orderBy(trades, ['tradeValue'], ['desc'])
  var $select = $('select[name="otherplanetid"]')
  $select.empty()
  $select.append("<option value=''>-</option>")
  $.each(trades, function(i, el) {
    $select.append(
      "<option value='" +
        el.id +
        "'>" +
        el.name +
        ' - ' +
        el.tradeValue +
        ' - ' +
        el.available +
        '</option>'
    )
  })

  var trades_data = []

  var $trades = $('.pane')
    .eq(3)
    .find('.array')
    .find('tr')
  $trades.each(function(i, el) {
    if ($(el).hasClass('line0') || $(el).hasClass('line1')) {
      var trade = $(el)
        .find('.hr')
        .eq(0)
        .html()
        .split('<br>')
      var tradeValue = trade[0].replace(',', '') - trade[1].replace(',', '')
      $(el)
        .find('.hr')
        .eq(0)
        .append('<br>' + numeral(tradeValue).format('0,0'))
      var item = {}
      item.tradeValue = tradeValue
      item.el = $(el)

      trades_data.push(item)
    }
  })
  trades_data = _.orderBy(trades_data, ['tradeValue'], ['desc'])
  var table = $('.pane')
    .eq(3)
    .find('.array')
  table.empty()
  _.forEach(trades_data, function(el, i) {
    table.append(el.el)
  })
})()
