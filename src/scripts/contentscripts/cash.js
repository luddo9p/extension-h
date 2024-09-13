function calculerValeurAjustee(E2, B105) {
  return E2 * (1 - B105)
}

function calculateAcTax(totalDemo, totalDict, totalAuth, totalHyp, avgPop) {
  const acTax =
    (1 -
      Math.pow(0.988 - (avgPop / 1000) * 0.00002, totalDemo) *
        Math.pow(0.98 - (avgPop / 1000) * 0.00002, totalDict) *
        Math.pow(0.984 - (avgPop / 1000) * 0.00026, totalAuth) *
        Math.pow(1 - (avgPop / 1000) * 0.002, totalHyp)) *
    100
  return acTax
}

function isPlanetEconomicallyViable(income, acCost, totalPlanets) {
  const netIncome = income + acCost // Le coût AC est négatif, donc on l'ajoute pour le soustraire
  const averageIncomePerPlanet = netIncome / totalPlanets

  return averageIncomePerPlanet > 0 // Renvoie vrai si le revenu moyen par planète est positif
}

function calculateMinimumIncomePerPlanet(acCost, totalIncome, totalPlanets) {
  const netIncomeNeeded = Math.abs(acCost) // Revenu net nécessaire pour couvrir l'AC
  const averageIncomeNeeded = netIncomeNeeded / totalPlanets

  return averageIncomeNeeded
}

function getCoefficient(typeGov) {
  switch (typeGov) {
    case 2:
      return 1
    case 1:
      return 1.5
    case 0:
      return 2
    case 3:
      return 2.5
    default:
      return 1
  }
}

let incomes = []
const coreData = []

