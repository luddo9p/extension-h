const { google } = require('googleapis')

const customHeaders = {
  'Access-Control-Allow-Origin': '*', // Autorise toutes les origines
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const credentialsJson = Buffer.from(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
  'base64'
).toString('utf-8')
const credentials = JSON.parse(credentialsJson)

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
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk' // L'ID de votre Google Sheet
  const range = formattedData.player + '!A1'

  const ranges = [
    formattedData.player + '!B106',
    formattedData.player + '!B107',
    formattedData.player + '!A115',
  ]

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: formattedData.planets },
    })

    // Mise à jour de B106
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: ranges[0],
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[formattedData.upkeep]] },
    })

    // Mise à jour de B107
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: ranges[1],
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[formattedData.deployment]] },
    })

    // Mise à jour de A115
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: ranges[2],
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[new Date()]] },
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
