const globalciv = async () => {
    const gameId = await localforage.getItem('currentGameId');
    const planets = await localforage.getItem(`${gameId}-currentPlanets`);
  
    const xillors = [];
    const azterks = [];
    const humans = [];
  
    console.log(planets);
  
    $('.line1, .line0').each((i, el) => {
    
      const $el = $(el);
      const planetName = $el.find('td')[0];
      const planet = planets.data.find(p => p.name === planetName.innerText);
      const exploits = planet.numExploits;
      $el.append(`<td>${exploits}</td>`);
      console.log(planet);
    });
  
  };
  
  globalciv();