const setCash = async function () {
  const gameId = await localforage.getItem('currentGameId')
  const currentPlanets = await localforage.getItem(gameId + '-currentPlanets')
  const totalPlanets = currentPlanets.data.length
  var income = $('.cashTotals')
    .find('.hr')
    .eq(0)
    .text()
    .replace(',', '')
    .replace(',', '')
    .replace(',', '')

  var totalIncome = income

  var dp = Math.abs(
    $('.cashTotals')
      .find('.hr')
      .eq(4)
      .text()
      .replace(',', '')
      .replace(',', '')
      .replace(',', '')
  )

  let ac = Math.abs(
    $('.cashArray')
      .find('.line0')
      .eq(0)
      .find('td')
      .eq(1)
      .text()
      .replace(',', '')
      .replace(',', '')
      .replace(',', '')
  )
  let ti = $('.cashTotals')
    .find('.hr')
    .eq(0)
    .text()
    .replace(',', '')
    .replace(',', '')
    .replace(',', '')

  ti = parseFloat(ti)

  const totalAuth = currentPlanets.data.filter(
    (planet) => planet.governmentId === 1
  ).length
  const totalDemo = currentPlanets.data.filter(
    (planet) => planet.governmentId === 2
  ).length
  const totalDict = currentPlanets.data.filter(
    (planet) => planet.governmentId === 0
  ).length

  const totalHyp = 1

  let avgPop = Math.round(
    _.sumBy(currentPlanets.data, 'pop') / currentPlanets.data.length
  )

  let demoCost =
    ac -
    (1 - 0.988 ** (totalDemo - 1) * 0.984 ** totalAuth * 0.98 ** totalDict) * ti
  let authCost =
    ac -
    (1 - 0.988 ** totalDemo * 0.984 ** (totalAuth - 1) * 0.98 ** totalDict) * ti
  let dictCost =
    ac -
    (1 - 0.988 ** totalDemo * 0.984 ** totalAuth * 0.98 ** (totalDict - 1)) * ti

  const acTax =
    (1 -
      (0.988 - (avgPop / 1000) * 0.00002) ** totalDemo *
        (0.98 - (avgPop / 1000) * 0.00002) ** totalDict *
        (0.984 - (avgPop / 1000) * 0.00026) ** totalAuth *
        (1 - (avgPop / 1000) * 0.002) ** totalHyp) *
    100

  acCalculated = (acTax / 100) * ti

  const calculateAc = calculateAcTax(
    totalDemo,
    totalDict,
    totalAuth,
    totalHyp,
    avgPop
  )

  const testAc = acCalculated / (totalDemo + totalAuth + totalDict + totalHyp)

  const avgAc = testAc * (totalDemo + totalAuth + totalDict + totalHyp)

  const upkeep = Math.abs(
    $(document)
      .find('.cashArray')
      .eq(0)
      .find('tr')
      .eq(2)
      .find('.hr')
      .text()
      .replace(/\D/g, '')
  )

  const upk = (upkeep / (income - ac)) * 100

  $('.cashTotals')
    .find('.line0')
    .eq(0)
    .find('td')
    .eq(0)
    .append(
      `<tr>
    <td>
  		<small>demo cost : ` +
        numeral(demoCost).format('0,0') +
        `<br/>
  		auth cost : ` +
        numeral(authCost).format('0,0') +
        `<br/>
  		dict cost : ` +
        numeral(dictCost).format('0,0') +
        `</small>
  	<td>
  </tr>`
    )
  let allIncomes = 0
  $('.cashArray').each((index, table) => {
    if (index > 0 && index < $('.cashArray').length - 1) {
      const indexTr =
        $(table).find('.hr').eq(0).text().replace(/\D/g, '') === '750000'
          ? 1
          : 0

      const income = parseFloat(
        $(table).find('.hr').eq(indexTr).text().replace(/\D/g, '')
      )

      allIncomes += income

      const planetName = $(table).parent().parent().find('.planet b').text()

      const profit = parseFloat(
        $(table)
          .find('.highlight')
          .html()
          .replace('profit <hr>', '')
          .replace(/\D/g, '')
      )
      var find = currentPlanets.data.find(
        (item) => item.name === planetName.trim()
      )

      let planetFind = coreData.find((item) => item.nom === planetName.trim())


      let acCost =
        find.governmentId === 0
          ? dictCost
          : find.governmentId === 1
          ? authCost
          : demoCost

      const minimumIncomePerPlanet = calculateMinimumIncomePerPlanet(
        -ac,
        income,
        totalPlanets
      )

      let coefficient = getCoefficient(find.governmentId)
      let partAC = (income / totalIncome) * ac // Part du coût AC ajustée par le coefficient
      const netProfit = income - partAC // Profit net après déduction de l'AC

      incomes.push({
        planet: planetName,
        partAC: partAC,
        total: parseInt(income, 10),
        totalFormat: numeral(parseInt(income, 10)).format('0,0'),
        profitFormat: numeral(parseInt(profit, 10)).format('0,0'),
        profit: parseInt(profit, 10),
        netProfit: parseInt(planetFind.revenu || 0, 10),
      })
    }
  })

  let totalIncomes = _.sumBy(incomes, 'total')
  let totalIncomesFormat = numeral(totalIncomes).format('0,0')
  let totalProfit = _.sumBy(incomes, 'profit')
  let totalProfitFormat = numeral(totalProfit).format('0,0')
  let totalNetProfit = _.sumBy(incomes, 'netProfit')
  let totalNetProfitFormat = numeral(totalNetProfit).format('0,0')

  const totalInflu = numeral(
    _.sumBy(_.slice(_.orderBy(incomes, ['total'], ['desc']), 0, 11), 'total')
  ).format('0,0')
  let _wtrs = 0
  let $lis = ''
  _.orderBy(incomes, ['total'], ['desc']).forEach((row, index) => {
    var find = currentPlanets.data.find(
      (item) => item.name === row.planet.trim()
    )
    var planetFind = coreData.find((item) => item.nom === row.planet.trim())
    if (!find) return
    // console.log(find)
    var race = find.raceId === 0 ? 'H' : 'A'
    race = find.raceId === 2 ? 'X' : race
    var prod = find.productId === 0 ? 'A' : 'M'
    prod = find.productId === 2 ? 'T' : prod
    var gov = find.governmentId === 2 ? 'demo' : 'dict'
    gov = find.governmentId === 1 ? 'auth' : gov

    // console.log(find)
    var overExploited = find.numExploits * 10 > find.pop ? 'overexploited' : ''
    var govLeft = ''
    if (find.governmentDaysLeft > 0) {
      govLeft = ` (${find.governmentDaysLeft})`
    }
    _wtrs += find.tax
    $lis += `
    <tr class="${overExploited}"><td>${
      index + 1
    }. <a href="/servlet/Planetprod?planetid=${find.id}" target="_blank">${
      row.planet
    }</a> (${race}${prod})</td><td>${find.numExploits}</td>
    <td>(${find.x}, ${find.y})</td>
    <td>${Hyp.products[find.productId]}</td>
    <td>${planetFind.tax}</td>
    <td>${planetFind.civ}</td>
    <td>${gov}${govLeft}</td>
    <td>${numeral(planetFind.pop).format('0,0')}</td><td>${numeral(
      find.activity
    ).format('0,0')}</td>
    <td>${numeral(row.profitFormat).format('0,0')}</td>
    <td>${numeral(row.netProfit).format('0,0')}</td>
    <td>${
      (((find.numExploits * 10) / find.pop) * 100).toFixed(0) - 100
    }%</td></tr>`
  })
  let avg = _wtrs / incomes.length
  $('.cashTotals').append(`<br/><h4>CT: ${numeral(dp / 3).format(
    '0,0'
  )} - NET TI : ${numeral(income - ac).format('0,0')} - UK ${upk.toFixed(
    2
  )}% - WTR AVG: ${avg.toFixed(2)}</h4>
  <br/>
   <table class="income-list switches" style="text-align:left"><thead>
    <tr>
      <td>Planet</td>
      <td>Exploits</td>
      <td>Coords</td>
      <td>Prod</td>
      <td>Wtr</td>
      <td>Civ</td>
      <td>Gov</td>
      <td>Pop</td>
      <td>Activity</td>
      <td>Profit</td>
      <td>Net Profit</td>
      <td>P:R</td>
    </tr>
   </thead>${$lis}</<table>
   <tfoot><tr><td>Total</td><td></td><td></td><td></td><td></td><td></td><td></td><td>${totalProfitFormat}</td><td>${totalNetProfitFormat}</td><td></td></tr></tfoot>
`)
}



