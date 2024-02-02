// Définition des variables économiques initiales
let revenuParPlaneteParJour = 20000000 // Revenu par planète par jour
let coutInvestissementCivParPlanete = 34194469.52 // Coût d'investissement en civ par planète
let meilleurRevenuNet = 0 // Meilleur revenu net initialisé à 0
let meilleuresPlanetes = 0 // Nombre optimal de planètes initialisé à 0
let meilleureAC = 0 // Meilleur pourcentage AC initialisé à 0
let avgPop = 20000 // Population moyenne par planète
// Nombre de planètes sous différents types de gouvernement
let totalDict = 0 // Dictatorial
let totalAuth = 0 // Autoritaire
let totalHyp = 1 // Hypothétique

// Variables hypothétiques pour les calculs
let currentAmountOfExploits = 520
let targetAmountOfExploits = 800
let civLvl = 9
let currentGov = 1.2
let civLvlFactor = Math.pow(0.99, civLvl)
let hasTL = true // Présence de technologie
let TlLvlFactor = hasTL ? 1 : 0.7
let SCFactor = Math.pow(1 - 0.025, 1 - 1) // Facteur spécifique à SC

const planetes = [
  {
    name: 'Bronstein',
    civ: 9,
    prod: 'Techno',
    activity: 23304,
    income: 20973200,
    exploits: 519,
    pop: 3924,
    gov: 'Demo',
  },
  {
    name: 'RuiLopez',
    civ: 9,
    prod: 'Minero',
    activity: 23264,
    income: 20765724,
    exploits: 519,
    pop: 3759,
    gov: 'Demo',
  },
  {
    name: 'Polgar',
    civ: 9,
    prod: 'Minero',
    activity: 23259,
    income: 20429333,
    exploits: 519,
    pop: 3733,
    gov: 'Demo',
  },
  {
    name: 'Grob',
    civ: 9,
    prod: 'Agro',
    activity: 23415,
    income: 21859120,
    exploits: 519,
    pop: 4468,
    gov: 'Demo',
  },
  {
    name: 'Petrosian',
    civ: 9,
    prod: 'Minero',
    activity: 23262,
    income: 20432698,
    exploits: 519,
    pop: 3746,
    gov: 'Demo',
  },
  {
    name: 'Botvinnik',
    civ: 9,
    prod: 'Minero',
    activity: 23293,
    income: 20929259,
    exploits: 519,
    pop: 3891,
    gov: 'Demo',
  },
  {
    name: 'Kasparov',
    civ: 9,
    prod: 'Minero',
    activity: 23213,
    income: 8476381,
    exploits: 260,
    pop: 3791,
    gov: 'Prot',
  },
  {
    name: 'Lesker',
    civ: 9,
    prod: 'Agro',
    activity: 23448,
    income: 22295360,
    exploits: 519,
    pop: 4628,
    gov: 'Demo',
  },
  {
    name: 'Grecco',
    civ: 9,
    prod: 'Minero',
    activity: 23282,
    income: 21090844,
    exploits: 519,
    pop: 3842,
    gov: 'Demo',
  },
  {
    name: 'Caruana',
    civ: 9,
    prod: 'Techno',
    activity: 23283,
    income: 20902132,
    exploits: 519,
    pop: 3828,
    gov: 'Demo',
  },
  {
    name: 'Fischer',
    civ: 9,
    prod: 'Minero',
    activity: 23259,
    income: 20489683,
    exploits: 519,
    pop: 3735,
    gov: 'Demo',
  },
  {
    name: 'Aronian',
    civ: 9,
    prod: 'Techno',
    activity: 23281,
    income: 20628042,
    exploits: 519,
    pop: 3815,
    gov: 'Demo',
  },
  {
    name: 'Ixeron',
    civ: 9,
    prod: 'Minero',
    activity: 23283,
    income: 20676017,
    exploits: 519,
    pop: 3846,
    gov: 'Demo',
  },
  {
    name: 'Kramnik',
    civ: 9,
    prod: 'Agro',
    activity: 23408,
    income: 21495444,
    exploits: 519,
    pop: 4437,
    gov: 'Demo',
  },
  {
    name: 'Karpov',
    civ: 9,
    prod: 'Agro',
    activity: 23428,
    income: 21974031,
    exploits: 519,
    pop: 4531,
    gov: 'Demo',
  },
  {
    name: 'Philidor',
    civ: 9,
    prod: 'Techno',
    activity: 23285,
    income: 19977429,
    exploits: 519,
    pop: 3834,
    gov: 'Demo',
  },
  {
    name: 'Panov',
    civ: 9,
    prod: 'Minero',
    activity: 23289,
    income: 21039805,
    exploits: 519,
    pop: 3873,
    gov: 'Demo',
  },
  {
    name: 'EnPassant',
    civ: 9,
    prod: 'Techno',
    activity: 23260,
    income: 20707703,
    exploits: 519,
    pop: 3719,
    gov: 'Demo',
  },
  {
    name: 'Check',
    civ: 9,
    prod: 'Techno',
    activity: 23276,
    income: 20579279,
    exploits: 519,
    pop: 3793,
    gov: 'Demo',
  },
  {
    name: 'Capablanca',
    civ: 9,
    prod: 'Techno',
    activity: 23323,
    income: 21355755,
    exploits: 519,
    pop: 4013,
    gov: 'Demo',
  },
  {
    name: 'Morphy',
    civ: 9,
    prod: 'Agro',
    activity: 23439,
    income: 22253497,
    exploits: 519,
    pop: 4584,
    gov: 'Demo',
  },
  {
    name: 'Carlsen',
    civ: 9,
    prod: 'Agro',
    activity: 23446,
    income: 22140259,
    exploits: 519,
    pop: 4621,
    gov: 'Demo',
  },
  {
    name: 'Euwe',
    civ: 9,
    prod: 'Techno',
    activity: 23282,
    income: 21045836,
    exploits: 519,
    pop: 3822,
    gov: 'Demo',
  },
  {
    name: 'Alekhine',
    civ: 9,
    prod: 'Agro',
    activity: 23427,
    income: 22126925,
    exploits: 519,
    pop: 4526,
    gov: 'Demo',
  },
  {
    name: 'Xenomorph',
    civ: 9,
    prod: 'Agro',
    activity: 23405,
    income: 21939597,
    exploits: 519,
    pop: 4424,
    gov: 'Demo',
  },
  {
    name: 'Spielman',
    civ: 9,
    prod: 'Minero',
    activity: 23253,
    income: 20831711,
    exploits: 519,
    pop: 3705,
    gov: 'Demo',
  },
  {
    name: 'Reti',
    civ: 9,
    prod: 'Agro',
    activity: 23419,
    income: 21887593,
    exploits: 519,
    pop: 4487,
    gov: 'Demo',
  },
  {
    name: 'Knight',
    civ: 9,
    prod: 'Minero',
    activity: 23275,
    income: 21002306,
    exploits: 519,
    pop: 3808,
    gov: 'Demo',
  },
  {
    name: 'Bishop',
    civ: 9,
    prod: 'Agro',
    activity: 23416,
    income: 21879395,
    exploits: 519,
    pop: 4477,
    gov: 'Demo',
  },
  {
    name: 'Rook',
    civ: 9,
    prod: 'Agro',
    activity: 23412,
    income: 22004450,
    exploits: 519,
    pop: 4457,
    gov: 'Demo',
  },
  {
    name: 'Damiano',
    civ: 9,
    prod: 'Agro',
    activity: 23429,
    income: 21662472,
    exploits: 519,
    pop: 4536,
    gov: 'Demo',
  },
  {
    name: 'Mate',
    civ: 9,
    prod: 'Minero',
    activity: 23262,
    income: 20818876,
    exploits: 519,
    pop: 3747,
    gov: 'Demo',
  },
  {
    name: 'Castle',
    civ: 9,
    prod: 'Techno',
    activity: 23277,
    income: 20893124,
    exploits: 519,
    pop: 3797,
    gov: 'Demo',
  },
  {
    name: 'Heyheyhey',
    civ: 9,
    prod: 'Techno',
    activity: 23256,
    income: 20684884,
    exploits: 519,
    pop: 3701,
    gov: 'Demo',
  },
  {
    name: 'Sicilian',
    civ: 9,
    prod: 'Techno',
    activity: 23269,
    income: 20940893,
    exploits: 519,
    pop: 3761,
    gov: 'Demo',
  },
  {
    name: 'Fork',
    civ: 9,
    prod: 'Agro',
    activity: 23419,
    income: 22051700,
    exploits: 519,
    pop: 4489,
    gov: 'Demo',
  },
  {
    name: 'CaroKann',
    civ: 9,
    prod: 'Agro',
    activity: 23413,
    income: 22015856,
    exploits: 519,
    pop: 4463,
    gov: 'Demo',
  },
  {
    name: 'Najdorf',
    civ: 9,
    prod: 'Minero',
    activity: 23267,
    income: 20936276,
    exploits: 519,
    pop: 3769,
    gov: 'Demo',
  },
  {
    name: 'Zugzwang',
    civ: 9,
    prod: 'Minero',
    activity: 23265,
    income: 20944407,
    exploits: 519,
    pop: 3764,
    gov: 'Demo',
  },
  {
    name: 'Gambit',
    civ: 9,
    prod: 'Agro',
    activity: 23426,
    income: 22115813,
    exploits: 519,
    pop: 4522,
    gov: 'Demo',
  },
  {
    name: 'Pawn',
    civ: 9,
    prod: 'Techno',
    activity: 23270,
    income: 20783026,
    exploits: 519,
    pop: 3765,
    gov: 'Demo',
  },
]

