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

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk'

  try {
    // Prépare les plages de données à récupérer en parallèle
    const ranges = 'ABCDEFGHIJKL'
      .split('')
      .map((column) => `moves!${column}:${column}`)

    // Exécute toutes les requêtes en parallèle
    const responses = await Promise.all(
      ranges.map((range) =>
        sheets.spreadsheets.values.get({ spreadsheetId, range })
      )
    )

    // Fusionne les données de toutes les réponses
    const allPlayers = responses.flatMap((response) => {
      const data = response.data.values
      return data.slice(1).map((row) => ({
        planet: row[0].split(' - ')[0],
        avgp: row[0].split(' - ')[1],
        gas: row[0].split(' - ')[2],
        traveTime:  parseInt(row[0].split(' - ')[3]),
        eta: row[0].split('@')[1],
        player: data[0][0],
      }))
    })

    return {
      headers: customHeaders,
      statusCode: 200,
      body: JSON.stringify(allPlayers),
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
