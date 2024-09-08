const { google } = require('googleapis');

const customHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const credentialsJson = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8');
const credentials = JSON.parse(credentialsJson);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: customHeaders,
      body: '',
    };
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk';

  try {
    const range = 'AttackList!A1:Z'; // Récupérer les colonnes nécessaires
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return {
        headers: customHeaders,
        statusCode: 200,
        body: JSON.stringify({ message: 'Aucune donnée trouvée.' }),
      };
    }

    // Récupérer les joueurs depuis la première ligne (noms des colonnes)
    const players = rows[0];
    const playerData = {};

    // Boucle pour chaque colonne (joueur)
    players.forEach((player, index) => {
      const planets = rows.slice(1).map(row => row[index]).filter(Boolean); // Exclure les valeurs nulles/vides
      playerData[player] = planets;
    });

    return {
      headers: customHeaders,
      statusCode: 200,
      body: JSON.stringify(playerData),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données du spreadsheet :', error);
    return {
      headers: customHeaders,
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur lors de la récupération des données.' }),
    };
  }
};
