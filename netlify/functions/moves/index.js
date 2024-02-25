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
  const dataToSubmit = formattedData.moves.map((move) => [move])

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk'
  let range = ''
  let clearRange = ''
  switch (formattedData.player) {
    case 'Gescom':
      range = 'moves!A2:A'
      break
    case 'Ninurta':
      range = 'moves!B2:B'
      break
    case 'Sidious':
      range = 'moves!C2:C'
      break
    case 'Synopsia':
      range = 'moves!D2:D'
      break
    case 'Vanbuskirk10':
      range = 'moves!E2:E'
      break
    case 'Varkenslacht':
      range = 'moves!F2:F'
      break
    case 'Seymour':
      range = 'moves!G2:G'
      break
    case 'Tleilax':
      range = 'moves!H2:H'
      break
    case 'Wakka':
      range = 'moves!I2:I'
      break
    case 'Scratchy007':
      range = 'moves!J2:J'
      break
    case 'Razesty':
      range = 'moves!K2:K'
      break
    case 'FiFi':
      range = 'moves!L2:L'
      break
    default:
      // Gérer le cas où le joueur n'est pas reconnu
      break
  }

  clearRange = range // Utiliser la même plage pour nettoyer et mettre à jour les données

  try {
    // Nettoyer la colonne
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: clearRange,
    })

    // Mettre à jour avec les nouvelles données
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
