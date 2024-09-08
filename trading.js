const planetes = [
  {
    nom: 'Alekhine',
    coords: [7, 1],
    prod: 'Agro',
  },
  {
    nom: 'Aronian',
    coords: [6, 1],
    prod: 'Techno',
  },
  {
    nom: 'Bishop',
    coords: [7, -2],
    prod: 'Agro',
  },
  {
    nom: 'Botvinnik',
    coords: [5, -1],
    prod: 'Minero',
  },
  {
    nom: 'Bronstein',
    coords: [5, 0],
    prod: 'Techno',
  },
  {
    nom: 'Capablanca',
    coords: [5, -3],
    prod: 'Techno',
  },
  {
    nom: 'Carlsen',
    coords: [7, 0],
    prod: 'Agro',
  },
  {
    nom: 'CaroKann',
    coords: [8, 2],
    prod: 'Agro',
  },
  {
    nom: 'Caruana',
    coords: [6, 0],
    prod: 'Techno',
  },
  {
    nom: 'Castle',
    coords: [8, 0],
    prod: 'Techno',
  },
  {
    nom: 'Check',
    coords: [5, 3],
    prod: 'Techno',
  },
  {
    nom: 'Damiano',
    coords: [6, -3],
    prod: 'Agro',
  },
  {
    nom: 'EnPassant',
    coords: [5, 3],
    prod: 'Techno',
  },
  {
    nom: 'Euwe',
    coords: [7, 1],
    prod: 'Techno',
  },
  {
    nom: 'Fischer',
    coords: [6, 1],
    prod: 'Minero',
  },
  {
    nom: 'Fork',
    coords: [8, 1],
    prod: 'Agro',
  },
  {
    nom: 'Gambit',
    coords: [8, -2],
    prod: 'Agro',
  },
  {
    nom: 'Grecco',
    coords: [5, -2],
    prod: 'Minero',
  },
  {
    nom: 'Grob',
    coords: [5, 1],
    prod: 'Agro',
  },
  {
    nom: 'Heyheyhey',
    coords: [8, 1],
    prod: 'Techno',
  },
  {
    nom: 'Ixeron',
    coords: [6, -1],
    prod: 'Minero',
  },
  {
    nom: 'Karpov',
    coords: [6, 2],
    prod: 'Agro',
  },
  {
    nom: 'Knight',
    coords: [7, -2],
    prod: 'Minero',
  },
  {
    nom: 'Kramnik',
    coords: [6, 2],
    prod: 'Agro',
  },
  {
    nom: 'Lesker',
    coords: [5, -2],
    prod: 'Agro',
  },
  {
    nom: 'Mate',
    coords: [8, 0],
    prod: 'Minero',
  },
  {
    nom: 'Morphy',
    coords: [5, -3],
    prod: 'Agro',
  },
  {
    nom: 'Najdorf',
    coords: [8, 2],
    prod: 'Minero',
  },
  {
    nom: 'Panov',
    coords: [6, -2],
    prod: 'Minero',
  },
  {
    nom: 'Pawn',
    coords: [8, -2],
    prod: 'Techno',
  },
  {
    nom: 'Petrosian',
    coords: [5, -1],
    prod: 'Minero',
  },
  {
    nom: 'Philidor',
    coords: [6, -2],
    prod: 'Techno',
  },
  {
    nom: 'Polgar',
    coords: [5, 0],
    prod: 'Minero',
  },
  {
    nom: 'Reti',
    coords: [7, 2],
    prod: 'Agro',
  },
  {
    nom: 'Rook',
    coords: [7, -2],
    prod: 'Agro',
  },
  {
    nom: 'RuiLopez',
    coords: [5, 0],
    prod: 'Minero',
  },
  {
    nom: 'Sicilian',
    coords: [8, 1],
    prod: 'Techno',
  },
  {
    nom: 'Spielman',
    coords: [7, -1],
    prod: 'Minero',
  },
  {
    nom: 'Xenomorph',
    coords: [7, -1],
    prod: 'Agro',
  },
  {
    nom: 'Zugzwang',
    coords: [8, -2],
    prod: 'Minero',
  },
]

function calculerDistanceManhattan(coordsA, coordsB) {
  return Math.abs(coordsA[0] - coordsB[0]) + Math.abs(coordsA[1] - coordsB[1])
}

function trouverPairesOptimales(planetes) {
  const paires = []
  const utilisées = new Set()
  let nonAppariées = []

  // Première passe pour apparier les planètes
  for (let i = 0; i < planetes.length; i++) {
    if (utilisées.has(i)) continue
    let distanceMin = Infinity
    let paireSelectionnee = null

    for (let j = 0; j < planetes.length; j++) {
      if (i === j || utilisées.has(j)) continue
      const distance = calculerDistanceManhattan(
        planetes[i].coords,
        planetes[j].coords
      )
      if (planetes[i].prod !== planetes[j].prod && distance < distanceMin) {
        distanceMin = distance
        paireSelectionnee = j
      }
    }

    if (paireSelectionnee !== null) {
      paires.push({
        planeteA: planetes[i].nom,
        planeteB: planetes[paireSelectionnee].nom,
        distance: distanceMin,
      })
      utilisées.add(i)
      utilisées.add(paireSelectionnee)
    } else {
      nonAppariées.push(i)
    }
  }

  // Tentative de réapparier les planètes non appariées en relâchant les contraintes
  // Cette étape peut être complexe en fonction des règles que vous êtes prêt à assouplir

  // Retourner les paires trouvées et les planètes non appariées si nécessaire
  return {
    paires,
    nonAppariées: nonAppariées.map((index) => planetes[index].nom),
  }
}

const resultat = trouverPairesOptimales(planetes)
console.log(resultat.paires)
if (resultat.nonAppariées.length > 0) {
  console.log('Planètes non appariées:', resultat.nonAppariées)
}

const pairesOptimales = trouverPairesOptimales(planetes)
console.log(pairesOptimales)
