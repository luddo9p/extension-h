$.getScript('/js/overlibmws.js').done(function() {
  var isAborted = {}
  $('.polMapZone, .polMapCenter')
    .mouseover(function() {
      var url = Hyperiums7.getServletUrl(
        $(this)
          .find('a')
          .attr('href')
      )
      isAborted[url] = false
      overlib('Loading...')
      jqXHR = chrome.runtime.sendMessage(
        {
          request: 'getAjaxCache',
          url: url,
          settings: {}
        },
        function(data) {
          if (isAborted[url]) {
            return
          }
          var planets = Hyp.getPlanetsFromTradingMap(data),
            rows = Hyp.getStatisticsRowsFromPlanets(planets)

          rows.unshift(
            $('<tr class="stdArray">').append([
              '<td>Tag</td>',
              '<td># Planets</td>',
              '<td></td>', // coords
              '<td>Civ.</td>',
              '<td>Gov.</td>',
              '<td>Race</td>',
              '<td></td>', // distance
              '<td>Product</td>',
              '<td>Activity</td>',
              '<td>Avail.<br>capacity</td>'
            ])
          )

          var table = $('<table class="stdArray">')
            .css('white-space', 'nowrap')
            .append($('<tbody>').append(rows))

          table.find('td').css('font-size', 'smaller')
          overlib(table[0].outerHTML)
        }
      )
    })
    .mouseout(function() {
      var url = Hyp.getServletUrl(
        $(this)
          .find('a')
          .attr('href')
      )
      isAborted[url] = true
      nd()
    })
})
