$(document).ready(function () {
  $('#overviewSubmenu ul')
    .append([
      $('<li>').append(
        $('<a>Global gov manager</a>').attr({
          href: "https://hyperiums.com/servlet/Planet?globalgov=",
        }),
      ),
      $('<li>').append(
        $('<a>Fleet calculator</a>').attr({
          href: chrome.runtime.getURL('pages/fleets/calc.html'),
          target: '_blank'
        })
      ),
    ])
    .closest('.megawrapper')
    .css('height', '330px !important')

})
