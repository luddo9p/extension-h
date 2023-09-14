const { supabase } = require("../utils/database");

const headers = {
  "access-control-allow-origin": "*",
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};


const handler = async (dto) => {

  let bodyParsed = JSON.parse(dto.body);

  const { name, player, planet_id, stasis, nrj,  } = bodyParsed;

  try {

    const isAlreadyInsreted = await supabase
    .from("user")
    .select("*", { count: "exact", head: true })
    .eq("email", email);


    if(isAlreadyInsreted.count === 1) {
      return {
          statusCode: 401,
          body: `user is already inserted`,
          headers,
        };
    }

    const ins = await register({
        first_name,
        last_name,
        email,
        phone
    });

    console.log(ins)

    return {
      statusCode: 200,
      body: `planets inserted`,
      headers,
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: "An error occured, consult log for more information " + JSON.stringify(err),
      headers,
    };
  }

};

module.exports = { handler };