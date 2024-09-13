const globalciv = async () => {
  try {
    const gameId = await localforage.getItem('currentGameId');
    const planets = await localforage.getItem(`${gameId}-currentPlanets`);

    const lines = document.querySelectorAll('.line1, .line0');
    lines.forEach((el) => {
      const planetNameElement = el.querySelector('td');
      const planetName = planetNameElement.textContent.trim();

      // Trouver la planète correspondante
      const planet = planets.data.find(p => p.name === planetName);
      
      // Si la planète est trouvée, ajouter le nombre d'exploitations
      if (planet) {
        const exploitsCell = document.createElement('td');
        exploitsCell.textContent = planet.numExploits;
        el.appendChild(exploitsCell);
      }
    });
  } catch (error) {
    console.error('An error occurred while retrieving planet data:', error);
  }
};

globalciv();
