function mapearVacinacoes(vaccination) {
    return {
        id: vaccination.id,
        data: vaccination.vaccinatedAt,
        peso_animal: vaccination.weight_at,
        animal: vaccination.animal,
        funcionario: vaccination.employee || 81,
    };
}

export async function buscarVacinacoes() {
  try {
    const response = await fetch('http://127.0.0.1:8000/vacinacoes/')
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    return data.map(vaccination => mapearVacinacoes(vaccination))
    
  } catch (error) {
    console.error('Erro na requisição fetch:', error)
    return []
  }
}

export async function buscarItensVacina() {
  try {
    const response = await fetch('http://127.0.0.1:8000/itens-vacina/')
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    return data.map(vaccination => mapearVacinacoes(vaccination))
    
  } catch (error) {
    console.error('Erro na requisição fetch:', error)
    return []
  }
}


export async function cadastrarVacinacao(payload) {
  const response = await fetch('http://127.0.0.1:8000/vacinacoes/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const erroDjango = await response.text()
    throw new Error(erroDjango) 
  }
  
  return await response.json()
}

export async function cadastrarItensVacina(payload) {
  const response = await fetch('http://127.0.0.1:8000/itens-vacina/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const erroDjango = await response.text()
    throw new Error(erroDjango) 
  }
  
  return await response.json()
}
