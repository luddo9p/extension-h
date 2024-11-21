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

function extraireNomPlanete(chaine) {
    // Vérifie si la chaîne contient "[", sinon retourne la chaîne telle quelle
    if (!chaine.includes('[')) {
      return chaine.trim(); // Utilise trim() pour enlever les espaces superflus
    }
  
    const regex = /^(.*?) \[/;
    const correspondance = chaine.match(regex);
  
    if (correspondance && correspondance[1]) {
      // Si une correspondance est trouvée, retourne le nom en enlevant les espaces superflus
      return correspondance[1].trim();
    } else {
      // Affiche une erreur dans la console si le format attendu n'est pas trouvé
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
    }
  }

  // Configurez l'authentification
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = '1tg5EYvmh8igOLAuhO5ZUJ06mfNwfoHvmJTgiw88f0lk' // L'ID de votre Google Sheet
  try{

        const ranges = ['BS!A:B'];
        let dataCombined = [];
    
        for (let range of ranges) {
          const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: range,
          });
    
          if (Array.isArray(response.data.values)) {
            const data = response.data.values.map(row => ({
              'player': row[0],
              'planet': extraireNomPlanete(row[1]),
            }));
    
            dataCombined = dataCombined.concat(data);
          }
        }
  
      return {
        headers: customHeaders,
        statusCode: 200,
        body: JSON.stringify(dataCombined),
      };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du spreadsheet :', error)
    return {
      headers: customHeaders,
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
