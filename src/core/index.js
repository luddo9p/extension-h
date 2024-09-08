const { exploitsCost, calculRevenuParPlanete, calculAC } = require('./utils')
var numeral = require('numeral')

// Données initiales de votre "core"
let coreData = [
  {
    nom: 'Alekhine',
    pop: 9587,
    exploits: 1150,
    activity: 25101,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
  },
  {
    nom: 'Ananke',
    pop: 5062,
    exploits: 900,
    activity: 23320,
    gov: 'Democratic',
    tax: 0,
    civ: 9,
  },
  {
    nom: 'Aronian',
    pop: 8535,
    exploits: 1150,
    activity: 24951,
    gov: 'Democratic',
    tax: 30,
    civ: 10
  },
  {
    nom: 'Bishop',
    pop: 8824,
    exploits: 1150,
    activity: 24952,
    gov: 'Democratic',
    tax: 30,
    civ: 10
  },
  {
    nom: 'Botvinnik',
    pop: 8201,
    exploits: 1150,
    activity: 24829,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
  },
  {
    nom: 'Bronstein',
    pop: 8597,
    exploits: 1150,
    activity: 24963,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49535491,
  },
  {
    nom: 'Capablanca',
    pop: 8277,
    exploits: 1150,
    activity: 24899,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49041641,
  },
  {
    nom: 'Carlsen',
    pop: 8789,
    exploits: 1150,
    activity: 24945,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49033037,
  },
  {
    nom: 'CaroKann',
    pop: 10663,
    exploits: 1150,
    activity: 25330,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 53526975,
  },
  {
    nom: 'Caruana',
    pop: 8314,
    exploits: 1150,
    activity: 24950,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49235765,
  },
  {
    nom: 'Castle',
    pop: 9676,
    exploits: 1150,
    activity: 25207,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 51357148,
  },
  {
    nom: 'Check',
    pop: 8455,
    exploits: 1150,
    activity: 24946,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 48952339,
  },
  {
    nom: 'Damiano',
    pop: 8717,
    exploits: 1150,
    activity: 24931,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49337200,
  },
  {
    nom: 'EnPassant',
    pop: 8330,
    exploits: 1150,
    activity: 24964,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 48883468,
  },
  {
    nom: 'Euwe',
    pop: 8473,
    exploits: 1150,
    activity: 24950,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49558215,
  },
  {
    nom: 'Fischer',
    pop: 7960,
    exploits: 1150,
    activity: 24780,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 48404876,
  },
  {
    nom: 'Fork',
    pop: 8317,
    exploits: 1150,
    activity: 24852,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49491558,
  },
  {
    nom: 'Gambit',
    pop: 9778,
    exploits: 1150,
    activity: 25138,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 51693638,
  },
  {
    nom: 'Grecco',
    pop: 9339,
    exploits: 1150,
    activity: 25053,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 51118024,
  },
  {
    nom: 'Grob',
    pop: 8869,
    exploits: 1150,
    activity: 24961,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49336042,
  },
  {
    nom: 'Heyheyhey',
    pop: 9594,
    exploits: 1150,
    activity: 25280,
    gov: 'Democratic',
    tax: 30,
    civ: 11,
    profit: 51316284,
  },
  {
    nom: 'Ixeron',
    pop: 9801,
    exploits: 1150,
    activity: 25142,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 51044222,
  },
  {
    nom: 'Karpov',
    pop: 8751,
    exploits: 1150,
    activity: 24938,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49484185,
  },
  {
    nom: 'Kasparov',
    pop: 8412,
    exploits: 830,
    activity: 24687,
    gov: 'Hyp.protect.',
    tax: 30,
    civ: 10,
    profit: 25255694,
  },
  {
    nom: 'Knight',
    pop: 8832,
    exploits: 1150,
    activity: 24953,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49982019,
  },
  {
    nom: 'Kramnik',
    pop: 9254,
    exploits: 1150,
    activity: 25036,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 50421850,
  },
  {
    nom: 'Leda',
    pop: 5110,
    exploits: 900,
    activity: 23402,
    gov: 'Democratic',
    tax: 0,
    civ: 9,
    profit: 49578322,
  },
  {
    nom: 'Lesker',
    pop: 9641,
    exploits: 1150,
    activity: 25111,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 51607682,
  },
  {
    nom: 'Mate',
    pop: 8075,
    exploits: 1150,
    activity: 24803,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 48956434,
  },
  {
    nom: 'Morphy',
    pop: 9590,
    exploits: 1150,
    activity: 25101,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 51301941,
  },
  {
    nom: 'Najdorf',
    pop: 9394,
    exploits: 1150,
    activity: 25063,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 51529509,
  },
  {
    nom: 'Panov',
    pop: 9124,
    exploits: 1150,
    activity: 25009,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 50685775,
  },
  {
    nom: 'Pawn',
    pop: 8484,
    exploits: 1150,
    activity: 24941,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49623907,
  },
  {
    nom: 'Petrosian',
    pop: 10543,
    exploits: 1150,
    activity: 25320,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 52807495,
  },
  {
    nom: 'Philidor',
    pop: 9178,
    exploits: 1150,
    activity: 25078,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 44707508,
  },
  {
    nom: 'Polgar',
    pop: 8644,
    exploits: 1150,
    activity: 24929,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49656789,
  },
  {
    nom: 'Reti',
    pop: 8737,
    exploits: 1150,
    activity: 24935,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49297498,
  },
  {
    nom: 'Rook',
    pop: 9475,
    exploits: 1150,
    activity: 25079,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 50566579,
  },
  {
    nom: 'RuiLopez',
    pop: 7526,
    exploits: 1150,
    activity: 24693,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 47285355,
  },
  {
    nom: 'Sicilian',
    pop: 7968,
    exploits: 1150,
    activity: 24837,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 48056676,
  },
  {
    nom: 'Spielman',
    pop: 8862,
    exploits: 1150,
    activity: 24982,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49934646,
  },
  {
    nom: 'Xenomorph',
    pop: 8414,
    exploits: 1150,
    activity: 24871,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 49260427,
  },
  {
    nom: 'Zugzwang',
    pop: 7937,
    exploits: 1150,
    activity: 24776,
    gov: 'Democratic',
    tax: 30,
    civ: 10,
    profit: 48182947,
  },
]
// Fonction pour recalculer les paramètres globaux après suppression d'une planète
function recalculerParametresGlobaux(planetsData) {
    let totalPop = planetsData.reduce((acc, planet) => acc + planet.pop, 0);
    let avgPop = totalPop / planetsData.length;
    let totalPlanets = planetsData.length;

    let totalDict = planetsData.filter(planet => planet.gov === 'Dictatorship').length;
    let totalDem = planetsData.filter(planet => planet.gov === 'Democratic').length;
    let totalAuth = planetsData.filter(planet => planet.gov === 'Authoritarian').length;
    let totalHyp = planetsData.filter(planet => planet.gov === 'Hyp.protect.').length;

    return { avgPop, totalPlanets, totalDict, totalDem, totalAuth, totalHyp };
}

