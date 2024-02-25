function resetCaches(e) {
    // Vérifie si l'événement existe pour éviter une erreur lors de l'appel sans événement
    if (e) e.preventDefault();
    
    // Stocker le moment actuel comme dernier temps de réinitialisation
    localStorage.setItem('lastResetTime', Date.now().toString());
  
    // Suppression des éléments du localStorage
    localStorage.removeItem('1-last-update-time');
    localStorage.removeItem('1-hapi-alliance-owned-planets');
    localStorage.removeItem('lastExecutionTimeForeign');
    localStorage.removeItem('connexion');
    localStorage.removeItem('prochaineExecution1');
    localStorage.removeItem('1-hapiDataCache');
    localStorage.removeItem('lastExecutionTime');
    localStorage.removeItem('hapi-alliance-owned-planets');
    localStorage.removeItem('prochaineExecution2');
    localStorage.removeItem('hapiDataCacheMoves');
    localStorage.removeItem('hapiDataCache');
  
    // Mise à jour du texte du bouton et rechargement de la page
    $('#resetCaches').text('Caches reset');
    setTimeout(() => {
      $('#resetCaches').text('Reset Caches');
      window.location.reload();
    }, 100); // Ici, le délai est très court, juste pour démonstration
  }
  
  $('.solidblockmenu').next().append('<button id="resetCaches">Reset Caches</button>');
  $('#resetCaches').on('click', resetCaches);
  
  const searchString = '<font color="#FF4444" face="verdana,arial" size="2">Backup buddy sessions are limited to <b>60</b> minutes.</font>';
  const pageContent = document.documentElement.innerHTML;
  const containsString = pageContent.includes(searchString);
  
  // Vérification si une minute s'est écoulée depuis la dernière réinitialisation
  const lastResetTime = parseInt(localStorage.getItem('lastResetTime'), 10);
  const oneMinute = 60000; // 60 000 millisecondes
  
  if (containsString && (!lastResetTime || Date.now() - lastResetTime >= oneMinute)) {
    resetCaches();
  }
  