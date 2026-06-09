const BASE_URL = 'http://127.0.0.1:8000/caracteristicas/' 

export const buscarCaracteristicas = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('authToken')}` 
    }
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar características.')
  }

  return await response.json()
}