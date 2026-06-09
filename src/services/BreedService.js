const BASE_URL = 'http://127.0.0.1:8000/racas/' 

export const buscarRacas = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('authToken')}`
    }
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar raças.')
  }

  return await response.json()
}