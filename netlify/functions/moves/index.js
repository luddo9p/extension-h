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

  const formattedData = JSON.parse(event.body)

  // S'assurer que les données sont au format attendu par l'API
  const dataToSubmit = formattedData.moves.map((move) => [move])

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk'
  let range = ''
  if (formattedData.player === 'Gescom') {
    range = 'moves!A2'
  }
  if (formattedData.player === 'Ninurta') {
    range = 'moves!B2'
  }
  if (formattedData.player === 'Sidious') {
    range = 'moves!C2'
  }
  if (formattedData.player === 'Synopsia') {
    range = 'moves!D2'
  }
  if (formattedData.player === 'Vanbuskirk10') {
    range = 'moves!E2'
  }
  if (formattedData.player === 'Varkenslacht') {
    range = 'moves!F2'
  }

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: dataToSubmit },
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
