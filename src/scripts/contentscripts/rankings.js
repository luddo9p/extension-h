$(document).ready(function() {
  if ($('button[name="individual"][value="1"]#checkButton').length) {
    $('.stdArray tr').each(function(_, element) {
      var tr = $(element),
        playerTd = tr.children('td:first')
      var playerName = playerTd.children('b').text()
      playerTd.prepend(
        $(
          '<a target="_blank"><img src="/themes/theme1/misc/activity.png"></a>'
        ).attr(
          'href',
          'http://www.beka.fr/hyperiums/index.php?page=histo&player=' +
            encodeURIComponent(playerName) +
            '&selectgame=Hyperiums7'
        ),
        ' '
      )
    })
  }
})
