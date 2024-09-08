// core.js

function assureNumber(value) {
  if (isNaN(Number(value))) {
    throw new Error(`La valeur "${value}" n'est pas un nombre.`)
  }
  return Number(value)
}

function calculRevenuParPlanete($exploits, $activity, $pop, $wtr) {
  let exploits = assureNumber($exploits)
  let activity = assureNumber($activity)
  let pop = assureNumber($pop)
  if (
    typeof exploits !== 'number' ||
    typeof activity !== 'number' ||
    typeof pop !== 'number'
  ) {
    throw new Error('Toutes les valeurs doivent être des nombres')
  }

  const seuilExploitsEfficaces = pop / 10
  let revenuTotal = 0

  if (exploits <= seuilExploitsEfficaces) {
    revenuTotal = exploits * activity
  } else {
    let revenuPlein = seuilExploitsEfficaces * activity
    let exploitsSupplementaires = exploits - seuilExploitsEfficaces
    let revenuSupplementaire = exploitsSupplementaires * activity * 0.5
    revenuTotal = revenuPlein + revenuSupplementaire
  }

  const grossIncome = revenuTotal * 2.9
  const wtr = grossIncome * ($wtr / 100)
  return grossIncome - wtr
}

function calculAC(avgPop, totalPlanets, totalDict, totalAuth, totalHyp) {
  let acPercentage =
    (1 -
      Math.pow(0.988 - (avgPop / 1000) * 0.00002, totalPlanets) *
        Math.pow(0.98 - (avgPop / 1000) * 0.00002, totalDict) *
        Math.pow(0.984 - (avgPop / 1000) * 0.00026, totalAuth) *
        Math.pow(1 - (avgPop / 1000) * 0.002, totalHyp)) *
    100
  return acPercentage
}
