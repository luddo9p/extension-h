
  const submenu = document.querySelector('#overviewSubmenu ul');
  
  if (submenu) {
    // Création de l'élément li pour "Global gov manager"
    const liGlobalGov = document.createElement('li');
    const linkGlobalGov = document.createElement('a');
    linkGlobalGov.textContent = 'Global gov manager';
    linkGlobalGov.href = "https://hyperiums.com/servlet/Planet?globalgov=";
    liGlobalGov.appendChild(linkGlobalGov);

    // Création de l'élément li pour "Fleet calculator"
    const liFleetCalculator = document.createElement('li');
    const linkFleetCalculator = document.createElement('a');
    linkFleetCalculator.textContent = 'Fleet calculator';
    linkFleetCalculator.href = chrome.runtime.getURL('pages/fleets/calc.html');
    linkFleetCalculator.target = '_blank';
    liFleetCalculator.appendChild(linkFleetCalculator);

    // Ajout des deux éléments li dans le ul
    submenu.appendChild(liGlobalGov);
    submenu.appendChild(liFleetCalculator);

    // Sélection de l'élément megawrapper et modification de sa hauteur
    const megawrapper = submenu.closest('.megawrapper');
    if (megawrapper) {
      megawrapper.style.height = '330px';
    }
  } else {
    console.error('Element #overviewSubmenu ul not found.');
  }