// Fonction pour formater les nombres en millions avec une décimale
function formatNumber(number) {
  return `${(number / 1000000).toFixed(1)}M`
}

let joursDans3Mois = 90 // Nombre de jours sur 3 mois

// Fonction pour calculer le coût des exploits
function exploitsCost(
  currentAmountOfExploits,
  targetAmountOfExploits,
  currentGov,
  civLvlFactor,
  TlLvlFactor,
  SCFactor
) {
  return (
    (targetAmountOfExploits - currentAmountOfExploits) *
    (15000 +
      (1000 * (currentAmountOfExploits + targetAmountOfExploits + 1)) / 2) *
    currentGov *
    civLvlFactor *
    TlLvlFactor *
    SCFactor
  )
}

function calculRevenuParPlanete(exploits, activity, pop) {
  // Seuil d'exploits pleinement efficaces basé sur la population
  const seuilExploitsEfficaces = pop / 10

  let revenuTotal = 0

  if (exploits <= seuilExploitsEfficaces) {
    // Chaque exploit génère 100% de son revenu potentiel
    revenuTotal = exploits * activity
  } else {
    // Revenu pour les exploits jusqu'au seuil à 100%
    let revenuPlein = seuilExploitsEfficaces * activity

    // Revenu pour les exploits au-delà du seuil à 50%
    let exploitsSupplementaires = exploits - seuilExploitsEfficaces
    let revenuSupplementaire = exploitsSupplementaires * activity * 0.5

    // Total du revenu
    revenuTotal = revenuPlein + revenuSupplementaire
  }

  // Calcul du revenu brut en appliquant le multiplicateur
  const grossIncome = revenuTotal * 2.9

  // Calcul de la retenue à la source (WTR)
  const wtr = grossIncome * 0.3

  // Revenu net après WTR
  return grossIncome - wtr
}


