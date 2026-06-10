const BREED_URL = 'http://127.0.0.1:8000/racas/'
const SPECIES_URL = 'http://127.0.0.1:8000/especies/' 

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }
}

export const buscarRacas = async () => {
  const response = await fetch(BREED_URL, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Erro ao buscar raças.')
  return await response.json()
}

export const cadastrarRaca = async (dadosRaca) => {
  const response = await fetch(BREED_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dadosRaca)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar raça.')
  return data
}

export const buscarEspecies = async () => {
  const response = await fetch(SPECIES_URL, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error('Erro ao buscar espécies.')
  return await response.json()
}