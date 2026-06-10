function mapearVacina(vacina) {
    return {
        id: vacina.id,
        nome: vacina.name,
        descricao: vacina.description || 'Sem descrição',
        anos_prevencao: vacina.years_prevention || 1,
        fabricante: vacina.manufacturer || 'Não informado',
    };
}

export async function buscarVacinas() {
  try {
    const response = await fetch('http://127.0.0.1:8000/vacinas/')
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    return data.map(vacina => mapearVacina(vacina))
    
  } catch (error) {
    console.error('Erro na requisição fetch:', error)
    return []
  }
}

export async function buscarVacinaPorId(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/vacinas/${id}/`)
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
    
    const data = await response.json()
    return mapearVacina(data) 
    
  } catch (error) {
    console.error(`Erro ao buscar a vacina com ID ${id}:`, error)
    return null
  }
}

export async function atualizarVacina(id, statusData) {
  const response = await fetch(`http://127.0.0.1:8000/vacinas/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(statusData)
  })
  if (!response.ok) throw new Error('Erro ao atualizar vacina')
  return await response.json()
}

export async function cadastrarVacina(payload) {
  const response = await fetch('http://127.0.0.1:8000/vacinas/', {
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

export async function deletarVacina(id) {
  const response = await fetch(`http://127.0.0.1:8000/vacinas/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${localStorage.getItem('authToken')}`
    }
  })
  if (!response.ok) throw new Error('Erro ao deletar vacina')
  return true;
}