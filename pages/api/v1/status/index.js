import database from "infra/database.js"

async function status(reuqest, response) {
  const result = await database.query("SELECT 1 + 1 AS sum;");
  console.log(result.rows);

  response.status(200).json({ "chave": "Essa api é melhor que o milho verde" })
}

export default status;