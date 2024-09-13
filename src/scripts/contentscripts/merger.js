// Fonction pour créer et afficher un toast en haut à droite
function showToast(message, removeAtEnd = false) {
    let toast = document.querySelector('.toast'); // Vérifie si le toast existe déjà
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.style.zIndex = '7777';
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.right = '20px';
      toast.style.backgroundColor = '#333';
      toast.style.color = '#fff';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '5px';
      toast.style.opacity = '1';
      document.body.appendChild(toast);
    }
  
    toast.textContent = message;
    toast.style.display = 'block';
  
    // Supprimer le toast à la fin, si spécifié
    if (removeAtEnd) {
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000); // Cache le toast après 5 secondes seulement à la fin
    }
  }
  
  // Fonction générique pour gérer la fusion
  function handleMerge(mergeType, mergeAction, btn) {
    console.log(`${mergeType} merge button clicked`);
  
    // Désactiver le bouton pour empêcher plusieurs clics
    btn.disabled = true;
    btn.style.opacity = '0.6'; // Optionnel : diminuer l'opacité pour indiquer qu'il est désactivé
  
    const planets = document.querySelectorAll(
      '.tabbertab:not(.tabbertabhide) .planetCard3'
    );
  
    const promises = [];
    let countMerged = 0;
    const totalMerged = planets.length;
  
    // Afficher le toast au démarrage du processus sans le supprimer
    showToast(`Merging 0/${totalMerged} planets...`);
  
    planets.forEach((planet, index) => {
      const link = planet.querySelector('a.planet').href;
      const planetId = link.match(/planetid=(\d+)/)[1];
  
      // Crée une promesse pour l'appel à Hyp.mergeAll ou Hyp.mergeAllGas
      const mergePromise = new Promise((resolve) => {
        setTimeout(async () => {
          await mergeAction(planetId); // Exécuter l'action de fusion
          countMerged += 1; // Incrémenter le compteur de planètes fusionnées
  
          // Mettre à jour le toast avec le nouveau compteur sans recréer ni supprimer l'élément
          showToast(`Merging ${countMerged}/${totalMerged} planets...`);
  
          console.log(`Planet ${mergeType} merged: ${countMerged}/${totalMerged}`);
          resolve(); // Résoudre la promesse après l'exécution
        }, index * 2000); // Intervalle de 2000ms entre chaque exécution
      });
  
      // Ajouter la promesse au tableau
      promises.push(mergePromise);
    });
  
    // Attendre que toutes les promesses soient exécutées
    Promise.all(promises)
      .then(() => {
        console.log(`Toutes les requêtes de fusion ${mergeType} ont été exécutées avec succès.`);
        showToast(`All planets ${mergeType} merged successfully!`, true); // Supprimer le toast seulement ici
      })
      .catch((error) => {
        console.error(`Erreur lors de l'exécution des requêtes ${mergeType}:`, error);
        showToast(`Erreur lors de l'exécution des fusions ${mergeType}.`, true); // Supprimer le toast après une erreur
      })
      .finally(() => {
        // Réactiver le bouton après la fin des requêtes
        btn.disabled = false;
        btn.style.opacity = '1'; // Restaurer l'opacité
      });
  }
  
  const merger = () => {
    const container = document.querySelector('.tabberlive');
    if (!container) return;
  
    // Création du bouton pour fusionner les flottes
    const btnFleets = document.createElement('button');
    btnFleets.textContent = 'Merge Fleets';
    btnFleets.style = 'padding: 5px 10px; margin:0 5px; margin-bottom: 30px;';
    container.insertBefore(btnFleets, container.firstChild);
  
    // Création du bouton pour fusionner le gaz
    const btnGas = document.createElement('button');
    btnGas.textContent = 'Merge Gas';
    btnGas.style = 'padding: 5px 10px; margin:0 5px; margin-bottom: 30px;';
    container.insertBefore(btnGas, container.firstChild);
  
    console.log('merger.js loaded');
  
    // Gestion des clics sur les boutons
    btnFleets.addEventListener('click', () => {
      handleMerge('fleets', Hyp.mergeAll, btnFleets);
    });
  
    btnGas.addEventListener('click', () => {
      handleMerge('gas', Hyp.mergeAllGas, btnGas);
    });
  };
  
  window.setTimeout(merger, 100);
  