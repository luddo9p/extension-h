var parseNmyBar = function (bar) {
  var parsed = ''
  var bar = $(bar)
  parsed = bar.find('td:last').text().trim()

  return 'E: ' + parsed
}

var parseAllyBar = function (bar) {
  var parsed = ''
  var bar = $(bar)

  var parsed = bar.find('.vb').text().split('/')[0].trim()

  if (parsed.includes(' + ')) {
    var split = parsed.split('+')
    var total = Hyp.rawValue(split[0]) + Hyp.rawValue(split[1])
    parsed = numeral(total).format('0[.]0a')
  }

  return ' F: ' + parsed.toUpperCase()
}

parseDiv = function (row) {
  var planetName = row.find('.vc').eq(0).find('.publicTag').remove()
  planetName = row.find('.vc').eq(0).text()
  var hasStasis =
    row.find('.vc').eq(1).find('.flagStasis').length > 0 ? ' *stasis* ' : ''
  var isMinero = row.find('.vc').eq(1).find('.prod1') ? ' minero ' : ''
  var isAtt =
    row.find('.vc').eq(1).find('.flagBattle').text() === 'Attacking'
      ? ' [ATT] '
      : '[DEF]'

  var getSC = planetName.match('SC')

  var sc = planetName
    .substring(getSC.index, getSC.index + 4)
    .trim()
    .replace('(', '')

  var nrg = ''
  if (row.find('.energy').length > 0) {
    nrg = row.find('.energy').find('td').last().text().trim()
  }

  var barAlly = ''
  if (row.find('.bars').eq(0).text().includes('Space AvgP:')) {
    barAlly = parseAllyBar(row.find('.bars').eq(0))
  }
  if (row.find('.bars').eq(1).text().includes('Space AvgP:')) {
    barAlly = parseAllyBar(row.find('.bars').eq(1))
  }
  if (row.find('.bars').eq(2).text().includes('Space AvgP:')) {
    barAlly = parseAllyBar(row.find('.bars').eq(2))
  }

  var barNmy = ''
  if (row.find('.bars').eq(0).text().includes('Enemy space AvgP:')) {
    barNmy = ' / ' + parseNmyBar(row.find('.bars').eq(0))
  }
  if (row.find('.bars').eq(1).text().includes('Enemy space AvgP:')) {
    barNmy = ' / ' + parseNmyBar(row.find('.bars').eq(1))
  }

  return {
    sc: sc,
    line: planetName + hasStasis + barAlly + barNmy + ' / ' + nrg + ' ' + isAtt,
  }
}

var rows = $('#tacForm').find('.nopadding')
if (rows) {
  rows.each(function (i, el) {
    var $el = $(el)
    var copy = parseDiv($el)
    $el
      .parent()
      .append(
        '<span class="highlight" style="padding: 10px;display:inline-block;background: #171720;">' +
          copy.line +
          '</span><br/>'
      )
  })
}

var msgs = $('.fmsg').find('.nopadding')
if (msgs) {
  msgs.each(function (i, el) {
    var $el = $(el)
    var copy = parseDiv($el)
    $el
      .parent()
      .append(
        '<p class="highlight" style="padding: 10px;background: #171720;">' +
          copy.line +
          '</p>'
      )
  })
}

var tabs = $('.tabbertab')
var planets = []

$('.nopadding').each(function (i, el) {
  var $el = $(el)
  var copy = parseDiv($el)
  planets.push(copy)
})
var grpPlanets = _.groupBy(planets, 'sc')
var recap = ''
_.forEach(grpPlanets, function (el, index) {
  recap += '<h2> — ' + index + '</h2>'
  recap += '<div style="padding: 10px;display:block;background: #171720;">'
  _.forEach(el, function (card, i) {
    recap += card.line + '<br/>'
  })
  recap += '</div>'
})

var $wrapper = $('<div class="copy"></div>')
$wrapper.css({
  padding: '20px',
  background: '#111',
})
$wrapper.append(recap)
$('.tabberlive')
  .css({
    'text-align': 'left',
    color: '#AAAA77',
  })
  .append($wrapper)
