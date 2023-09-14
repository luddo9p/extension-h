const displayTicks = async function() {
  const gameId = await localforage.getItem('currentGameId')
  Hyp.getSession().then(function(log) {
    var offsetInMS =
      new Date().getTime() -
      new Date(
        $('.servertime')
          .eq(0)
          .text()
          .replace('Server Time: ', '') + ' +00:00'
      )

    $('.servertime').remove()

    var $div = $('<div id="Hyp-ticks" class="servertime"></div>')
    $('body').append($div)

    var msPerPx = 10000
    var $timeline = $('<div class="timeline"></div>').click(function(event) {
      if (event.altKey) {
        msPerPx *= 1.5
      } else {
        msPerPx /= 1.5
      }
    })

    $div.append($timeline)

    var ticks

    if (gameId == 3) {
      ticks = Hyp.ticksR12
    } else if (gameId == 1) {
      ticks = Hyp.ticksWinterGal
    } else if (gameId == 2) {
      ticks = Hyp.ticksR11
    } else if (gameId == 4) {
      ticks = Hyp.ticksR10
    } else if (gameId == 0) {
      ticks = Hyp.ticksR13
    } else {
      ticks = Hyp.ticksR11
    }

    var $ul

    var msPerH = 3600000

    ;(function() {
      var serverDate = new Date(new Date().getTime() - offsetInMS)
      $timeline.empty()
      if ($ul) {
        $ul.remove()
      }

      $ul = $('<ul>')
      $ul.append(
        $('<li>').text(
          'ST: ' +
            moment(serverDate)
              .utc()
              .format('YYYY-MM-DD HH:mm:ss')
        )
      )

      var timelineWidth = $timeline.width()
      $.each(ticks, function(tickIndex, tick) {
        var nextDate = tick.getNextDate(serverDate)
        var msUntilNextDate = nextDate.getTime() - serverDate.getTime()
        nextDate = moment(nextDate).utc()
        var $li = $('<li>')
          .text(
            tick.name +
              ': ' +
              moment(msUntilNextDate)
                .utc()
                .format('HH:mm:ss')
          )
          .attr('title', nextDate.format('YYYY-MM-DD HH:mm:ss'))

        if (msUntilNextDate < 10000) {
          // 10 seconds
          $li.addClass('Hyp-blink')
        }

        if (msUntilNextDate < 60000) {
          // 1 minute
          $li.addClass('alert')
        } else if (msUntilNextDate < 300000) {
          // 5 minutes
          $li.addClass('alertLight')
        } else if (msUntilNextDate < 600000) {
          // 10 minutes
          $li.addClass('hlight')
        }

        $ul.append([' ', $li])

        var left = msUntilNextDate / msPerPx
        while (left < timelineWidth) {
          $timeline.append(
            $('<div class="tick hlight"></div>')
              .css({ left: left, 'padding-top': tickIndex / 2 + 'em' })
              .attr({ title: tick.name + '\n' + nextDate.format('HH:mm:ss') })
              .text(tick.name)
          )
          nextDate.add(tick.everyNthHour, 'hour')
          left += (tick.everyNthHour * msPerH) / msPerPx
        }
      })

      $div.prepend($ul)
      window.setTimeout(arguments.callee, 1000)
    })()
  })
}
displayTicks()