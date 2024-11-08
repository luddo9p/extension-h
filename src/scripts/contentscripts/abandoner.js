

// Fonction générique pour gérer l'abandon des planètes avec un délai
  async function handleAbandon(btn) {
    const isOwnedPlanets = document.querySelector('.hc.banner') && document.querySelector('.hc.banner').textContent.includes('controlled')

console.log('isOwnedPlanets:', isOwnedPlanets)
    console.log('Abandon planets button clicked');
  
    btn.disabled = true;
    btn.style.opacity = '0.6';
  
    const gameId = await localforage.getItem('currentGameId');
    const foreignPlanets = await Hyp.getFleetsInfo({
      data: isOwnedPlanets ? 'own_planets' : 'foreign_planets',
    });
  
    const planets = document.querySelectorAll(
      '.tabbertab:not(.tabbertabhide) .planetCard3'
    );
  
    let countAbandoned = 0;
    const totalAbandon = planets.length;
  
    showToast(`Abandoning 0/${totalAbandon} planets...`);
  
    for (const planet of planets) {
      const planetName = planet.querySelector('.planet').textContent.trim();
      const match = foreignPlanets.find((fp) => fp.name === planetName);
      const planetId = planet
        .querySelector('a.planet')
        .href.match(/planetid=(\d+)/)[1];
  
      try {
        await $.get(`/servlet/Planet?abandon=&planetid=${planetId}`);
        countAbandoned += 1;
        showToast(`Abandoning ${countAbandoned}/${totalAbandon} planets...`);
      } catch (error) {
        console.error(`Error abandoning planet ${planetName}:`, error);
      }
  
      // Délai de 500ms entre chaque requête
      await delay(450);
    }
  
    showToast('All planets abandoned successfully!');
    setTimeout(() => {
      const toast = document.querySelector('.toast');
      if (toast) {
        toast.style.display = 'none';
      }
    }, 5000);
  
    btn.disabled = false;
    btn.style.opacity = '1';
  }

  
  // Fonction principale pour initier le dépôt et le chargement des armées
  const initButtons = () => {
    const container = document.querySelector('.tabbertab:not(.tabbertabhide)');
    if (!container) return;
  
    const btnAbandon = document.querySelector('.abandon-all');
    if (btnAbandon) {
      btnAbandon.addEventListener('click', () => {
        handleAbandon(btnAbandon);
      });
    }
  
  };
  
  // Initialisation des boutons
  window.setTimeout(initButtons, 1500);
  