// Boucle pour trouver le nombre optimal de planètes
for (let totalPlanets = 1; totalPlanets <= 100; totalPlanets++) {
  let ti = totalPlanets * revenuParPlaneteParJour * joursDans3Mois // Total des revenus
  let coutTotalInvestissementCiv =
    totalPlanets * coutInvestissementCivParPlanete // Coût total d'investissement

  // Calcul du pourcentage AC
  let acPercentage =
    (1 -
      Math.pow(0.988 - (avgPop / 1000) * 0.00002, totalPlanets) *
        Math.pow(0.98 - (avgPop / 1000) * 0.00002, totalDict) *
        Math.pow(0.984 - (avgPop / 1000) * 0.00026, totalAuth) *
        Math.pow(1 - (avgPop / 1000) * 0.002, totalHyp)) *
    100

  let acCalculated = (acPercentage / 100) * ti // AC calculé
  let revenuNet = ti - acCalculated - coutTotalInvestissementCiv // Revenu net

  // Mise à jour des meilleures valeurs si le revenu net actuel est le plus élevé
  if (revenuNet > meilleurRevenuNet) {
    meilleurRevenuNet = revenuNet
    meilleuresPlanetes = totalPlanets
    meilleureAC = acPercentage
  }
}

// Affichage des résultats
console.log(
  `The optimal number of planets over 3 months is ${meilleuresPlanetes} with an avg pop of ${avgPop}, with avg income/pl: ${formatNumber(
    revenuParPlaneteParJour
  )}, resulting in the highest net revenue of ${formatNumber(
    meilleurRevenuNet
  )} and an AC Tax of ${meilleureAC.toFixed(2)}%.`
)
