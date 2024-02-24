const { google } = require('googleapis')

async function accessSpreadsheet() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './hypcores-8b844421a55e.json', // Le chemin vers le fichier JSON d'authentification
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  })

  const client = await auth.getClient()
  const googleSheets = google.sheets({ version: 'v4', auth: client })

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk' // Remplacez par l'ID de votre Google Spreadsheet

  const range = 'Gescom!A1:H42' // Ajustez selon la plage de cellules que vous souhaitez lire

  const response = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  })

  function planetIncome(activity, exploits, pop, wtr) {

    // Conversion et vérification des valeurs
    activity = Number(activity)
    exploits = Number(exploits)
    pop = Number(pop)

    if (isNaN(activity) || isNaN(exploits) || isNaN(pop)) {
      console.error('Une ou plusieurs valeurs entrées ne sont pas des nombres.')
      return NaN
    }

    const fullValueExploitsThreshold = pop / 10
    const fullValueExploits = Math.min(exploits, fullValueExploitsThreshold)
    const overExploitedExploits = Math.max(
      0,
      exploits - fullValueExploitsThreshold
    )

    const fullValueIncome = activity * fullValueExploits
    const reducedValueIncome = activity * overExploitedExploits * 0.666

    const totalAdjustedIncome = (fullValueIncome + reducedValueIncome) * 3

    const taxWtr = (wtr/100) * totalAdjustedIncome

    const totalIncomeWtr = totalAdjustedIncome - taxWtr

    const upkeepCostPerExploit = 4600
    const totalUpkeepCost = exploits * upkeepCostPerExploit

    return Math.round(totalIncomeWtr - totalUpkeepCost)
  }

  function calculateACTax(avgPop, totalDemo, totalAuth, totalDict, totalHyp) {
    const acTax = (1 -
      (0.988 - (avgPop / 1000) * 0.00002) ** totalDemo *
      (0.98 - (avgPop / 1000) * 0.00002) ** totalDict *
      (0.984 - (avgPop / 1000) * 0.00026) ** totalAuth *
      (1 - (avgPop / 1000) * 0.002) ** totalHyp) * 100;
  
    return acTax;
  }
  
  function calculateACCalculated(ti, acTax) {
    const acCalculated = (acTax / 100) * ti;
    return acCalculated;
  }

  function calculateTotalsAndAvgPop(rows) {
    let totalDemo = 0, totalAuth = 0, totalDict = 0, totalHyp = 0, totalPop = 0;
  
    rows.forEach(row => {
      const pop = parseFloat(row[6]);
      const gov = row[7];
      if (!isNaN(pop)) {
        totalPop += pop;
        if (gov === 'demo') totalDemo += 1;
        else if (gov === 'auth') totalAuth += 1;
        else if (gov === 'dict') totalDict += 1;
        else if (gov === 'hyp') totalHyp += 1;
      }
    });
  
    const avgPop = totalPop / rows.length;
    return { totalDemo, totalAuth, totalDict, totalHyp, avgPop };
  }

  const header = response.data.values[0]

  const rows = response.data.values
  if (rows && rows.length) {
    const totals = calculateTotalsAndAvgPop(rows.slice(1));
    rows.slice(1).forEach((row, i) => {
      // Ignorer l'en-tête
      if (i > 42) return
      const name = row[0]
      const civ = row[1]
      const prod = row[2]
      const activity = parseFloat(row[3].replace(/,/g, ''))
      const income = parseFloat(row[4].replace(/,/g, ''))
      const exploits = parseFloat(row[5])
      const pop = parseFloat(row[6])
      const gov = row[7]

      console.log(
        `Nom: ${name}, Activity: ${activity}, Exploits: ${exploits}, Pop: ${pop}, wtr: 30`
      )
      if (!isNaN(activity) && !isNaN(exploits)) {
        const result = planetIncome(activity, exploits, pop, 30)
        console.log(`Résultat pour ${row[0]}: notre calcul : ${result}, calcul donné par le jeu : ${income}`)
      }
    })
  } else {
    console.log('Aucune donnée trouvée.')
  }
}

accessSpreadsheet().catch(console.error)
