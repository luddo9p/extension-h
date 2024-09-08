function replacePlaceholders(str, map) {
  return str.replace(/%[^%]+?%/g, function (m) {
    if (map[m] === undefined) {
      return m
    }
    return map[m]
  })
}

chrome.storage.sync.get('cfg', function (storage) {
  var cfg = storage.cfg

  Hyp.getSession()
    .done(function (session) {
      var ul = $('<ul>').append(
        $('<li>').append(
          $('<a target="_blank">Home</a>').attr('href', Hyp.url('Home'))
        )
      )
      console.log(session)
      // if (cfg.external.isEnabled) {
      // 	ul.append($('<li>').append(
      // 		$('<a target="_blank">Send session to external website</a>').
      // 			attr('href',
      // 				replacePlaceholders(cfg.external.urlPattern, {
      // 					'%PLAYER_ID%': session.playerId,
      // 					'%AUTH_KEY%': session.authKey,
      // 					'%GAME_ID%': session.gameId
      // 				})
      // 			)
      // 	));
      // }
      ul.append([
        $('<li><a href="/pages/options.html" target="_blank">Options</a></li>'),

        $('<li>').append(
          $('<a target="_blank">Logout</a>').attr('href', Hyp.getLogoutUrl())
        ),
      ])
      ul.append([
        $('<li>').append(
          $('<button id="clearDataButton">Clear all caches</button>')
        ),
      ])
      $('nav').append(ul)
    })
    .fail(function (error) {
      throw error
    })
})
