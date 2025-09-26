function status(reuqest, response) {
  response.status(200).json({ "chave": "Essa api é melhor que o milho verde" })
}

export default status;