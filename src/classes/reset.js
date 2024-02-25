function resetCaches (e) {
    e.preventDefault();
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
    $('#resetCaches').text('Caches reset');
    setTimeout(() => {
        $('#resetCaches').text('Reset Caches');
        window.location.reload();
    }, 1000);
}

$('.solidblockmenu').next().append('<button id="resetCaches">Reset Caches</button>');

$('#resetCaches').on('click', resetCaches);
