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
      .map((column) => `foreign!${column}:${column}`)

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
        neutral: row[0].includes('Neutral'),
        status: row[0].includes('Att') ? 'Att' : 'Def',
        stasis: row[0].includes('Stasis'),
        spaceAvgp: row[0].split(' - ')[3],
        player: data[0][0],
      }))
    })

    // Suppression des doublons avec considération de 'neutral'
    const uniquePlayers = allPlayers.reduce((acc, player) => {
      const existing = acc.find((p) => p.planet === player.planet)
      if (existing) {
        // Si 'neutral' est true dans l'une des entrées, conservez cette valeur
        if (player.neutral) {
          existing.neutral = true
        }
      } else {
        acc.push(player)
      }
      return acc
    }, [])

    return {
      headers: customHeaders,
      statusCode: 200,
      body: JSON.stringify(uniquePlayers),
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
