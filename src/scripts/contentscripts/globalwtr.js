const globalwtr = async () => {
  const gameId = await localforage.getItem('currentGameId');
  const planets = await localforage.getItem(`${gameId}-currentPlanets`);

  const xillors = [];
  const azterks = [];
  const humans = [];

  console.log(planets);

  $('.line1, .line0').each((i, el) => {
  
    const $el = $(el);
    const planetId = $el.find('.std').attr('href').split('=')[1];
    const planet = planets.data.find(p => p.id === parseInt(planetId));
    const wtr = planet.wtr;
    $el.append(`<td><strong>${planet.pop}M</strong></td>`);
    console.log(planet.pop);
  });

  $('form').before(`
    <div class="select">Global wtr : 
      <select class="thin select-all" name="wtr_0" size="1">
        <option value="0">----</option>
        <option value="0">0</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="35">35</option>
        <option value="40">40</option>
        <option value="45">45</option>
        <option value="50">50</option>
      </select>
    </div><br>`
  );

  $(document).on('change', '.select-all', (e) => {
    const $target = $(e.target);
    const wtr = parseInt($target.val());
    $('form select').each((i, el) => {
      $(el).val(wtr).change();
    });
  });
};

globalwtr();