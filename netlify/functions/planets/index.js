const { google } = require('googleapis')

const customHeaders = {
  'Access-Control-Allow-Origin': '*', // Autorise toutes les origines
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: customHeaders,
      body: '',
    }
  }
  // Supposons que 'rawPlanets' est passé via event.body
  const formattedData = JSON.parse(event.body)

  // Configurez l'authentification
  const auth = new google.auth.GoogleAuth({
    keyFile: './hypcores-8b844421a55e.json', // Chemin vers le fichier JSON de clés privées
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk' // L'ID de votre Google Sheet
  const range = formattedData.player + '!A1' // La plage à mettre à jour

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: formattedData.planets },
    })

    return {
      headers: customHeaders,
      statusCode: 200,
      body: JSON.stringify(response.data),
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du spreadsheet :', error)
    return {
      headers: customHeaders,
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
