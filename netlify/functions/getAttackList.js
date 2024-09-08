const { google } = require('googleapis');

const customHeaders = {
  'Access-Control-Allow-Origin': '*', // Autorise toutes les origines
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const credentialsJson = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8');
const credentials = JSON.parse(credentialsJson);

function extraireNomPlanete(chaine) {
  if (!chaine.includes(' -')) {
    return chaine.trim(); // Utilise trim() pour enlever les espaces superflus
  }

  const regex = /^(.*?) \[/;
  const correspondance = chaine.match(regex);

  if (correspondance && correspondance[1]) {
    return correspondance[1].trim();
  } else {
    console.error("Le format de la chaîne n'est pas correct ou le nom de la planète est manquant.");
    return ''; // Retourne une chaîne vide pour indiquer qu'aucun nom valide n'a été extrait
  }
}

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

  const allPlayers = [];

  try {
    // Colonnes de A à L
    const columns = 'ABCDEFGHIJKL'.split('');
    for (const column of columns) {
      const range = `AttackList!${column}:${column}`;

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: range,
      });

      const data = response.data.values;
      const players = data.slice(1).map((row) => ({
        list: row[0].split(' - ')[0],
        player: data[0][0],
      }));

      allPlayers.push(...players);
    }

    return {
      headers: customHeaders,
      statusCode: 200,
      body: JSON.stringify(allPlayers),
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du spreadsheet :', error);
    return {
      headers: customHeaders,
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