function recalculerParametresGlobaux(planetsData) {

  let totalPop = planetsData.reduce((acc, planet) => {
    return acc + Number(planet.pop); // Assurez-vous que pop est traité comme un nombre
  }, 0);
  
  let avgPop = totalPop / planetsData.length;
  let totalPlanets = planetsData.length;

  let totalDict = planetsData.filter(planet => planet.gov === 'Dictatorial').length;
  let totalDem = planetsData.filter(planet => planet.gov === 'Democratic').length;
  let totalAuth = planetsData.filter(planet => planet.gov === 'Authoritarian').length;
  let totalHyp = planetsData.filter(planet => planet.gov === 'Hyp.protect.').length;

  return { avgPop, totalPlanets, totalDict, totalDem, totalAuth, totalHyp };
}

// Fonction pour calculer le revenu total en incluant l'AC
function calculerRevenuTotalAvecAC(planetsData) {
  const params = recalculerParametresGlobaux(planetsData);
  console.log(params);
  const acPercentage = calculAC(params.avgPop, params.totalPlanets, params.totalDict, params.totalAuth, params.totalHyp);

  
  // Ici, ajustez le calcul du revenu si nécessaire pour tenir compte de l'AC
  return planetsData.reduce((acc, planet) => {
      const revenu = calculRevenuParPlanete(planet.exploits, planet.activity, planet.pop, planet.tax) * 0.95;
      // Supposons que l'AC réduit le revenu de chaque planète selon son pourcentage
      const revenuApresAC = revenu - (revenu * acPercentage / 100);
      return acc + revenuApresAC;
  }, 0);
}

// Fonction pour simuler la suppression de chaque planète et calculer le nouveau revenu total avec AC
function simulerSuppressionEtCalculerNouveauRevenuAvecAC(revenuTotalInitial, data) {
  data.forEach((planetToRemove, index) => {
      let newData = [...data.slice(0, index), ...data.slice(index + 1)];
      let nouveauRevenuTotal = calculerRevenuTotalAvecAC(newData);
      const planetIncome = calculRevenuParPlanete(planetToRemove.exploits, planetToRemove.activity, planetToRemove.pop, planetToRemove.tax) * 0.95;
      coreData.find(planet => planet.nom === planetToRemove.nom).revenu = (revenuTotalInitial - nouveauRevenuTotal);      

      console.log(`Revenu total après suppression de ${planetToRemove.nom}: ${numeral(nouveauRevenuTotal).format('0,0')}, différence: ${numeral(revenuTotalInitial - nouveauRevenuTotal).format('0,0')}, revenu initial: ${numeral(revenuTotalInitial).format('0,0')}`);
  });
}



async function initSimulation() {
  const gameId = await localforage.getItem('currentGameId')
  const currentPlanets = await localforage.getItem(gameId + '-currentPlanets')

  currentPlanets.data.forEach((planet) => {

    coreData.push({
      nom: planet.name,
      pop: planet.pop,
      exploits : planet.numExploits,
      activity: planet.activity,
      gov: Hyp.governments[planet.governmentId],
      tax: planet.tax,
      civ: planet.civ,
      revenu: 0
    });
  });

let revenuTotalInitial = calculerRevenuTotalAvecAC(coreData);
simulerSuppressionEtCalculerNouveauRevenuAvecAC(revenuTotalInitial, coreData);


}

//
window.setTimeout(() => {
  initSimulation()
  setCash()
}, 100)