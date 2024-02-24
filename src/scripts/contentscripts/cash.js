const setCash = async function () {
  const gameId = await localforage.getItem('currentGameId')
  const currentPlanets = await localforage.getItem(gameId + '-currentPlanets')
  var income = $('.cashTotals')
    .find('.hr')
    .eq(0)
    .text()
    .replace(',', '')
    .replace(',', '')
    .replace(',', '')
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

  const upkeep = Math.abs($(document).find('.cashArray').eq(0).find('tr').eq(2).find('.hr').text().replace(/\D/g, ''))

    const upk = upkeep / ((income - ac)) * 100

    console.log('upkeep', upk.toFixed(2))

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
  let incomes = []
  $('.cashArray').each((index, table) => {
    if (index > 0 && index < $('.cashArray').length - 1) {
      const indexTr =
        $(table).find('.hr').eq(0).text().replace(/\D/g, '') === '750000'
          ? 1
          : 0

      const income = $(table).find('.hr').eq(indexTr).text().replace(/\D/g, '')

      const planetName = $(table).parent().parent().find('.planet b').text()

      const profit = $(table).find('.highlight').html().replace('profit <hr>', '').replace(/\D/g, '')
      console.log('profit', profit)

      incomes.push({
        planet: planetName,
        total: parseInt(income, 10),
        totalFormat: numeral(parseInt(income, 10)).format('0,0'),
        profitFormat: numeral(parseInt(profit, 10)).format('0,0'),
        profit: parseInt(profit, 10),
      })
    }
  })

  const totalInflu = numeral(
    _.sumBy(_.slice(_.orderBy(incomes, ['total'], ['desc']), 0, 11), 'total')
  ).format('0,0')
  let _wtrs = 0
  let $lis = ''
  _.orderBy(incomes, ['profit'], ['desc']).forEach((row, index) => {
    var find = currentPlanets.data.find(
      (item) => item.name === row.planet.trim()
    )
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
    <td>${find.tax}</td>
    <td>${find.civ}</td>
    <td>${gov}${govLeft}</td>
    <td>${numeral(find.pop).format('0,0')}</td><td>${numeral(
      find.activity
    ).format('0,0')}</td><td>${row.profitFormat}</td><td>${(
      ((find.numExploits * 10) / find.pop) *
      100
    ).toFixed(2)} / 100</td></tr>`
  })
  let avg = _wtrs / incomes.length
  $('.cashTotals').append(`<br/><h4>CT: ${numeral(dp / 3).format(
    '0,0'
  )} - NET TI : ${numeral(income - ac).format('0,0')} - UK ${upk.toFixed(2)}% - WTR AVG: ${avg.toFixed(2)}</h4>
  <br/>
   <table class="income-list switches" style="text-align:left"><thead>
    <tr>
      <td>Planet</td>
      <td>Exploits</td>
      <td>Wtr</td>
      <td>Civ</td>
      <td>Gov</td>
      <td>Pop</td>
      <td>Activity</td>
      <td>Profit</td>
      <td>Ratio</td>
    </tr>
   </thead>${$lis}</<table>
`)
}
setCash()
