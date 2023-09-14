const setCash = async function () {
  const gameId = await localforage.getItem('currentGameId')
  const currentPlanets = await localforage.getItem(gameId + '-currentPlanets')
  console.log(currentPlanets)
  var income = $('.cashTotals')
    .find('.hr')
    .eq(0)
    .text()
    .replace(',', '')
    .replace(',', '')
    .replace(',', '')
  var ac = Math.abs(
    $('.cashTotals')
      .find('.hr')
      .eq(1)
      .text()
      .replace(',', '')
      .replace(',', '')
      .replace(',', '')
  )
  var dp = Math.abs(
    $('.cashTotals')
      .find('.hr')
      .eq(4)
      .text()
      .replace(',', '')
      .replace(',', '')
      .replace(',', '')
  )
  // $('.cashTotals')
  //   .find('.line0')
  //   .eq(0)
  //   .find('td')
  //   .eq(0)
  //   .append(
  //     `<tr>
  //   <td>
  // 		<small>demo cost : ` +
  //       numeral(income - income * 0.988).format('0,0') +
  //       `<br/>
  // 		auth cost : ` +
  //       numeral(income - income * 0.984).format('0,0') +
  //       `<br/>
  // 		dict cost : ` +
  //       numeral(income - income * 0.98).format('0,0') +
  //       `<br/>
  // 		prot cost : ` +
  //       numeral(income - income * 1).format('0,0') +
  //       `</small>
  // 	<td>
  // </tr>`
  //   )
  let incomes = []
  $('.cashArray').each((index, table) => {
    if (index > 0 && index < $('.cashArray').length - 1) {
      const indexTr =
        $(table).find('.hr').eq(0).text().replace(/\D/g, '') === '750000'
          ? 1
          : 0

      const income = $(table).find('.hr').eq(indexTr).text().replace(/\D/g, '')

      const planetName = $(table).parent().parent().find('.planet b').text()

      incomes.push({
        planet: planetName,
        total: parseInt(income, 10),

        totalFormat: numeral(parseInt(income, 10)).format('0,0'),
      })
    }
  })

  const totalInflu = numeral(
    _.sumBy(_.slice(_.orderBy(incomes, ['total'], ['desc']), 0, 11), 'total')
  ).format('0,0')
  let _wtrs = 0
  let $lis = ''
  _.orderBy(incomes, ['total'], ['desc']).forEach((row, index) => {
    var find = currentPlanets.data.find(
      (item) => item.name === row.planet.trim()
    )
    if (!find) return
    console.log(find)
    var race = find.raceId === 0 ? 'H' : 'A'
    race = find.raceId === 2 ? 'X' : race
    var prod = find.productId === 0 ? 'A' : 'M'
    prod = find.productId === 2 ? 'T' : prod
    var gov = find.governmentId === 2 ? 'demo' : 'dict'
    gov = find.governmentId === 3 ? 'auth' : gov
    var overExploited = find.numExploits * 10 > find.pop ? 'overexploited' : ''
    var govLeft = ''
    if (find.governmentDaysLeft > 0) {
      govLeft = ` (${find.governmentDaysLeft})`
    }
    _wtrs += find.tax
    $lis += `<tr class="${overExploited}"><td>${
      index + 1
    }. <a href="/servlet/Planetprod?planetid=${find.id}" target="_blank">${
      row.planet
    }</a> (${race}${prod})</td><td>${find.numExploits}</td>
    <td>${find.tax}</td>
    <td>${find.civ}</td>
    <td>${gov}${govLeft}</td>
    <td>${numeral(find.pop).format('0,0')}</td><td>${numeral(
      find.activity
    ).format('0,0')}</td><td>${row.totalFormat}</td><td>${(
      ((find.numExploits * 10) / find.pop) *
      100
    ).toFixed(2)} / 100</td></tr>`
  })
  let avg = _wtrs / incomes.length
  $('.cashTotals').append(`<h4>CT: ${numeral(dp / 3).format(
    '0,0'
  )} - NET TI : ${numeral(income - ac).format('0,0')} - UK 25% : ${numeral(
    (income - ac) * 0.25
  ).format('0,0')} - WTR AVG: ${avg.toFixed(2)}</h4>
   <table class="income-list switches" style="text-align:left"><thead>
    <tr>
      <td>Planet</td>
      <td>Exploits</td>
      <td>Wtr</td>
      <td>Civ</td>
      <td>Gov</td>
      <td>Pop</td>
      <td>Activity</td>
      <td>Income</td>
      <td>Ratio</td>
    </tr>
   </thead>${$lis}</<table>
`)
}
setCash()