// Fonction pour calculer le revenu total en incluant l'AC
function calculerRevenuTotalAvecAC(planetsData) {
    const params = recalculerParametresGlobaux(planetsData);
    const acPercentage = calculAC(params.avgPop, params.totalPlanets, params.totalDict, params.totalAuth, params.totalHyp);
    
    // Ici, ajustez le calcul du revenu si nécessaire pour tenir compte de l'AC
    return planetsData.reduce((acc, planet) => {
        const revenu = calculRevenuParPlanete(planet.exploits, planet.activity, planet.pop);
        // Supposons que l'AC réduit le revenu de chaque planète selon son pourcentage
        const revenuApresAC = revenu - (revenu * acPercentage / 100);
        return acc + revenuApresAC;
    }, 0);
}

// Fonction pour simuler la suppression de chaque planète et calculer le nouveau revenu total avec AC
function simulerSuppressionEtCalculerNouveauRevenuAvecAC(data) {
    data.forEach((planetToRemove, index) => {
        let newData = [...data.slice(0, index), ...data.slice(index + 1)];
        let nouveauRevenuTotal = calculerRevenuTotalAvecAC(newData);

        console.log(`Revenu total après suppression de ${planetToRemove.nom}: ${numeral(nouveauRevenuTotal).format('0,0')}, différence: ${numeral(revenuTotalInitial - nouveauRevenuTotal).format('0,0')}`);
    });
}

// Calcul du revenu total initial avec AC pour comparaison
let revenuTotalInitial = calculerRevenuTotalAvecAC(coreData);
console.log(`Revenu total initial avec toutes les planètes (incluant l'AC): ${numeral(revenuTotalInitial).format('0,0')}`);

// Lancer la simulation avec AC
simulerSuppressionEtCalculerNouveauRevenuAvecAC(coreData);