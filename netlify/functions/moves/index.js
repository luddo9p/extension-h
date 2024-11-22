const { google } = require('googleapis')

const customHeaders = {
  'Access-Control-Allow-Origin': '*',
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

  // Ajout de logs pour le débogage
  console.log('Event body:', event.body)
  
  const formattedData = JSON.parse(event.body)
  console.log('Parsed data:', formattedData)
  console.log('Player value:', formattedData.player)

  const dataToSubmit = formattedData.moves.map((move) => [move])
  console.log('Data to submit:', dataToSubmit)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk'
  let range = ''
  let clearRange = ''
  
  // Ajout d'un log avant le switch
  console.log('Testing switch case for player:', formattedData.player)
  
  switch (formattedData.player) {
    case 'Gescom':
      range = 'moves!A2:A'
      console.log('Matched Gescom case')
      break
      case 'Gaius-Baltar':
        range = 'controlled!A2:A'
        break
    case 'Synopsia':
      range = 'moves!D2:D'
      console.log('Matched Synopsia case')
      break
    case 'Vanbuskirk10':
      range = 'moves!E2:E'
      console.log('Matched Vanbuskirk10 case')
      break
    case 'Varkenslacht':
      range = 'moves!F2:F'
      console.log('Matched Varkenslacht case')
      break
    default:
      console.log('No match found in switch case')
      return {
        statusCode: 200,
        headers: customHeaders,
        body: JSON.stringify({ 
          error: 'Invalid player name',
          receivedPlayer: formattedData.player,
          expectedPlayers: ['Gescom', 'Synopsia', 'Vanbuskirk10', 'Varkenslacht']
        })
      };
  }

  clearRange = range

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