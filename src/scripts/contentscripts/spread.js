$(document).ready(function () {
  if (
    $('.formTitle').length > 0 &&
    $('.formTitle').text() === 'Fleets spreading' &&
    $('.alternArray').length > 0
  ) {
    async function spread() {
      const gameId = await localforage.getItem('currentGameId');
      const store = await localforage.getItem(gameId + '-alliance');
      const currentPlayer = await localforage.getItem(gameId + '-currentPlayer');

      const ccPlanets = await Hyp.getPlayerAttackList(currentPlayer, gameId)

      $('form').before(`
        <div class="buttons">
          <button class="switch-race" data-race='xillor'>🔘 Xillors</button>
          <button class="switch-race" data-race='azterk'>🔘 Azterk</button>
          <button class="switch-race" data-race='human'>🔘 Humans</button>
          <button class="switch-race" data-race='me'>🔘 Core</button>
          <button class="switch-race" data-race='friend'>🔘 Alliance</button>
          <button class="switch-race" data-race='attack'>🔘 Attack</button>
        </div><br>`);

      $('.info').before(`<button class="all">Select all</button> — `);
      $('.info').after(`<br><br><br>`);

      const filters = {
        me: false,
        friend: false,
        xillor: false,
        azterk: false,
        human: false,
        attack: false,
      };

      $('.alternArray tr').each(function () {
        const planetName = $(this).find('td').eq(1).text().trim();
        const find = store.data.find((item) => item.planet === planetName);
        let raceId = 'human';
        raceId = $(this)[0].innerText.includes('Xillor') ? 'xillor' : raceId;
        raceId = $(this)[0].innerText.includes('Azterk') ? 'azterk' : raceId;
        $(this).addClass(raceId);
        if (find) {
          $(this).addClass(find.player === currentPlayer ? 'me friend' : 'friend');
        }
        if (ccPlanets.includes(planetName)) {
          $(this).addClass('attack');
        }
      });

      function getPickedFilters(filterObject) {
        return Object.keys(filterObject).filter((key) => filterObject[key]);
      }

      $('.switch-race').on('click', function () {
        $(this).toggleClass('active');
        const race = $(this).data('race');
        filters[race] = !filters[race];
        applyFilters();
      });

      function applyFilters() {

        const activeFilters = getPickedFilters(filters);

        if (activeFilters.length === 0) {
          $('.alternArray tr').show();
        } else {
          $('.alternArray tr').hide();

          $('.alternArray tr').each(function () {
            const row = $(this);
            const isMatch = activeFilters.every((filter) =>
              row.hasClass(filter)
            );
            if (isMatch) {
              row.show();
            }
          });
        }
      }

      $('.all').on('click', function (e) {
        e.preventDefault();
        $('.alternArray tr:visible').find('.checkbox').prop('checked', true);
      });
    }
    spread();
  }
});
